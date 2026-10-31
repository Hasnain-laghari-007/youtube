import {
  ApiError,
  ApiResponse,
  asyncHandler,
  uploadOnCloudinary,
  deleteOnCloudinary,
  deleteVideoOnCloudinary,
  safeRedisGet,
  safeRedisSet,
} from "../utils/index.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description = "" } = req.body;
  const id = req.params?.id;
  let thumbnailFile = req.file?.path;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError("Invalid video id!", 400);
  if (!title) {
    throw new ApiError("Title of the video is required!", 400);
  }

  if (!thumbnailFile) {
    throw new ApiError("Thumbnail is  required!", 400);
  }
  const publishedVideo = await Video.findOne({ _id: id, owner: req.user._id }); // searching draft video
  if (!publishedVideo) throw new ApiError("Video not found", 404);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    thumbnailFile = await uploadOnCloudinary(thumbnailFile, "Thumbnails");

    const video = await Video.findOneAndUpdate(
      {
        _id: id,
        owner: req.user?._id,
      },
      {
        $set: {
          title,
          description,
          thumbnail: thumbnailFile?.secure_url,
        },
      },
      { new: true },
    ).session(session);

    if (!video) {
      throw new ApiError("Video not created in DB", 500);
    }

    await User.findByIdAndUpdate(req.user?._id, {
      $inc: {
        videosCount: 1,
      },
    }).session(session);

    await session.commitTransaction();

    return res
      .status(201)
      .json(new ApiResponse("Video uploaded successfully", video, 201));
  } catch (error) {
    await session.abortTransaction();

    if (publishedVideo?.videoFile) {
      // published video delete
      await deleteVideoOnCloudinary(publishedVideo.videoFile);
      await Video.findByIdAndDelete(publishedVideo._id);
    }

    if (thumbnailFile?.secure_url)
      await deleteOnCloudinary(thumbnailFile.secure_url);
    throw new ApiError(error.message, 500);
  } finally {
    await session.endSession();
  }
});

const uploadVideoDraft = asyncHandler(async (req, res) => {
  let videoFile = req.file?.path;

  if (!videoFile) {
    throw new ApiError("Video is required!", 400);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    videoFile = await uploadOnCloudinary(videoFile, "Videos");

    const video = await Video.create(
      [
        {
          videoFile: videoFile.secure_url,
          duration: videoFile.duration,
          owner: req.user?._id,
        },
      ],
      { session },
    );
    if (!video[0]) {
      throw new ApiError("Video not created in DB", 500);
    }

    await session.commitTransaction();
    return res
      .status(201)
      .json(new ApiResponse("Video uploaded successfully", video[0], 201));
  } catch (error) {
    await session.abortTransaction();

    if (videoFile?.secure_url){
      await deleteVideoOnCloudinary(videoFile.secure_url);
    }
      
    throw new ApiError(error.message, 500);
  } finally {
    await session.endSession();
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const id = req.params?.id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid Id", 400);
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedVideo = await Video.findByIdAndDelete(id).session(session);
    if (!deletedVideo) {
      throw new ApiError("Video not found", 404);
    }
    await User.findByIdAndUpdate(req.user?._id, {
      $inc: {
        videosCount: -1,
      },
    }).session(session);

    await session.commitTransaction();

    await deleteVideoOnCloudinary(deletedVideo.videoFile);
    if(deleteVideo?.thumbnail) await deleteOnCloudinary(deletedVideo.thumbnail);
    return res
      .status(200)
      .json(new ApiResponse("Video delete successfully", {}, 204));
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(error.message, 500);
  } finally {
    await session.endSession();
  }
});

const getVideo = asyncHandler(async (req, res) => {
  const id = req.params?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid Id", 400);
  }

  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError("Video not found", 404);
  }
  return res
    .status(200)
    .json(new ApiResponse("Video fetched succesfully", video, 200));
});

const getVideos = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query?.sortBy || "createdAt";
  const sortType = req.query?.sortType === "asc" ? 1 : -1;

  let myAggregation = Video.aggregate([
    {
      $match: {},
    },
    {
      $sort: {
        [sortBy]: sortType,
      },
    },
  ]);
  const options = {
    page,
    limit,
  };

  const result = await Video.aggregatePaginate(
    myAggregation,
    options,
    function (err, result) {
      if (err) {
        throw new ApiError(err, 500);
      }
      return result;
    },
  );

  return res
    .status(200)
    .json(new ApiResponse("Videos fetched successfully", result, 200));
});

const userTopVideos = asyncHandler(async (req, res) => {
  const userId = req.params?.id;
  let topVideos = await safeRedisGet(`topVideos:${userId}`);
  if (topVideos) {
    return res
      .status(200)
      .json(
        new ApiResponse("Top videos fetched successfully!", topVideos, 200),
      );
  }

  topVideos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        views: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  if (topVideos?.length) await safeRedisSet(`topVideos:${userId}`, topVideos);

  return res
    .status(200)
    .json(new ApiResponse("Top videos fetched successfully", topVideos, 200));
});

export {
  uploadVideo,
  deleteVideo,
  getVideo,
  getVideos,
  userTopVideos,
  uploadVideoDraft
};
