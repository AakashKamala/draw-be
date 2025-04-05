import express from "express";
import mongoose from "mongoose";
import Chat from "../models/chat";
import { Request, Response } from "express";

const router = express.Router();

// Create a new chat message
export async function createChat(req: Request, res: Response): Promise<any> {
    try {
        const { room, userId, message } = req.body;
        const chat = new Chat({ room, userId, message });
        await chat.save();
        res.status(201).json(chat);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Get all chat messages
export async function getChats(req: Request, res: Response): Promise<any> {
    try {
        const chats = await Chat.find().populate("userId");
        res.status(200).json(chats);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getChatsByRoom = async (req: Request, res: Response): Promise<any> => {
    try {
        const room = req.query.room;
        console.log(room)
        const chats = await Chat.find({ room }).populate("userId"); // Populates user details
        res.status(200).json(chats);
    } catch (error: any) {
        res.status(500).json(`Error fetching chats for room: ${error.message}`);
    }
};

// Get a single chat message by ID
// router.get("/:id", async (req, res) => {
//     try {
//         const chat = await Chat.findById(req.params.id).populate("userId");
//         if (!chat) {
//             return res.status(404).json({ error: "Chat not found" });
//         }
//         res.status(200).json(chat);
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Update a chat message by ID
// router.put("/:id", async (req, res) => {
//     try {
//         const { room, userId, message } = req.body;
//         const chat = await Chat.findByIdAndUpdate(
//             req.params.id,
//             { room, userId, message },
//             { new: true, runValidators: true }
//         );
//         if (!chat) {
//             return res.status(404).json({ error: "Chat not found" });
//         }
//         res.status(200).json(chat);
//     } catch (error: any) {
//         res.status(400).json({ error: error.message });
//     }
// });

// Delete a chat message by ID
// router.delete("/:id", async (req, res) => {
//     try {
//         const chat = await Chat.findByIdAndDelete(req.params.id);
//         if (!chat) {
//             return res.status(404).json({ error: "Chat not found" });
//         }
//         res.status(200).json({ message: "Chat deleted successfully" });
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// });

export default router;