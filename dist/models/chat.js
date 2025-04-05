"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./user"));
const chatSchema = new mongoose_1.default.Schema({
    "room": {
        type: String
    },
    "userId": {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: user_1.default
    },
    "message": {
        type: String
    }
});
const Chat = mongoose_1.default.model("Chat", chatSchema);
exports.default = Chat;
