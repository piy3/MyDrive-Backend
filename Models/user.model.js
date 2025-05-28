import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullname:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            index:true,
        },
        password:{
            type:String,
            required:[true,"Password is required"],
            trim:true,
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
) 

//buil-in mongoose methods(pre , ..)
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next;
    this.password =await bcrypt.hash(this.password,10)
    next()
})
//self defined method(custom)
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(this.password,password);
}

userSchema.methods.generateAccessToken =  function(){
    return jwt.sign(
        { //payload
            _id:this._id,
            email:this.email,
            fullname : this.fullname
        },
        //access token secret
        process.env.ACCESS_TOKEN_SECRET,
        {//expiry
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
        
    )
}
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        { //payload
            _id:this._id
        },
        //access token secret
        process.env.REFRESH_TOKEN_SECRET,
        {//expiry
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
        
    )
}


const User = mongoose.model("User",userSchema);
export default User