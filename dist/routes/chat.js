"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_1 = require("../controllers/chat");
const router = (0, express_1.Router)();
router.post("/chat", chat_1.createChat);
router.get("/chat", chat_1.getChats);
router.get("/getroomchats", chat_1.getChatsByRoom);
exports.default = router;
