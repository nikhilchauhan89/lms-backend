import mongoose from "mongoose";

const cardSchema = mongoose.Schema({
    title: String,
    price: String,
    status: String,
    size: String,
    city: String,
    type: String,
    location: String,
    link: String,
    fileName: String,
    filePath: String,




})
const cardModel = mongoose.model("users1", cardSchema)

export { cardModel }