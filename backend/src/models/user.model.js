const mongoose = require('mongoose')
const brcypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    avatar: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    }
},{timestamps: true})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await brcypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordMatch = async function(password){
    return await brcypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User=mongoose.model('User', userSchema)

module.exports = User