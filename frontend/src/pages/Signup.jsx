import React, { useState } from 'react'
import image from '../assets/add-male-user-color-icon.svg'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion' 
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';


const fadeInStagger = (i) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, type: 'spring' }
  }
});

const dataName = [
  'username', 
  'email', 
  'fullname',
  'password',
  'avatar'
]

function Signup() {

  const [dataInfo, setDataInfo] = useState({
    username: "",
    email: "",
    fullname: "",
    password: ""
  })
  const [avatar, setAvatar] = useState(null)
  const navigate=useNavigate()

  const handleChange = (e)=>{
    const {name, value, files}=e.target

    if(name === 'avatar'){
      setAvatar((prev)=>({
        ...prev,
        [name]: files[0]
      }))
    }
    else{
      setDataInfo((prev)=>({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try {
      const data = new FormData()
      for(const key in dataInfo){
        data.append(key, dataInfo[key].trim())
      }
      if(avatar){
        data.append('avatar', avatar.avatar)
      }

      const resp = await axios.post("/api/v1/users/register",data,{
        withCredentials: true, 
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      const result = resp.data;

      if(result.success){
        toast.success("Account created! Please check your email to verify.", {
          autoClose: 2000,
          onClose: () => navigate('/verifyEmail')
        });
      }
      else{
        toast.error(result.message  || "Signup failed. Please try again.", {
          autoClose: 2000
        });
      }
      
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Something went wrong. Please try again.",{
        autoClose: 2000,
      });
    }
  }

  const bubble = (style) =>{
    return <div className={`absolute rounded-full animate-ping ${style}`} />
  }
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 via-fuchsia-500 to-purple-500 text-white px-4">
    
    {/* Background bubbles */}
    {bubble("w-40 h-40 top-10 left-10 bg-blue-400")}
    {bubble("w-20 h-20 top-20 left-20 bg-blue-400")}
    {bubble("w-32 h-32 bottom-10 right-10 bg-fuchsia-400")}
    {bubble("w-16 h-16 bottom-18 right-18 bg-fuchsia-400")}

    <div
      className="absolute flex justify-center z-10 w-full max-w-md sm:max-w-lg md:max-w-xl"
      style={{ height: "720px" }}
    >
      {/* SVG Background */}
      <svg viewBox="0 0 500 700" className="absolute w-full h-auto">
        <circle cx="250" cy="10" r="220" fill="#9333ea" />
      </svg>
      <svg viewBox="0 0 560 700" className="absolute w-full h-auto">
        <circle cx="280" cy="700" r="240" fill="#9333ea" />
      </svg>

      <AnimatePresence>
        <motion.div
          key="from"
          initial={{ opacity: 0, scale: 0.6, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 5 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          className="bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-3xl shadow-2xl w-full z-10 flex flex-col items-center"
        >
          <motion.img
            src={image}
            alt="Sign Up Illustration"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-4 drop-shadow-lg"
          />

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-white text-xl sm:text-2xl font-bold text-center mb-4 drop-shadow-lg"
          >
            Sign Up
          </motion.h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {dataName.map((field, i) => (
              <motion.div
                key={field}
                custom={i}
                variants={fadeInStagger(i)}
                initial="hidden"
                animate="visible"
              >
                <div className="relative w-80 -mb-1.5">
                  <label htmlFor={field} className="block mb-0.5 text-white text-sm sm:text-base">
                    {field === "confirmPassword"
                      ? "Confirm Password"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={
                      field === "avatar"
                        ? "file"
                        : field.includes("password")
                        ? "password"
                        : "text"
                    }
                    accept={field === "avatar" ? "image/*" : undefined}
                    name={field}
                    id={field}
                    required={field !== "avatar"}
                    placeholder=" "
                    onChange={handleChange}
                    className={`peer w-full px-3 py-2 ${
                      field === "avatar"
                        ? "bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                        : "text-white bg-white/10"
                    } border border-white/30 rounded-md placeholder-transparent focus:outline-none focus:ring-4 focus:ring-purple-500 focus:scale-[1.02] sm:focus:scale-[1.05] focus:bg-white/20 backdrop-blur transition-all duration-300`}
                  />
                </div>
              </motion.div>
            ))}

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px 4px rgba(255,255,255,0.3)",
              }}
              whileTap={{ scale: 0.9 }}
              className="w-40 ml-18 mt-1 bg-purple-600 hover:bg-purple-700 transition font-bold py-3 rounded-xl"
            >
              Create Account
            </motion.button>

            <p className="text-center text-xs sm:text-sm text-white -mt-1">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-800 underline hover:text-white">
                Login
              </Link>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
    <ToastContainer position="top-right" />
  </div>
  )
}

export default Signup
