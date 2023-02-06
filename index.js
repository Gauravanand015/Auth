const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./Router/register");
require('dotenv').config()
const app = express();
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("HomePage____")
})

app.use("/users",userRouter)

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to Db")
    } catch (error) {
        console.log(error)        
    }
    console.log("Server is Running")
})