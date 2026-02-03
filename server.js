import express from 'express'
import mongoose from 'mongoose'
import userRoutes from "./routes/userRoutes.js"
import cors from 'cors';


const app = express()

mongoose.connect("mongodb://localhost:27017/lmsproject")
    .then(() => {
        console.log(" MongoDB connected via Mongoose")
    })

app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true
    })

);


app.use(express.json())
app.use("/uploads", express.static("uploads"));


app.use("/api", userRoutes);

app.listen(3000, (res, req) => {
    console.log("app running on 3000 port ")
})
