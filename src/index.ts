import express from "express"
import { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { connectDB } from "./db"
import userRoutes from "./routes/user"
import chatRoutes from "./routes/chat"

dotenv.config()

const app=express()

// mongoose.connect(process.env.MONGO_URI as string).then(()=>{
//     console.log("db connected")
// }).catch((err)=>{
//     console.log("db conection failed", err)
// })

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/v1", userRoutes)
app.use("/api/v1", chatRoutes)

app.get("/", (req, res)=>{
    res.json({"message": "alive"})
})

const PORT=process.env.PORT

app.listen(PORT, ()=>{
    console.log(`server is listening on PORT ${PORT}`)
})