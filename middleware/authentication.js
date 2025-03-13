const jwt=require('jsonwebtoken')
require('dotenv').config()

const authenticate=(req, res , next)=>{
    
    try {
        const token=req.header("Authorization")?.split(" ")[1]
        console.log(token)
        if(!token){
            return res.status(401).json({"message":"Access denied."})
        }
        const decoded=jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user=decoded
        next();
    } catch (error) {
        console.log(error)
        res.status(400).json({"message":"Invalid token",error:error.message})
    }
}

const adminauth=(req, res, next)=>{
    if(req.user.role!=='admin'){
        return res.status(400).json({"message":"Access denied! Only admins are allowef"})
    }
    next();
}

module.exports={authenticate, adminauth}
