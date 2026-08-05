import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
    video : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    },
    liker : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true})

likesSchema.index({video : 1 , liker : 1},{unique : true})
export const Like = mongoose.model("Like",likesSchema)