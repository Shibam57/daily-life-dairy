import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const fadeIn = (i = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.5,
      duration: 1,
      ease: 'easeOut'
    }
  }
})

const AddNote = () => {
  
    const [formData, setFromData] = useState({
        title: "",
        description: "",
        isPinned: false
    })
    const [errors, setErrors] = useState({})

    const handleChange=(e)=>{
        const {name, value, type, checked}=e.target
        setFromData((prev)=>({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const validate = ()=>{
        const newErrors = {}
        if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters'
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }
        return newErrors
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const validationErrors = validate()
        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors)
            return 
        }
        
        try {
            const res = await axios.post("/api/v1/notes/add-note", formData,{
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
            if(res.data){
                toast.success("Note added successfully")
                setFromData({title: "", description: "", isPinned:false})
                setErrors({})
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to add note')
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-pink-200">
        <motion.div
        className="absolute w-[360px] h-[460px] rounded-3xl ring-4 ring-purple-600 animate-spin-slow blur-md opacity-30 z-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        />
        <motion.div
        className="absolute w-[360px] h-[460px] rounded-3xl ring-4 ring-purple-600 animate-spin-slow blur-md opacity-30 z-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        />

        <motion.div
        className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl"
        initial="hidden"
        animate="visible"
        variants={fadeIn()}
        >
            <motion.h2 className="text-2xl font-bold mb-6 text-center text-gray-700" variants={fadeIn(0.5)}
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
                📝 Create a New Note
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={fadeIn(0.5)}>
                    <label className="block mb-1 font-semibold text-gray-600">Title</label>
                    <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter title"
                    />
                    {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title}</p>}
                </motion.div>

                <motion.div variants={fadeIn(0.5)}>
                    <label className="block mb-1 font-semibold text-gray-600">Description</label>
                    <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Write something..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </motion.div>

                <motion.div className="flex items-center gap-2" variants={fadeIn(0.5)}>
                    <input
                    type="checkbox"
                    name="isPinned"
                    checked={formData.isPinned}
                    onChange={handleChange}
                    />
                    <label className="text-gray-600">Pin this note</label>
                </motion.div>

                <motion.button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-all duration-50"
                variants={fadeIn(0.5)}
                whileHover={{ scale: 1.02 }}
                >
                    Add Note
                </motion.button>

                <motion.button
                onClick={() => window.history.back()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-all duration-50"
                variants={fadeIn(0.5)}
                whileHover={{ scale: 1.02 }}
                >
                    ← Go Back
                </motion.button>
            </form>
            <ToastContainer position="top-right" />
        </motion.div>
    </div>
  )
}

export default AddNote