import "dotenv/config"
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ApiError } from "./utils/apiError.js";

const app = express()

const limiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    handler : (req,res,next,options)=> { 
        next( new ApiError("Too many request from this IP",429))
    }
})
app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(cors({origin : process.env.CORS,credentials : true}))
app.use(helmet())

//routes
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import likeRouter from "./routes/like.routes.js";

app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/subscription",subscriptionRouter)
app.use("/api/v1/likes",likeRouter)

// Error middleware
app.use((err,req,res,next)=>{
    console.log(err.stack)
    res.status(err.statusCode || 500)
    .json(
        {
            statusCode : err.statusCode,
            message : err.message,
            data : err.data,
            success : err.success
        }
    )
})

export {app}