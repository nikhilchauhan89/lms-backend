import mongoose from "mongoose";

const sliderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },

})

const sliderModel = mongoose.model("sliderDetail", sliderSchema)

export { sliderModel }