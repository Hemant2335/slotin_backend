import user from"../module/user.js";
import validator from "validator";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens= async(userId)=>{
    try {
        const users= await user.findById(userId)
         const accessToken=users.generateAccessToken();
       const refreshToken =  users.generateRefreshToken();
        users.refreshToken = refreshToken

         await users.save({validateBeforeSave: false})
      
         return {accessToken ,refreshToken};

    } catch (error) {
        return res.status(500).json({error : error?.message});
        
    }
}
const createNewAccount = async(req,res)=>{
    const { username,firstname,lastname,age,password,email} = req.body;
  

  if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email format");
  }

  if (!validator.isLength(password, { min: 6, max: 10})) {
    return res.status(400).send("Password must be between 6 and 10 characters");
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
    return res.status(400).send("Password must include uppercase, lowercase, number, and special character");
  }

  if (!/^[a-zA-Z0-9_]{3,15}$/.test(username)) {
    return res.status(400).send("Username must be 3-15 characters long and can only contain letters, numbers, and underscores");
  }

  
  if (!/^[a-zA-Z]+$/.test(firstname) || !/^[a-zA-Z]+$/.test(lastname)) {
    return res.status(400).send("First name and last name must contain only alphabetic characters");
  }

  const ageNumber = Number(age);
  if (!Number.isInteger(ageNumber) || ageNumber <= 0 || ageNumber > 120) {
    return res.status(400).send("invalid Age");
  }

    
        const existedUser = await user.findOne({
            $or:[ {username } , { email }]
        })

        if(existedUser){
            return res.status(409).send("email or username already exists ")
        }
   const newUser= await user.create({
        username:username,
        firstname:firstname,
        lastname:lastname,
        age:ageNumber,
        password:password,
        email : email
    });

    const newResponse = await user.findById(newUser.id).select("-password -refreshToken")

    if(!newResponse){
        return res.status(500).send("something went wrong while creating new user");
    }
 return res.status(201).send("user created");
}









const loginAccount= async (req,res)=>{
    const {email,username , password} = req.body;
   if(!(username || email)){
    return res.status(401).send(" username or email required");
   }
    const users = await user.findOne({
       $or: [{username},{email}]
    });
    
     if(!users) return res.status(401).json({ message:"user does not exists"});
    

    const isPasswordValid= await users.isPasswordCorrect(password)
  
    if(!isPasswordValid) return res.status(401).json({ message:"incorrect password"});

    const {accessToken ,refreshToken}= await generateAccessAndRefreshTokens(users._id)

    const loggedInUser = await user.findById(users._id).select("-password -refreshToken")
 
    const options = {
        httpOnly : true,
        secure : true
    }

    res.status(200).cookie("accessToken",accessToken , options ).cookie("refreshToken",refreshToken , options ).json({msg:"user logged in successfully"});

}


const logOutUser = async(req,res)=>{
    await  user.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken : undefined
            }
        },
        {
            new : true
        }
     )

     const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken", options).json({msg:"User Logged Out"})


}

const refreshAccessToken = async(req,res)=>{
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        if(!incomingRefreshToken){
            return res.status(401).json({msg : "unauthorized request"})
        }
    
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const User = await user.findById(decodedToken?._id);
    
        if(!User){
            return res.status(401).json({msg:"invalid refresh token"});
        }
        if(incomingRefreshToken !== User.refreshToken){
            return res.status().json({msg : "Refresh token is expired or used"});
        }
        const options = {
            httpOnly:true,
            secure:true
        }
        const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(User._id)
    
       return res.status(200).cookie("accessToken",accessToken ,options).cookie("refreshtoken",refreshToken,options).json({msg:"Access token refreshed"})
    
    
    } catch (error) {
        return res.status(401).json({error : error?.message});
    }


}

export { createNewAccount, loginAccount , logOutUser , refreshAccessToken};