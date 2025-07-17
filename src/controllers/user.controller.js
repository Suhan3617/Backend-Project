import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary_service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})

    return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(
      500,
      "Something wentcwrong while generating Access and Refresh Tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("BODY RECEIVED >>>", req.body);
  console.log("FILES RECEIVED >>>", req.files);
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

  const ExistedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (ExistedUser) {
    throw new ApiError(409, "User already exists with this username or email");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // let coverImageLocalPath;
  // if(req.files && Array.isArray(req.files.coverImage && req.files.coverImage.length>0 )){
  //   coverImageLocalPath1 = req.file.coverImage
  // }

  console.log("AVATAR PATH >>>", avatarLocalPath);
  console.log("COVER PATH >>>", coverImageLocalPath);

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
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong registering a User !");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //take username/email and password
  // username or email se access de
  // check if both are took
  //check it in the database if there exist any user with such username or email
  // if does not exist then ask the user to signup
  //if exists then check if matches with the password in the database
  //access and refresh token
  //send cookie
  //if yes then login the user successfully

  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const ispasswordvalid = await user.isPasswordCorrect(password);

  if (!ispasswordvalid) {
    throw new ApiError(401, "Password Incorrect");
  }

  const {accessToken , refreshToken } = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure : true,
  }

  return res
  .status(200)
  .cookie("accessToken" , accessToken , options)
  .cookie("refreshToken" , refreshToken , options)
  .json(
    new ApiResponse(
      200 ,
      {
        user : loggedInUser , accessToken , refreshToken
      },
      "User Logged In Successfully ! "
    )
  )

});


const logoutUser = asyncHandler(async (req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set : {
        refreshToken : undefined
      }
    },
    {
      new:true
    }
  )

  const options = {
    httpOnly : true,
    secure : true,
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200,{},"User Logout Successfully"))
})

export { registerUser, loginUser , logoutUser};
