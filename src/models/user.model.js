import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import iwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase :true,
            trim:true,
            index:true,
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase :true,
            trim:true,
        },
        fullname : {
            type : String,
            required : true,
            trim:true,
            index:true,
        },
        avatar : {
            type:String , //cloudinary image url
            required :true,
        },
        coverimage : {
            type:String , //cloudinary image url
        },
        watchhistory : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video",
        }],
        password : {
            type:String,
            required :['true' , 'Password is required']
        },
        refreshToken : {
            type:String,
        }
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save"  , async function(next){
    if(!this.ismodified("password")) return next();
    
    this.password = bcrypt.hash(this.password, 10)
    next(); 
} )

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User" , userSchema)