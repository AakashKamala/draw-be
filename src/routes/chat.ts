import { Router } from "express";
import { createChat, getChats, getChatsByRoom } from "../controllers/chat";

const router = Router();

router.post("/chat", createChat);
router.get("/chat", getChats);
router.get("/getroomchats", getChatsByRoom)

export default router;