import { Router } from "express";
import { registerUser, login, logout, updateUserDetails, changePassword, updateAvatar, updateCoverImage, userChannelDetails, refreshAccessToken,deleteAccount, getCurrentUser, getWatchHistory } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register-user").post(upload.fields([{name : "avatar",maxCount : 1},{name : "coverImage",maxCount : 1}]),registerUser)
router.route("/login").post(login)
router.route("/refresh-access-token").post(refreshAccessToken)

//secure routes

router.route("/logout").post(verifyJWT,logout)
router.route("/update-user-details").patch(verifyJWT,updateUserDetails)
router.route("/change-password").patch(verifyJWT,changePassword)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)
router.route("/channel/:username").get(verifyJWT,userChannelDetails)
router.route("/delete-account").delete(verifyJWT,deleteAccount)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/watch-history").get(verifyJWT,getWatchHistory)

export default router