import React from 'react'
import { motion } from 'framer-motion';
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function NavProfile({userInfo}) {

  const navigate = useNavigate();

  const goToProfile=()=>{
    navigate("/profile",{ state: {userInfo} })
  }

  return (
    <motion.div
    className='flex items-center gap-4 bg-white px-3 py-2 rounded-md shadow-sm cursor-pointer'
    onClick={goToProfile}
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
    >
        <img src={userInfo.avatar}
        alt="avatar"
        className='w-8 h-8 rounded-full object-cover border'
        />
        <span className='font-medium text-gray-800'>{userInfo.username}</span>
    </motion.div>
  )
}

export default NavProfile
