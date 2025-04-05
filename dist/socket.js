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
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const chat_1 = __importDefault(require("./models/chat"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
const SOCKET_PORT = process.env.SOCKET_PORT;
const wss = new ws_1.WebSocketServer({ port: SOCKET_PORT });
const users = [];
function checkUser(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        if (typeof decoded == "string") {
            return null;
        }
        if (!decoded || !decoded.id) {
            return null;
        }
        return decoded.id;
    }
    catch (e) {
        return null;
    }
}
wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);
    if (userId == null) {
        ws.close();
        return null;
    }
    users.push({
        userId,
        rooms: [],
        ws
    });
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let parsedData;
            if (typeof data !== "string") {
                parsedData = JSON.parse(data.toString());
            }
            else {
                parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
            }
            console.log(parsedData);
            if (parsedData.type === "join_room") {
                const user = users.find(x => x.ws === ws);
                user === null || user === void 0 ? void 0 : user.rooms.push(parsedData.roomId);
            }
            if (parsedData.type === "leave_room") {
                const user = users.find(x => x.ws === ws);
                if (!user) {
                    return;
                }
                user.rooms = user === null || user === void 0 ? void 0 : user.rooms.filter(x => x === parsedData.room);
            }
            console.log("message received");
            console.log(parsedData);
            if (parsedData.type === "chat") {
                const roomId = parsedData.roomId;
                const message = parsedData.message;
                (function saveMsg() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const newChat = new chat_1.default({ room: roomId, userId: '67eed48b5e1264b318fe4475', message: JSON.stringify(message) });
                        console.log("start", newChat);
                        yield newChat.save();
                        console.log("end");
                    });
                })();
                users.forEach(user => {
                    console.log("user", user.userId);
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId
                        }));
                    }
                });
            }
        });
    });
});
