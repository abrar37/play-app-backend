import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Generating Access and RefreshToken
const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({'validateBeforeSave': false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong, while generating access and refresh token")
    }
}



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
    // console.log("Email: ", email)

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
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with this username or email is already exists")
    }

    // console.log(req.files);

    // checking for image, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.fiels?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.lenght > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path;
    // }

    // console.log("coverImageLocalPath: ", coverImageLocalPath)
    // console.log("avatarLocalPath: ", avatarLocalPath)

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatarLocalPath: Avatar file is required")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    // console.log("coverImage status:", coverImage);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // creating user object - create entry in db
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password
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


const loginUser = asyncHandler( async (req, res) => {
    //get data from request body
    // check availabilty of username or email
    // find user
    // Password check
    // generate Access and RefreshToken
    // send secure cookies

    const {username, email, password} = req.body

    if (!username || !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})

const logOutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiError(200, {}, "User logged out"))
})

export {
    registerUser,
    loginUser,
    logOutUser
}