import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

const counterModel = mongoose.model("counter", counterSchema);

export { counterModel };
