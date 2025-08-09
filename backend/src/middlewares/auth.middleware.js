const ApiError= require("../utils/ApiError");
const User = require("../models/user.model.js");
const asyncHandler = require("../utils/asyncHandler.js")
const jwt = require("jsonwebtoken")

const verifyJWT = asyncHandler(async(req, res, next)=>{
    try {
        const authHeader = req.header("Authorization");
        let token = req.cookies?.accessToken;

        if(!token && authHeader && authHeader.startsWith("Bearer ")){
            token = authHeader.split(" ")[1];
        }

        if(!token || typeof token !== "string" || token.trim()===""){
            throw new ApiError(401, "Unauthorized request - Token missing or malformed");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401, "Invaild Access Token")
        }

        
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
})

module.exports = verifyJWT;