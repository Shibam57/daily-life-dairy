import React from 'react'
import {motion} from "framer-motion"
import { FaThumbtack, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const cartVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: 30, transition: { duration: 0.2 } }
};
function NoteBox({note, onPinNote, onEdit, onDelete}) {
    const { title, description, createdAt, updatedAt, isPinned } = note;
    const navigate = useNavigate();

    const handleCardClick = (note)=>{
        navigate(`/get-note/${note._id}`)
    }
    
  return (
    
    <motion.div className='bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition relative min-h-[260px] max-h-[260px] flex flex-col justify-between cursor-pointer'
    variants={cartVariants}
    onClick={()=>handleCardClick(note)}
    >
        {isPinned && (
            <div className="absolute top-3 right-3 text-yellow-500">
                <FaThumbtack title="Pinned" />
            </div>
        )}

        <h2 className='text-xl font-semibold text-indigo-600 mb-2 break-words'>
            {title}
        </h2>

        <p className="text-gray-700 break-words mb-3 line-clamp-3">{description}</p>

        <p className="text-sm text-gray-400 mb-1">
            Created: {new Date(note.createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-400 mb-4">
            Updated: {new Date(note.updatedAt).toLocaleString()}
        </p>

        <div className='flex space-x-5'>
            <button onClick={()=>onPinNote(note)} className='text-yellow-500 hover:text-yellow -600' title={isPinned?"Unpin":"Pin"}>
                <FaThumbtack />
            </button>
            <button onClick={(e)=>{
                e.stopPropagation();
                onEdit(note)
            }} className='text-blue-500 hover:text-blue-600' title='Edit'>
                <FaEdit/>
            </button>
            <button onClick={(e) => {
                e.stopPropagation();
                onDelete(note);
                }} 
            className='text-red-500 hover:text-red-600' title='Delete'
            >
                <FaTrash/>
            </button>
        </div>
    </motion.div>
    
  )
}

export default NoteBox
