const express=require('express')
const mongoose=require('mongoose')

const connectDB=async()=>{
    try {
        const connect=await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log(`Mongodb connected successfully at ${connect.connection.host}`);
    } catch (error) {
        console.log("Mongodb connection failed",error)
        process.exit(1)
    }
}

module.exports=connectDB;