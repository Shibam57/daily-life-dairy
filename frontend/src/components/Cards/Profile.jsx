import React,{ useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const fadeInStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    }
  }
};

const fadeItem = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay }
  }
});

function Profile() {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [userInfo, setUserInfo] = useState(location.state?.userInfo || {});
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (!userInfo) {
    return (
      <motion.p
        className="text-center mt-10 text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        No user data found.
      </motion.p>
    );
  }

  const handleFileChange = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const previewURL = URL.createObjectURL(file)
    setUserInfo((prev)=>({
      ...prev, avatar: previewURL
    }))

    const data = new FormData();
    data.append('avatar', file);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/v1/users/update-avatar/${userInfo._id}`,data,{
          
          withCredentials: true
        }
      );

      if(res.data?.data?.avatar){
          setUserInfo(prev=>({
          ...prev,
          avatar: res.data.data.avatar
        }))
      }
      
      toast.success("Profile photo update successfully!")
    } catch (error) {
      console.error(error);
      toast.error('Failed to update photo')
    } finally{
      setLoading(false)
    }
  }

  const handlePassword = ()=>{
    navigate("/change-password")
  }

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/v1/users/logout", {}, { withCredentials: true });

      toast.success("Logged out successfully!");
      navigate('/login')
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-md bg-white/80 border border-white/50"
        initial="hidden"
        animate="visible"
        variants={fadeInStagger}
      >
        <motion.div
        className="relative w-28 h-28 mx-auto mb-6"
        variants={fadeItem(0)}
        >

            <motion.img
            src={userInfo.avatar}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-lg"
            whileHover={{ scale: 1.03 }}
            
            />

            <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            />

            <motion.button
            onClick={() => fileInputRef.current.click()}
            className="absolute top-21 right-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            whileHover={{ scale: 1.1 }}
            title="Edit Image"
            >
                ✏️
            </motion.button>
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-center text-gray-800 mb-2 tracking-wide"
          variants={fadeItem(0.2)}
        >
          {userInfo.username}
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 text-lg mb-4"
          variants={fadeItem(0.4)}
        >
          {userInfo.fullname}
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-3 mb-6"
          variants={fadeItem(0.5)}
        >
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium shadow">
            ✉️ {userInfo.email}
          </span>
        </motion.div>

        <motion.button
          onClick={() => window.history.back()}
          className="block w-full py-2 text-center bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          variants={fadeItem(0.6)}
          whileHover={{ scale: 1.02 }}
        >
          ← Go Back
        </motion.button>

        <Link to="/update-account">
          <motion.button
          className="mt-4 block w-full py-2 text-center bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
          variants={fadeItem(0.63)}
          whileHover={{ scale: 1.02 }}
          >
            ✏️ Update Account
          </motion.button>
        </Link>

        <Link to="/change-password">
          <motion.button
          onClick={handlePassword}
          className="mt-4 block w-full py-2 text-center bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-all"
          variants={fadeItem(0.65)}
          whileHover={{ scale: 1.02 }}
          >
            🔒 Change Password
          </motion.button>
        </Link>

        <motion.button
          onClick={handleLogout}
          className="mt-4 block w-full py-2 text-center bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
          variants={fadeItem(0.7)}
          whileHover={{ scale: 1.02 }}
        >
          🚪 Logout
        </motion.button>
      </motion.div>
      
    </div>
  );
}

export default Profile;