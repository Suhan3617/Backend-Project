import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commmentSchema = mongoose.Schema(
    {
        content :{
            type: String,
            required:true,
        },
        video:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        owner :{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps: true,
    }
)

commmentSchema.plugin(mongooseAggregatePaginate)

export const comment = mongoose.model("comment" , commmentSchema)