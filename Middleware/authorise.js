const authorise =(role)=>{
    return (req,res,next)=>{
        let role = req.body.role;
        if(role.includes(role)){
            next()
        }else{
            res.send("You Are Not Authorised!!")
        }
    }
}


module.exports ={
    authorise
}