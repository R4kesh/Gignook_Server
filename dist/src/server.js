"use strict";
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// // import databaseConnection from "../config/database/connection";
// import databaseConnection from "./config/database/connection";
// import bodyParser from "body-parser"
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
exports.io = void 0;
// import userRoute from "./presentation/routes/userRoute"
// import adminRoute from "./presentation/routes/adminRoute"
// import freelancerRoute from "./presentation/routes/freelancerRoute"
// dotenv.config();
// const port = process.env.PORT||5001
// const app=express()
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.json());
// databaseConnection()
// app.use("/api/user",userRoute)
// app.use("/api/admin",adminRoute)
// app.use("/api/freelancer",freelancerRoute)
// app.listen(port,()=>{
//     console.log(`Server started on ${port}`);
// })
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("./config/database/connection"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoute_1 = __importDefault(require("./presentation/routes/userRoute"));
const adminRoute_1 = __importDefault(require("./presentation/routes/adminRoute"));
const freelancerRoute_1 = __importDefault(require("./presentation/routes/freelancerRoute"));
const socket_io_1 = require("socket.io");
const userModel_1 = __importDefault(require("./infrastructure/models/userModel"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.BASE_URL,
        // credentials: true,
    },
});
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
(0, connection_1.default)();
app.use("/api/user", userRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
app.use("/api/freelancer", freelancerRoute_1.default);
let users = [];
const connectedUsers = {};
exports.io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    socket.on('likePost', ({ postId, userId, names }) => {
        console.log(`User ${names} liked post ${postId}`);
        exports.io.emit(`notification_${userId}`, { postId, userId, message: `${names} Intrested in your post!` });
    });
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            exports.io.emit('getUsers', users);
            console.log("users", users);
        }
    });
    socket.on('sendMessage', (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, receiverId, message, conversationId }) {
        console.log('socksenMe', senderId, receiverId, message, conversationId);
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = yield userModel_1.default.findById(senderId);
        console.log('sender :>> ', sender, receiver);
        if (receiver) {
            exports.io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user === null || user === void 0 ? void 0 : user._id, firstname: user === null || user === void 0 ? void 0 : user.firstname, email: user === null || user === void 0 ? void 0 : user.email }
            });
        }
        else {
            exports.io.to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user === null || user === void 0 ? void 0 : user._id, firstname: user === null || user === void 0 ? void 0 : user.firstname, email: user === null || user === void 0 ? void 0 : user.email }
            });
        }
    }));
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        exports.io.emit('getUsers', users);
        console.log('Client disconnected');
    });
});
server.listen(port, () => {
    console.log(`Server started on ${port}`);
});
