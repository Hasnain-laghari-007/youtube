import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscribe } from "../controllers/subscription.controllers.js";

const router = Router()
router.route("/toggle/v/:id").post(verifyJWT,toggleSubscribe)

export default router