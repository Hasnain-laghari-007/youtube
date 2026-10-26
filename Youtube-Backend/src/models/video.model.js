import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile : {
        type : String, // Cloudinary url
        required : [true,"Video file is required!"],
    },
    views : {
        type : Number,
        default : 0
    },
    duration : {
        type : Number
    },
    title : {
        type : String,
    },
    description : {
        type : String
    },
    thumbnail : {
        type : String, // Cloudinary URL
    },
    owner : {
        required : [true,"Owner is required!"],
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    likes : {
        type : Number,
        default : 0
    }
},{ timestamps : true })

videoSchema.plugin(aggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)