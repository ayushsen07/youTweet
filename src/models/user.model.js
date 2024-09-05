import mongoose from "mongoose";
import  jwt, { sign }  from "jsonwebtoken";
import  bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
    username :{
        type : String,
        require : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true,
    },
    email : {
        type : String,
        require : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    fullName : {
        type : String,
        require : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    avatar :{
        type : String,  // cloudinary url 
        require : true,

    },
    coverImage :{
        type : String
    },
    watchHistory :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password :{
        type : String,
        require : [true, 'Password is required'],
    },
    refreshToken :{
        type :  String,
    }
} , {timestamps : true})

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 8)
    next()
}) // this is a kind of middle ware it check just before sacing the data and the condition wtite bcz so not want to change password every time change only first time change means hashed the  password 

userSchema.methods.isPasswordCorrect = async function(password){
 await   bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id : this,_id,
            email : this.email,
            username : this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env. ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id : this,_id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env. REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)