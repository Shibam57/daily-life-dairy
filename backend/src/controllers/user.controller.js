const ApiError = require('../utils/ApiError.js');
const User = require('../models/user.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const {uploadOnCloudinary, deleteFromCloudinary} = require('../utils/cloudinary.js');
const ApiResponse = require('../utils/ApiResponse.js');
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail.js")


const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)

        if(!user){
            throw new ApiError(404, "User not found")
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Failed to generate access token")
    }
}

const registerUser = asyncHandler(async(req, res)=>{
    const {username, email, fullname, password} = req.body;

    if([username, email, fullname, password].some((field)=> field?.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if (existingUser) {
    if (existingUser.isVerified) {
      throw new ApiError(400, "Username or email already exists");
    } else {
      // User exists but NOT verified, update data & resend verification
      const verificationToken = crypto.randomBytes(32).toString("hex");

      existingUser.username = username;
      existingUser.fullname = fullname;
      existingUser.password = password;
      existingUser.avatar = avatar.secure_url;
      existingUser.verificationToken = verificationToken;

      await existingUser.save({ validateBeforeSave: true });

      const verificationURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
      await sendEmail({
        to: existingUser.email,
        subject: "Verify your email",
        html: `<h2>Welcome back ${fullname}</h2>
              <p>Please verify your email by clicking the link below:</p>
              <a href="${verificationURL}">${verificationURL}</a>`
      });

      return res.status(200).json(new ApiResponse(200, existingUser.select("-password"), "Account exists but not verified. New verification email sent."));
    }
  }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar) {
        throw new ApiError(500, "Failed to upload avatar");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
        username,
        email,
        fullname,
        password,
        avatar: avatar.secure_url,
        verificationToken
    })

    const verificationURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`

    await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `<h2>Welcome ${fullname}</h2>
        <p>Please verify your email by clicking the link below: </p>
        <a href="${verificationURL}">${verificationURL}</a>`
    })

    const createdUser = await User.findById(user?._id).select("-password");

    if(!createdUser){
        throw new ApiError(500, "User creation failed");
    }

    res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully. Please check your email to verify your account."
    ));
})

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "Verification token missing");
  }

  const user = await User.findOne({ verificationToken: token });

  if (user) {
    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  }

  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save({ validateBeforeSave: false });

  res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
});

const loginUser = asyncHandler(async(req, res)=>{
    const {username, email, password} = req.body;

    if([username, email, password].some((field)=>field?.trim()==="")){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User not found")
    }

    if(!user.isVerified){
        throw new ApiError(401, "Please verify your email before logging in.")
    }

    const isPassword = await user.isPasswordMatch(password);

    if(!isPassword){
        throw new ApiError(400, "Invalid password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user?._id)

    const loggedInUser=await User.findById(user?._id).select("-password -refreshToken");

    const options={
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in successfully"))
})

const logoutUser = asyncHandler(async(req, res)=>{
    if(!req.user?._id){
        return res.status(400).json({ message: "No user is currently logged in." });
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
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

    return res.status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken 

    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh token is required")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(404, "User not found")
        }

        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user?._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed successfully"))

    } catch (error) {
        throw new ApiError(500, error?.message || "Invalid refreshtoken")
    }
})

const changeUserPassword = asyncHandler(async(req, res)=>{
    const {currentPassword, newPassword, confirmNewPassword} = req.body;


    if(!(currentPassword && newPassword && confirmNewPassword)){
        throw new ApiError(400, "All fields are required")
    }

    if(!(newPassword === confirmNewPassword)){
        throw new ApiError(400, "New password and confirm password do not match")
    }

    const user = await User.findById(req.user?._id)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const isPassword = await user.isPasswordMatch(currentPassword)

    if(!isPassword){
        throw new ApiError(400, "Current password is incorrect")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res)=>{
    if(!req.user?._id){
        throw new ApiError(401, "Unauthorized request - User not found");
    }

    return res.status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {username, fullname} = req.body;

    if(!username || !fullname){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username,
                fullname
            }
        },
        {
            new: true
        }
    ).select("-password")

    if(!user){
        throw new ApiError(404, "User not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const currentUser = await User.findById(req.user?._id)

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar){
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.secure_url
            }
        },
        {new: true}
    ).select("-password")

    if(currentUser?.avatar.secure_url){
        await deleteFromCloudinary(currentUser?.avatar.url)
    }
    return res.status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"))
})

module.exports = {
    registerUser,
    verifyEmail,
    loginUser, 
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
}