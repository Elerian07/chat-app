import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import { handleError } from '../chat app/src/service/asyncHandler.js';
import cors from 'cors';
import connectDB from "./DB/DBconnection.js";
import * as indexRouter from "../chat app/src/modules/index.router.js";
import { Socket } from 'socket.io';
import { Server } from 'socket.io'

const app = express();


app.use(express.json());
// setup port and the baseUrl

const port = process.env.PORT
const baseUrl = process.env.BASEURL
app.use(express.static(__dirname));

//cors
app.use(cors({}))

app.get('/', (req, res) => { res.send("<h1>HELLO</h1>") })
app.use(`${baseUrl}message`, indexRouter.messageRouter)
app.use(`${baseUrl}user`, indexRouter.userRouter)
app.use(`${baseUrl}auth`, indexRouter.authRouter)
app.use('*', (req, res, next) => {
    res.send("In-valid Routing Plz check url  or  method")
})

app.use(handleError)

connectDB()

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         credentials: true
//     }
// })

// global.onlineUsers = new Map();

// io.on("connection", (Socket) => {
//     global.chatSocket = Socket;
//     Socket.on("add-user", (userId) => {
//         onlineUsers.set(userId, Socket.id)
//     })

//     Socket.on("send-msg", (data) => {
//         const sendUserSocket = onlineUsers.get(data.to);
//         if (sendUserSocket) {
//             Socket.to(sendUserSocket).emit("msg-recieve".data.msg)
//         }
//     })
// })

