import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { optionalVerifyJWT } from "../middlewares/optionalAuth.middleware.js";
import { uploadVideo, deleteVideo,getVideo,getVideos, userTopVideos,uploadVideoDraft,getCurrentUserVideos } from "../controllers/video.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/video/:id").patch(verifyJWT, upload.single("Thumbnail"), uploadVideo);
router.route("/upload-video").post(verifyJWT,upload.single("Video"),uploadVideoDraft)
router.route("/video/:id").get(optionalVerifyJWT,getVideo)

router.route("/delete/:id").delete(verifyJWT,deleteVideo)
router.route("/get-current-user-videos").get(verifyJWT,getCurrentUserVideos)
router.route("/videoPage").get(getVideos)
router.route("/top-videos/:id").get(verifyJWT,userTopVideos)
export default router