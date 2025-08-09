import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: 'easeOut' },
  },
});

const EditNote = () => {

    const {noteId} = useParams()
    const navigate=useNavigate()
    const [note, setNote] = useState({title: '', description: ''})

    useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`/api/v1/notes/get-note/${noteId}`, {
          withCredentials: true,
        });
        setNote(res.data?.data);
      } catch (err) {
        toast.error('Failed to fetch note');
      }
    };

    fetchNote();
  }, [noteId]);

    const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/v1/notes/update-note/${noteId}`,
        { title: note.title, description: note.description },
        { withCredentials: true }
      );
      toast.success('Note updated successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to update note');
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto p-6">
    <motion.div
      className="absolute top-1/2 left-1/2 w-[360px] h-[460px] -translate-x-1/2 -translate-y-1/2 rounded-3xl ring-4 ring-purple-600 animate-spin-slow blur-md opacity-30 z-0"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      />
    <motion.div
      className="relative w-full max-w-xl mx-auto my-20 p-6 bg-white/20 shadow-2xl rounded-2xl"
      initial="hidden"
      animate="visible"
      variants={{ 
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      
      <motion.h2
        className="text-2xl font-bold mb-6 text-center text-gray-700"
        variants={fadeIn(0)}
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
        ✏️ Update Your Note
      </motion.h2>

      <form onSubmit={handleUpdate}>
        <motion.input
          type="text"
          placeholder="Title"
          className="w-full mb-4 p-3 border border-gray-300 rounded-md"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          variants={fadeIn(0.1)}
        />

        <motion.textarea
          placeholder="Description"
          className="w-full mb-4 p-3 border border-gray-300 rounded-md h-40"
          value={note.description}
          onChange={(e) => setNote({ ...note, description: e.target.value })}
          variants={fadeIn(0.2)}
        />

        <motion.button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          variants={fadeIn(0.3)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Update Note
        </motion.button>
      </form>
    </motion.div>
    </div>
  )
}

export default EditNote
