import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    // res.status(200).json({
    //     message: "ok, from PlayApp"
    // })

    /* User controller - steps
      * get user details from frontend
      * user data validation - not empty
      * check if user already exists: username, email
      * check for image, check for avatar
      * upload them to cloudinary
      * create user object - create entry in db
      * remove password and refresh token field from response
      * check for user creation
      * return response
    */

    //Getting user details
    const {username, email, password, fullName} = req.body
    console.log("Email: ", email)

    // Validation
    // if (username === "") {
    //     throw new ApiError(400, "Full Name is required")
    // }

    // Validation for all fields
    if (
        [username, email, password, fullName].some( (field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields is required")
    }

    // If user already exist
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with this username or email is already exists")
    }

    // checking for image, check for avatar
    const avatarLocalPath = req.fiels?.avatar[0]?.path;
    const coverImageLocalPath = req.fiels?.coverImage?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // creating user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        // DeSelecting pass and token
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wront while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export {registerUser}