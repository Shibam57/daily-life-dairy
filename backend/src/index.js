require('dotenv').config()
const connectDB = require('./db/mongooDB.js')
const app = require('./app.js')

const port = process.env.PORT;

connectDB().then(()=>{
    app.listen(port, ()=>{
        console.log(`server is running : http://localhost:${port}`)
    })
}).catch((err)=>{
    console.log("Error connecting to the database:", err)
})