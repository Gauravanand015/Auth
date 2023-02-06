const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../Model/schema");
const { authenticate } = require("../Middleware/authenticale");
const { authorise } = require("../Middleware/authorise");
const userRouter = express.Router();
require('dotenv').config()
const fs = require("fs");



userRouter.get("/",(req,res)=>{
    res.send("Getting Homepage")
})

userRouter.post("/register",async(req,res)=>{
    const {name,email,pass,role} = req.body;
    const mail = await UserModel.findOne({mail:email})
    if(mail){
        return res.send("this email is already registered try using diffirent email!!!")
    }
    try {
        bcrypt.hash(pass, 5, async (err, encrypt)=> {
            if(err){
                res.send("Fill All Details!!")
            }else{
                const user = new UserModel({
                    name,
                    email,
                    pass:encrypt,
                    role
                })
                await user.save()
                res.send("User Has Been Registered!!")
            }
        });
    } catch (error) {
        console.log(error);
        res.send("Something Went Wrong While Registering!!")
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,pass} = req.body;
    const data = await UserModel.find({email:email})
    try {
        if(data.length>0){
            bcrypt.compare(pass, data[0].pass, (err, result)=>{
                if(err){
                    console.log(err)
                    res.send("Wrong Credentials")
                }else{
                    const Normal_token = jwt.sign({ email: data[0].email , role:data[0].role }, process.env.NormalKey,{expiresIn:60});
                    const Refresh_token = jwt.sign({ email: data[0].email }, process.env.RefreshKey,{expiresIn:300});
                    res.send({
                        "Message":"Logged In Successful",
                        "Normal_Token":Normal_token,
                        "Refreash_token":Refresh_token
                    })
                }
            });
        }
        
    } catch (error) {
        console.log(error);
        res.send("Something Went Wrong While Login!!")
    }
})

userRouter.get("/goldrate",authenticate,authorise(["user"]),(req,res)=>{
    res.send("Gold Rates")
})

userRouter.get("/logout",(req,res)=>{
    const token = req.header.authorization;
    const blackList = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    blackList.push(token)
    fs.writeFileSync("./blacklist.json",JSON.stringify(blackList))
    res.send("LogOut")
})

module.exports={
    userRouter
}