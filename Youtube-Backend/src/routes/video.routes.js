import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideo, deleteVideo,getVideo,getVideos, userTopVideos } from "../controllers/video.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/upload-video").post(verifyJWT,
    upload.fields([{name : "video",maxCount : 1},{name : "thumbnail",maxCount : 1}]),uploadVideo)
router.route("/delete/:id").delete(verifyJWT,deleteVideo)
router.route("/video/:id").get(verifyJWT,getVideo)
router.route("/videoPage").get(getVideos)
router.route("/top-videos/:id").get(verifyJWT,userTopVideos)
export default router