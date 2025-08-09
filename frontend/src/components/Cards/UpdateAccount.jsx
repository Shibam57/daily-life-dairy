import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getCurrentUser } from './userApi';
import { FaUser, FaSignature } from "react-icons/fa"

function UpdateAccount() {
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getCurrentUser()
        setFormData({
          username: data?.user?.username || '',
          fullname: data?.user?.fullname || '',
        });
      } catch (err) {
        toast.error('Failed to load user details');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      const { data } = await axios.patch(
        '/api/v1/users/update-account',
        formData,
        { withCredentials: true }
      );

      toast.success(data?.message || 'Account updated successfully');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update account'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
     <motion.div
      className="max-w-md mx-auto my-20 px-6 py-10 bg-white rounded-3xl shadow-2xl border border-blue-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.h2
        className="text-3xl font-bold text-center text-blue-800 mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        ✏️ Update Account
      </motion.h2>
      <p className="text-center text-gray-500 mb-6">
        Make changes to your profile details
      </p>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Username */}
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Full Name */}
        <div className="relative">
          <FaSignature className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "✅ Save Changes"}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default UpdateAccount;