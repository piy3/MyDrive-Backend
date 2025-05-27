import User from "../Models/user.model.js";
import jwt from 'jsonwebtoken'

export const verifyJWT  = async(req,res,next)=>{
     try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")|| req.body.accessToken ;
        if(!token){
            return res.status(401).json({ message: "Unauthorized request" });
        }
    
        const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedTokenInfo?._id)
        .select("-refreshToken -password")
    
        if(!user){
            return res.status(401).json({ message: "Invalid access token" }); 
        }
    
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: error?.message || "Invalid access token" }); 
    }
}