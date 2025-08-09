const express = require('express')
const {addNote, updateNote, deleteNote, updateNotePinned, getAllNotes, searchNotes, getSingleNote} = require('../controllers/note.controller.js')
const verifyJWT = require('../middlewares/auth.middleware.js')

const router = express.Router()

router.post('/add-note', verifyJWT, addNote)
router.put('/update-note/:noteId', verifyJWT, updateNote)
router.delete('/delete-note/:noteId', verifyJWT, deleteNote)
router.patch('/update-pinned/:noteId', verifyJWT, updateNotePinned)
router.get('/get-notes', verifyJWT, getAllNotes)
router.get('/search-notes', verifyJWT, searchNotes)
router.get('/get-note/:noteId', verifyJWT, getSingleNote)

module.exports = router