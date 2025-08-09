import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from "react-toastify";
import { FaThumbtack, FaTrash, FaEdit } from "react-icons/fa";


const actionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.3,
    },
  },
};

function NoteDetails() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

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

    const fetchAllNotes = async () => {
      try {
        const res = await axios.get(`/api/v1/notes/get-notes`, {
          withCredentials: true,
        });
        setAllNotes(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching notes list:", err);
      }
    };

    fetchNote();
    fetchAllNotes();
    
  }, [noteId]);

  const handleEditNote = (note) =>{
    navigate(`/update-note/${note._id}`)
  }

  const handleDeleteNote = async (note) => {
    if (!note?._id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/v1/notes/delete-note/${note._id}`, {
        withCredentials: true,
      });
      toast.success("Note deleted");
      navigate("/"); 
    } catch {
      toast.error("Delete failed");
    }
  };
  

  const handleSelectNote = (noteId) => {
    navigate(`/get-note/${noteId}`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-6 gap-6 bg-gray-50">
      
      <motion.div
        className="w-full md:w-2/3 bg-white p-6 shadow-lg rounded-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {!note ? (
            <motion.p
            className="text-gray-800 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            >
                ⏳ Loading note details...
            </motion.p>
        ) : (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold text-indigo-700 mb-4 break-words">{note.title}</h2>
            <p className="text-gray-800 text-lg mb-6 break-words">{note.description}</p>

            <div className="text-sm text-gray-500">
              <p>📅 Created: {new Date(note.createdAt).toLocaleString()}</p>
              <p>✏️ Last Updated: {new Date(note.updatedAt).toLocaleString()}</p>
            </div>

            {note && (
                <motion.div
                className="flex items-center gap-4 mt-6"
                variants={actionVariants}
                initial="hidden"
                animate="visible"
                >

                    <button
                    onClick={(e) => {
                    e.stopPropagation();
                    handleEditNote(note)
                    }}
                    className="text-blue-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition"
                    title="Edit"
                    >
                      <FaEdit size={18} />
                    </button>

                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note)
                    }}
                    className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                    title="Delete"
                    >
                      <FaTrash size={18} />
                    </button>
                </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="w-full md:w-1/3 bg-white p-4 shadow-md rounded-xl overflow-y-auto max-h-[80vh]"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-4">📚 All Notes</h3>
        <ul className="space-y-4">
          {allNotes.map((n) => (
            <li
              key={n._id}
              onClick={() => handleSelectNote(n._id)}
              className={`cursor-pointer border px-4 py-2 rounded hover:bg-indigo-50 transition ${n._id === noteId ? 'bg-indigo-100 border-indigo-500' : ''
              }`}
            >
              <h4 className="font-semibold text-gray-800 truncate">{n.title}</h4>
              <p className="text-sm text-gray-600 truncate">{n.description}</p>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default NoteDetails;