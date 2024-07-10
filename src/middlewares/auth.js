import jwt from "jsonwebtoken";
import user from"../module/user.js";
export const verifyJWT = async (req,res,next)=>{
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
    if(!token){
     return res.status(401).json({msg:"Unauthorized request"});
    }
    
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
  const users = await user.findById(decodedToken?._id).select("-password -refreshToken")
 if(!users){
     return res.status(401).json({msg : " Invalid Access Token"})
 }
 req.user = user;
 next()
   } catch (error) {
      return res.status(401).json({msg:"Invalid Access Token"});
   }

}