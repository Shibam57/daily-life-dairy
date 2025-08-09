import React from 'react'
import { motion } from 'framer-motion'
import { AiOutlineClose } from 'react-icons/ai'
import { FaMagnifyingGlass } from "react-icons/fa6";

function SearchBar({value, onChange, handleSearch, onClearSearch}) {
  return (
    <motion.div
    className="sm:w-60 md:w-80 flex  items-center px-4 rounded-md"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    >
        <form onSubmit={handleSearch} className='flex items-center'>
            <input type="text" 
            value={value} 
            onChange={onChange}
            placeholder="Search notes..."
            className="px-4 py-2 rounded-md focus:outline-none border bg-white border-gray-300 
             focus:ring-4 focus:ring-purple-400 w-40 sm:w-45 md:w-70 lg:w-90 transition-all duration-300"
            />
            {value &&(
                <button 
                type="button"
                onClick={onClearSearch}
                className='ml-2 text-gray-500 hover:text-red-500'
                >
                    <AiOutlineClose size={18} />
                </button>
            )}

            <button 
            type="button"
            onClick={handleSearch}
            className='ml-2 text-white hover:text-red-500'
            >
                <FaMagnifyingGlass />
            </button>
        </form>
    </motion.div>
  )
}

export default SearchBar
