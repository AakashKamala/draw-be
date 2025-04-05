"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const user_1 = __importDefault(require("./routes/user"));
const chat_1 = __importDefault(require("./routes/chat"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// mongoose.connect(process.env.MONGO_URI as string).then(()=>{
//     console.log("db connected")
// }).catch((err)=>{
//     console.log("db conection failed", err)
// })
(0, db_1.connectDB)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1", user_1.default);
app.use("/api/v1", chat_1.default);
app.get("/", (req, res) => {
    res.json({ "message": "alive" });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server is listening on PORT ${PORT}`);
});
