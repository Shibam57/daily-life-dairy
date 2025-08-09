const express = require('express')
const cors=require('cors')
const cookieParser = require('cookie-parser')
const app=express()
const path = require("path")

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb'  }));
app.use(express.static('public'));
app.use(cookieParser());


const userRouter = require('./routes/user.route')
const noteRouter = require('./routes/note.route')
const errorHandler = require('./middlewares/errorHandler')

app.use('/api/v1/users', userRouter);
app.use('/api/v1/notes', noteRouter);

const distPath = path.join(__dirname, "..","..","frontend", "dist");
app.use(express.static(distPath))
app.get(/.*/, (req, res)=>{
    res.sendFile(path.join(distPath, 'index.html'))
})

app.use(errorHandler)

module.exports = app 