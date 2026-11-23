import "dotenv/config"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

const optionalVerifyJWT = async(req,res,next)=>{
    try{
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!accessToken){
        return next()
    }

    let decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decoded?._id)
    if(!user){
        return next()
    }
    req.user = user
    next()
}
catch{
    return next()
}
}
export {optionalVerifyJWT}