import "dotenv/config"
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : [true,"Username is required"],
        lowercase : true,
        trim : true,
        minlength : [2,"username is too short"],
        maxlength : [50,"username is too long"]
    },
    email : {
        type : String,
        unique : true,
        required : [true,"Email is required"],
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : [true,"Password is required"],
        minlength : [8,"Password must be at least 8 characters"],
        select : false
    },
    fullName : {
        type : String,
        trim : true
    },
    subscribers : {
        type : Number,
        default : 0
    },
    videosCount : {
        type : Number,
        default : 0
    },
    avatar : {
        type : String, // cloudinary url
        required : [true,"Avatar is required"]
    },
    coverImage : {
        type : String, // cloudinary url
    },
    watchHistory : [{type : mongoose.Schema.Types.ObjectId, ref : "Video"}],

    refreshToken : {
        type : String,
        default : "",
        select : false
    }
})

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordValid = function(password){
    return bcrypt.compareSync(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        username : this.username
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}

export const User = mongoose.model("User",userSchema)

