import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    city: String,
    state: String,
    pincode: String
});

export const Address = mongoose.model("Address", addressSchema);
