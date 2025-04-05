import mongoose from "mongoose";
import User from "./user";

const chatSchema = new mongoose.Schema({
    "room": {
        type: String
    },
    "userId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    "message": {
        type: String
    }
})

const Chat = mongoose.model("Chat", chatSchema)

export default Chat;