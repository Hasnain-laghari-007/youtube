import mongoose from "mongoose";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async(req,res)=>{
    const videoId = req.params?.videoId
    const userId = req.user?._id
    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError("Invalid VideoId",400)
    }
    const session = await mongoose.startSession()
    try {
        await session.startTransaction()
        const isAlreadyLiked = await Like.findOne({
            video : videoId,
            liker : userId
        }).session(session)

        if(isAlreadyLiked){
            await Like.findByIdAndDelete(isAlreadyLiked?._id).session(session)
            await Video.findByIdAndUpdate(videoId,{
                $inc : {
                    likes : -1
                }
            }).session(session)

            await session.commitTransaction()
            return res.status(200)
            .json(
                new ApiResponse("UnLike successfully",{},200)
            )
        }
        else {
            await Like.create([{video : videoId , liker : userId}],{session})
            await Video.findByIdAndUpdate(videoId,{
                $inc : {
                    likes : 1
                }
            }).session(session)

            await session.commitTransaction()
            return res.status(200)
            .json(
                new ApiResponse("Video Liked successfully",{},200)
            )
        }

    } catch (error) {
        await session.abortTransaction()
        throw new ApiError("Error occur while performing task",500)
    }
    finally{
        await session.endSession()
    }
})

export {toggleVideoLike}