import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary_service.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //details depends on the user model
  //validation - empty nhi h na format mei h na email format mei h na
  //check if user already exists : using username and email
  //check for images and avatar (imp)
  //if exists then upload it to cloudinary
  //check avatar : multer and cloudinary
  //create user object - create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response (if error then return error)

  const { fullName, email, username, password } = req.body;
  console.log("email : ", email);

  // if(fullName===""){
  //   throw new ApiError(400,"fullname is required")
  // }

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Email must be in Standard Format");
  }

  const ExistedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (ExistedUser) {
    throw new ApiError(409, "User already exists with this username or email");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required !");
  }
  
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required !");
  }

  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wrong registering a User !")
  }

  return res.status(201).json(
    new ApiResponse(200 , createdUser , "User registered Successfully ! ")
  )

});

export { registerUser };
