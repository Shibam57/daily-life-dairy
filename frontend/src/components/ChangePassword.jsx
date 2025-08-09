import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

function ChangePassword() {
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { currentPassword, newPassword, confirmNewPassword } = passwordInfo;

  const handleChange = (e)=>{
    const {name, value} = e.target

    setPasswordInfo((prev)=>({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('Confirm password does not match!');
      return;
    }

    try {
      const data = new FormData();
      for (const key in passwordInfo) {
        data.append(key, passwordInfo[key]);
      }

      setLoading(true);
      const res = await axios.post(
        '/api/v1/users/change-password',
        passwordInfo,
        { withCredentials: true }
      );

      toast.success(res.data?.message || 'Password changed successfully!',{
        autoClose: 2000,
        onClose: () => navigate('/login')
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  
3
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 via-white to-gray-300 text-gray-800">
      <motion.div
        className="bg-white/10 border border-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
        className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut"
        }}
        >
          Change Password
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className="w-full px-3 py-2 rounded bg-white/10 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="w-full px-3 py-2 rounded bg-white/10 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              className="w-full px-3 py-2 rounded bg-white/10 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={confirmNewPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-bold text-white transition disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default ChangePassword;