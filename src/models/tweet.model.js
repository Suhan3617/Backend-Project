import mongoose from "mongoose";

const tweetSchema = mongoose.Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content:{
        type:String,
        required:true,
    },
  },
  {
    timestamps: true,
  }
);

export const tweet = mongoose.model("tweet", tweetSchema);
