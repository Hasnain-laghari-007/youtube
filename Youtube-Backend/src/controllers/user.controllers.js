import "dotenv/config";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  uploadOnCloudinary,
  deleteOnCloudinary,
} from "../utils/index.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const generate_Refresh_And_Access_Tokens = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { refreshToken, accessToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;
  const avatarFilePath = req.files?.avatar?.[0]?.path;
  const coverImageFilePath = req.files?.coverImage?.[0]?.path;

  if (
    [username, email, password, fullName].some(
      (field) => !field || String(field).trim() === "",
    )
  ) {
    throw new ApiError("All fields are required to regsiter user", 400);
  }

  if (password.length < 8) {
    throw new ApiError("Password must be at least 8 characters", 400);
  }
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailReg.test(email)) {
    throw new ApiError("Invalid Email", 400);
  }
  if (!avatarFilePath) {
    throw new ApiError("Avatar Image is required", 400);
  }
  let user = await User.findOne({
    $or: [
      { username: username?.toLowerCase() },
      { email: email?.toLowerCase() },
    ],
  });

  if (user) {
    throw new ApiError("This Username or Email is not available", 400);
  }
  const avatarFileOnCloudinary = await uploadOnCloudinary(
    avatarFilePath,
    "Avatars",
  );
  const coverImageFileOnCloudinary = await uploadOnCloudinary(
    coverImageFilePath,
    "Cover_Images",
  );

  user = await User.create({
    username,
    email,
    password,
    fullName,
    avatar: avatarFileOnCloudinary.secure_url,
    coverImage: coverImageFileOnCloudinary?.secure_url || "",
  });
  let responseObj = {
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    avatar: user.avatar,
    coverImage: user.coverImage,
    watchHistory: user.watchHistory,
  };
  return res
    .status(201)
    .json(new ApiResponse("User created successfully!", responseObj, 201));
});

const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError("Email or Username is required", 400);
  }
  if (String(password).trim() === "" || String(password).length < 8) {
    throw new ApiError("Invalid Password", 400);
  }

  const user = await User.findOne({
    $or: [
      { username: username?.toLowerCase() },
      { email: email?.toLowerCase() },
    ],
  }).select("+password");
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  const isPasswordCorrect = user.isPasswordValid(password);
  if (!isPasswordCorrect) {
    throw new ApiError("Incorrect password", 400);
  }
  const { refreshToken, accessToken } =
    await generate_Refresh_And_Access_Tokens(user?._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  let responseObj = {
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    avatar: user.avatar,
    coverImage: user.coverImage,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse("User login successfully", responseObj, 200));
});

const logout = asyncHandler(async (req, res) => {
  let user = req.user;
  user = await User.findByIdAndUpdate(
    user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { returnDocument: "after" },
  ).select("-watchHistory");
  if (!user) {
    throw new ApiError("User not found!", 404);
  }

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse("User logout successfully", user, 200));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { email, username, fullName } = req.body;

  if (!email && !username && !fullName) {
    throw new ApiError("At least one field is required", 400);
  }

  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let updatedObj = {};

  if (email) {
    if (!emailReg.test(email.trim())) throw new ApiError("Invalid email", 400);

    // ✅ Duplicate email check
    const emailExists = await User.findOne({
      email: email.trim(),
      _id: { $ne: req.user?._id }, // apne aap ko exclude karo
    });
    if (emailExists) throw new ApiError("Email already in use", 409);

    updatedObj.email = email.trim();
  }

  if (username) {
    if (username.trim().length < 3)
      throw new ApiError("Username too short", 400);

    // ✅ Duplicate username check
    const usernameExists = await User.findOne({
      username: username.trim(),
      _id: { $ne: req.user?._id }, // apne aap ko exclude karo
    });
    if (usernameExists) throw new ApiError("Username already taken", 409);

    updatedObj.username = username.trim();
  }

  if (fullName) {
    if (fullName.trim().length < 2)
      throw new ApiError("Full Name too short", 400);
    updatedObj.fullName = fullName.trim();
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updatedObj },
    { new: true },
  ).select("-password");

  if (!user) throw new ApiError("User not found", 404);

  return res
    .status(200)
    .json(new ApiResponse("User updated successfully", user, 200));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError("Both old and new passwords are required", 400);
  }
  if (newPassword.length < 8) {
    throw new ApiError("New password must be at least 8 characters", 400);
  }

  let user = await User.findById(req.user?._id).select("+password");
  const isPasswordCorrect = user.isPasswordValid(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError("Incorrect Old Password", 400);
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse("User password changed successfully", {}, 200));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalFilePath = req.file?.path;
  if (!avatarLocalFilePath) {
    throw new ApiError("Avatar file is missing", 400);
  }
  let user = req.user;
  let oldAvatar = user.avatar;
  const result = await uploadOnCloudinary(avatarLocalFilePath, "Avatars");
  user.avatar = result.secure_url;
  user = await user.save({ validateBeforeSave: false });
  await deleteOnCloudinary(oldAvatar);

  return res
    .status(200)
    .json(new ApiResponse("User avatar updated successfully", user, 200));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalFilePath = req.file?.path;
  if (!coverImageLocalFilePath) {
    throw new ApiError("Cover Image file is missing", 400);
  }
  let user = req.user;
  let oldCoverImage = user.coverImage;
  const result = await uploadOnCloudinary(
    coverImageLocalFilePath,
    "Cover_Images",
  );
  user.coverImage = result.secure_url;
  user = await user.save({ validateBeforeSave: false });
  await deleteOnCloudinary(oldCoverImage);

  return res
    .status(200)
    .json(new ApiResponse("User cover image updated successfully", user, 200));
});

