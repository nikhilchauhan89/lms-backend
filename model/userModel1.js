import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }
});

export const User = mongoose.model("User", userSchema);
