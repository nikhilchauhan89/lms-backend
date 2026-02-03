import mongoose from "mongoose";
import { counterModel } from "./counter.js";

const imageSchema = mongoose.Schema({
    id: {
    type: Number,
    unique: true
  },

    name: String,
    email: String,
    password: String,
    number: String,
    city: String,
    profileImage: String,

    
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }

},{
    timestamps:true
}
)

imageSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await counterModel.findOneAndUpdate(
      { id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.seq;
  }
  next();
});

const imageModel = mongoose.model("users", imageSchema)

export { imageModel }