const userChannelDetails = asyncHandler(async (req, res) => {
  const username = req.params?.username?.trim().toLowerCase();
  if (!username) throw new ApiError("Username is required", 400);

  const user = await User.aggregate([
    {
      $match: { username },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },
    {
      $addFields: {
        isSubscribed: {
          $in: [req.user?._id, "$subscribers.subscriber"],
        },
      },
    },
    {
      $project: {
        username: 1,
        email: 1,
        fullName: 1,
        avatar: 1,
        coverImage: 1,
        videos: 1,
        isSubscribed: 1,
        subscribers : 1,
        videosCount : 1
      },
    },
  ]);
  if (!user?.length) throw new ApiError("Channel not found", 404);
  return res
    .status(200)
    .json(new ApiResponse("User fetched successfully", user[0], 200));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  let oldrefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!oldrefreshToken) {
    throw new ApiError("Refresh Token is expired", 400);
  }
  let decoded;
  try {
    decoded = jwt.verify(oldrefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError("Invalid Token", 400);
  }
  let user = await User.findById(decoded?._id).select("+refreshToken");
  if (!user) {
    throw new ApiError("User not found!", 404);
  }
  if (!(user.refreshToken === oldrefreshToken)) {
    throw new ApiError("Unauthorized request", 401);
  }

  const { refreshToken, accessToken } =
    await generate_Refresh_And_Access_Tokens(user._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        "Access Token refreshed successfully",
        { accessToken, refreshToken },
        200,
      ),
    );
});

const deleteAccount = asyncHandler(async (req, res) => {
  let id = req.user?._id;
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new ApiError("User not deleted from DB", 500);
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse("Acount deleted successfully", deletedUser, 200));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  let userId = req.user?._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  return res
    .status(200)
    .json(new ApiResponse("User fetched successfully", user, 200));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  let userId = req.user?._id;
  const user = await User.aggregate([
    {
        $match : {
          _id : new mongoose.Types.ObjectId(userId)
        }
    },
    {
      $lookup : {
        from : "videos",
        localField : "watchHistory",
        foreignField : "_id",
        as : "watchedVideos",
        pipeline : [
          {
            $lookup : {
              from : "users",
              localField : "owner",
              foreignField : "_id",
              as : "videoOwner",
              pipeline : [
                {
                  $project : {
                    username : 1,
                    _id : 0
                  }
                }
              ]
            }
          },
          {
            $addFields : {
              channel : {$first : "$videoOwner.username"}
            }
          }
        ]
      }
    },
    {
      $project : {
        watchedVideos : 1,
        _id : 0
      }
    }
  ]);
  if(!user?.length) throw new ApiError("User not found",404)
  return res.status(200)
  .json(
    new ApiResponse("watch history fetched successfully",user[0]?.watchedVideos,200)
  )
});

export {
  registerUser,
  login,
  logout,
  updateUserDetails,
  changePassword,
  updateAvatar,
  updateCoverImage,
  userChannelDetails,
  refreshAccessToken,
  deleteAccount,
  getCurrentUser,
  getWatchHistory
};
