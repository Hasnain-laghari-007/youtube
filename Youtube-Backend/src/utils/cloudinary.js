import "dotenv/config"
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./apiError.js";
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(filePath,fileType)=>{
    if(!filePath) return null
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
      folder : fileType
    }
    if(fileType?.[0]?.toLowerCase() === "v") options.resource_type = "video"
    try {
        const result = await cloudinary.uploader.upload(filePath,options)

        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }

        return result
    } catch (error) {
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }
        if(!fileType === "Cover_Images"){
            throw new ApiError("Error occue while uploading file on Cloudinary")
        }
    }
}
const deleteOnCloudinary = async(fileURL)=>{
    const public_id = fileURL
    .split("/upload/")
    .pop()
    .split("/")
    .slice(1,)
    .join("/")
    .split(".")
    .slice(0,-1)
    .join(".")

    try {
        const isDeleted = await cloudinary.uploader.destroy(public_id)
        if(isDeleted.result === "ok"){
            console.log("File deleted from cloudinary successfully")
        }
        else{
            console.log("File is not deleted from cloudinary")
        }
    } catch (error) {
        console.log("Error occur while deleting file from cloudinary")
    }

}

const deleteVideoOnCloudinary = async(fileURL)=>{
    const public_id = fileURL
    .split("/upload/")
    .pop()
    .split("/")
    .slice(1,)
    .join("/")
    .split(".")
    .slice(0,-1)
    .join(".")

    try {
        const isDeleted = await cloudinary.uploader.destroy(public_id,{resource_type : "video"})
        if(isDeleted.result === "ok"){
            console.log("Video File deleted from cloudinary successfully")
        }
        else{
            console.log("Video is not deleted from cloudinary")
        }
    } catch (error) {
        console.log("Error occur while deleting Video file from cloudinary")
    }

}

export {uploadOnCloudinary,deleteOnCloudinary, deleteVideoOnCloudinary}