import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import NoteBox from "../components/Cards/NoteBox"
import { useOutletContext } from "react-router-dom";
import { getCurrentUser } from "../components/Cards/userApi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const { searchResults } = useOutletContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const fetchNotes = async () => {
      try {
        const res = await axios.get('/api/v1/notes/get-notes', {
          withCredentials: true
        });
        setNotes(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handlePinNote = async(note) =>{
    try {
        await axios.patch(`/api/v1/notes/update-pinned/${note._id}`,{},{
            withCredentials: true
        })
    } catch (error) {
        toast.error("Failed to update pin");
    }
  }

  const handleEditNote = (note) =>{
    navigate(`/update-note/${note._id}`)
  }

  const handleDeleteNote = async(note)=>{
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if(!confirmDelete) return ;

    try {
        await axios.delete(`/api/v1/notes/delete-note/${note._id}`,{
            withCredentials: true
        })
        fetchNotes();
        toast.success("Note deleted")
    } catch (error) {
        toast.error("Delete failed")
    }
  }

  useEffect(()=>{
    const checkAuth= async()=>{
      try {
        const res=await getCurrentUser()
        setIsLoggedIn(true)
      } catch (error) {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  },[])

  const notesToDisplay = searchResults.length > 0 ? searchResults : notes;

  return (
    <motion.div
      className="min-h-screen py-10 px-4 relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
      className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500 via-purple-100 to-indigo-500 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      />
  
      <motion.div
      className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"
      style={{ top: '-5rem', left: '-5rem' }}
      />
      <motion.div
      className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"
      style={{ top: '10rem', right: '-5rem' }}
      />
      <motion.div
      className="absolute w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"
      style={{ bottom: '-5rem', left: '20%' }}
      />
      <motion.h1
        className="text-3xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📝 Your Notes
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {notesToDisplay.map((note) => (
          <NoteBox key={note._id} note={note} onPinNote={handlePinNote} onEdit={handleEditNote} onDelete={handleDeleteNote} />
        ))}
      </motion.div>

      {isLoggedIn && <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6"
      >
        <NavLink
          to="/add-note"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full shadow-lg text-lg font-medium transition"
        >
          ➕ Add Note
        </NavLink>
      </motion.div>}
    </motion.div>
  );
};

export default Home;