import "dotenv/config"
import jwt from "jsonwebtoken"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import { User } from "../models/user.model.js"

const verifyJWT = asyncHandler(async(req,res,next)=>{
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!accessToken){
        throw new ApiError("Unauthorized access",401)
    }
    let decoded;
    try {
        decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError("Invalid Access Token",400)
    }
    const user = await User.findById(decoded?._id)
    if(!user){
        throw new ApiError("User not found",404)
    }
    req.user = user
    next()
})

export {verifyJWT}