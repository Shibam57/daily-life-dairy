const express = require('express')
const upload = require('../middlewares/multer.middleware.js')
const { registerUser, loginUser, logoutUser, changeUserPassword, refreshAccessToken, getCurrentUser, updateAccountDetails, updateUserAvatar, verifyEmail } = require('../controllers/user.controller.js')
const verifyJWT =require('../middlewares/auth.middleware.js')

const router = express.Router()

router.post('/register', upload.fields([{ 
    name: 'avatar',
    maxCount: 1
}]), registerUser)

router.post('/login', loginUser)
router.get("/verify-email/:token", verifyEmail)
router.post('/logout', verifyJWT, logoutUser)
router.post('/refresh-token', refreshAccessToken)
router.post('/change-password', verifyJWT, changeUserPassword)
router.get('/profile', verifyJWT, getCurrentUser)
router.patch('/update-account', verifyJWT, updateAccountDetails)
router.put('/update-avatar/:userId', verifyJWT, upload.fields([{ 
    name: 'avatar',
    maxCount: 1
}]), updateUserAvatar)

module.exports = router