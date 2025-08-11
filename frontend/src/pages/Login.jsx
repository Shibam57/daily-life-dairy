import React, { useState } from 'react';
import image from '../assets/add-male-user-color-icon.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import axios from "axios";

const fadeInStagger = (i) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, type: 'spring' }
  }
});

const dataName = ['username', 'email', 'password'];

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const location = useLocation()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("/api/v1/users/login",loginInfo,{
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = resp.data;
      const token = result.data.accessToken;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(result.data.user));

        toast.success("Login successful! ", {
          autoClose: 2000,
          onClose: () => navigate('/home')
        });

      }
      else {
        if (result.message === "Please verify your email before logging in.") {
          toast.warn("⚠️ Please verify your email before logging in.", {
            autoClose: 3000
          });
          return;
        }
        else{
          toast.error(result.message || "Login failed. Please try again.", {
          autoClose: 2000
          });
          return;
        }
      }

    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Something went wrong. Please try again.", {
        autoClose: 2000
      });
    }
  };

  useEffect(()=>{
    const params = new URLSearchParams(location.search);
    const isVerified = params.get('verified')

    if(isVerified === 'true'){
      toast.success("Email verified! You can now log in.")
    }
  },[location.search])

  const bubble = (style) => (
    <div className={`absolute rounded-full animate-ping ${style}`} />
  );

  return (
    <div className='min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-500 to-blue-500 text-white'>
      {bubble("w-40 h-40 top-10 right-10 bg-blue-400")}
      {bubble("w-20 h-20 top-20 right-20 bg-blue-400")}
      {bubble("w-32 h-32 bottom-10 left-10 bg-fuchsia-400")}
      {bubble("w-16 h-16 bottom-18 left-18 bg-fuchsia-400")}

      <div className='absolute flex justify-center z-10' style={{ width: '500px', height: '550px' }}>
        <svg width="500" height="550" className="absolute">
          <circle cx="10" cy="280" r="230" fill="#9333ea" />
        </svg>
        <svg width="500" height="550" className="absolute">
          <circle cx="520" cy="280" r="230" fill="#9333ea" />
        </svg>

        <AnimatePresence>
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.6, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 120, damping: 10 }}
            className='bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-3xl shadow-2xl w-full z-10 flex flex-col items-center'
          >
            <motion.img
              src={image}
              alt="Login Illustration"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="w-16 h-16 object-contain mb-4 drop-shadow-lg"
            />

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className='text-white text-2xl font-bold text-center mb-6 drop-shadow-lg'
            >
              Login
            </motion.h1>

            <form className='space-y-6' onSubmit={handleSubmit}>
              {dataName.map((field, i) => (
                <motion.div
                  key={field}
                  custom={i}
                  variants={fadeInStagger(i)}
                  initial="hidden"
                  animate="visible"
                >
                  <div className='relative w-80 -mb-1.5'>
                    <label htmlFor={field} className='block mb-0.5 text-white'>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field.includes('password') ? 'password' : 'text'}
                      name={field}
                      id={field}
                      required
                      placeholder=' '
                      onChange={handleChange}
                      className='peer w-full px-3 py-2 text-white bg-white/10 border border-white/30 rounded-md placeholder-transparent focus:outline-none focus:ring-4 focus:ring-purple-500 focus:scale-[1.05]  focus:bg-white/20 backdrop-blur transition-all duration-300'
                    />
                  </div>
                </motion.div>
              ))}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, boxShadow: '0px 0px 20px 4px rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.9 }}
                className='w-40 mt-2 ml-18 bg-purple-600 hover:bg-purple-700 transition font-bold py-3 rounded-xl'
              >
                Log In
              </motion.button>

              <p className='text-center text-sm text-white mt-2'>
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-800 underline hover:text-white">
                  Sign Up
                </Link>
              </p>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default Login;