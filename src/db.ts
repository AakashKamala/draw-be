import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

export function connectDB(): any{
    mongoose.connect(MONGO_URI as unknown as string).then(()=>{
        console.log("db connected")
    }).catch((err)=>{
        console.log("db conection failed", err)
    })
}