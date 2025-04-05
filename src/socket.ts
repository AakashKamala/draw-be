import { WebSocket, WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import Chat from './models/chat';

dotenv.config()

import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err: any) => console.error("MongoDB connection error:", err));


const SOCKET_PORT=process.env.SOCKET_PORT as unknown as number

const wss = new WebSocketServer({ port: SOCKET_PORT });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    console.log(decoded)

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.id) {
      return null;
    }

    return decoded.id;
  } catch(e) {
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
    ws.close()
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
    }

    console.log(parsedData)

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.room);
    }

    console.log("message received")
    console.log(parsedData);

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      (async function saveMsg() {
        const newChat = new Chat({ room: roomId, userId: '67eed48b5e1264b318fe4475', message: JSON.stringify(message) });
        console.log("start", newChat)
        await newChat.save();
        console.log("end")
      })()

      users.forEach(user => {
        console.log("user", user.userId)
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })
    }

  });

});