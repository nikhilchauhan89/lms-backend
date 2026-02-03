import mongoose from "mongoose";

const cardSchema = mongoose.Schema({

    link: String,
    fileName: String,
    filePath: String,   




})
const cardModel1 = mongoose.model("users2", cardSchema)

export { cardModel1 }