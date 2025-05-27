import User from '../Models/user.model.js'

const registerUser =  async (req,res)=>{
    try{
        const {fullname,email,password} = req.body;
        if(!fullname || !email || !password){
            return res.status(404).json({
                success:false,
                message:"All fields are required."
            })
        }
        //check if user already exists using email
        const existingUser =await  User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"A user with this email already exists."
            })
        }
        const user = await User.create({
            fullname:fullname,
            email:email,
            password:password,
        })
        //rechecking if user created
        const createdUser  = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if(!createdUser){
            return res.status(500).json({
                success:false,
                message:"Failed to create user!Try Again"
            })
        }
        else{
            return res.status(200).json({
                success:true,
                message:"User created successfully",
                createdUser
            })
        }
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err
        })
    }
    
}

const loginUser = async (req,res)=>{
    try {
        const {email,password}= req.body;
        if(!email || password===""){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //check if user exists or not
        const user = await User.findOne({email});
        if(!user){
             return res.status(400).json({
                success:false,
                message:"Incorrect email.Try Again"
            })
        }
        //if user exists ,check password
        //this "user" is current user methods are aplicable only on it not on "User"
        const isValidPass = user.isPasswordCorrect(password);
        if(!isValidPass){
             return res.status(404).json({
                success:false,
                message:"Incorrect Password.Try Again"
            })
        }
        //generate access and refresh token
        const accessToken = await user.generateAccessToken();
        const refreshToken =await  user.generateRefreshToken();
        //set refreshToken in user to save in db as well
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false})

        const loggedInUser  = await User.findById(user._id).select("-password -refreshToken");

        //setting up cookie
        const options = {
            httpOnly:true,
            secure:true
        }

        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json({
            success:true,
            message:"User loggedIn successfully!",
            user:loggedInUser,accessToken,refreshToken
        })

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:err
        })
    }
}

const logoutUser = async(req,res)=>{
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken:undefined
                }
            },
            {
                new : true
            }
        )
        const options = {
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json({
            success:true,
            message:"User logged Out successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:err
        })
    }
}

export {registerUser,loginUser,logoutUser}