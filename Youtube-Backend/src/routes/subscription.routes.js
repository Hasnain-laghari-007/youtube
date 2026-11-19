import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscribe } from "../controllers/subscription.controllers.js";
import rateLimit,{ipKeyGenerator} from "express-rate-limit";

const subscribeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    keyGenerator: (req) => req.user?._id?.toString() || ipKeyGenerator(req.ip),
    handler: (req, res) => {
        res.status(429).json({ message: "Too many attempts. Try again after 1 minutes." });
    }
});

const router = Router()
router.route("/toggle/v/:id").post(verifyJWT,subscribeLimiter,toggleSubscribe)

export default router