import mongoose, { Schema } from "mongoose";
import { comment } from "./comment.model";

const likeSchema = mongoose.Schema(
    {
        video:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        comment:{
            type:Schema.Types.ObjectId,
            ref:"comment"
        },
        tweet:{
            type:Schema.Types.ObjectId,
            ref:"tweet"
        },
        likedby:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps: true,
    }
)

export const like = mongoose.model("like" , likeSchema)