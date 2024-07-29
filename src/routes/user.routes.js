import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logOutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    getUserProfile, 
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyjwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(varifyjwt, logOutUser)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("change-password").post(varifyjwt, changeCurrentPassword)
router.route("current-user").get(varifyjwt, getCurrentUser)
router.route("update-account").patch(varifyjwt, updateAccountDetails)
router.route("/avatar").patch(varifyjwt, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(varifyjwt, upload.single("coverImage"), updateCoverImage)
router.route("/c/:username").get(varifyjwt, getUserProfile)
router.route("/history").get(varifyjwt, getWatchHistory)


export default router