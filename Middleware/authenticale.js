const jwt = require("jsonwebtoken");
require('dotenv').config()
const fs = require("fs")

const authenticate = (req,res,next)=>{
    const token = req.headers.authorization;
    console.log(token);
    try {
        if(!token){
            return res.send("Please Login First!!")
        }
        const blackList = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
        if(blackList.includes(token)){
            return res.send("Your Token has been expired")
        }

        jwt.verify(token, process.env.NormalKey, (err, decoded)=> {
            console.log(decoded)
            if(err){
                res.send({"msg":"please login first","error":err.message})
            } else{
                const role = decoded?.role;
                req.body.role = role
                next()
            }
          });
    } catch (error) {
        console.log(error)
        res.send("something went wrong in authenticate")
    }
}

module.exports={
    authenticate
}