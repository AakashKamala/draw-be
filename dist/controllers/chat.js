"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatsByRoom = void 0;
exports.createChat = createChat;
exports.getChats = getChats;
const express_1 = __importDefault(require("express"));
const chat_1 = __importDefault(require("../models/chat"));
const router = express_1.default.Router();
// Create a new chat message
function createChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { room, userId, message } = req.body;
            const chat = new chat_1.default({ room, userId, message });
            yield chat.save();
            res.status(201).json(chat);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
;
// Get all chat messages
function getChats(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chats = yield chat_1.default.find().populate("userId");
            res.status(200).json(chats);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
;
const getChatsByRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = req.query.room;
        console.log(room);
        const chats = yield chat_1.default.find({ room }).populate("userId"); // Populates user details
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(500).json(`Error fetching chats for room: ${error.message}`);
    }
});
exports.getChatsByRoom = getChatsByRoom;
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
exports.default = router;
