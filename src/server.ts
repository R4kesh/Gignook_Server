
import express from "express";
import http from 'http'
import dotenv from "dotenv";
import cors from "cors";
import databaseConnection from "./config/database/connection";
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser';
import userRoute from "./presentation/routes/userRoute"
import adminRoute from "./presentation/routes/adminRoute"
import freelancerRoute from "./presentation/routes/freelancerRoute"

import {Server,Socket} from "socket.io"
import User from "./infrastructure/models/userModel";
dotenv.config();

const port = process.env.PORT


const app=express()
const server = http.createServer(app);
export const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin:process.env.BASE_URL,
    // credentials: true,
  },
});

app.use(cors());

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
databaseConnection()

app.use("/api/user",userRoute)
app.use("/api/admin",adminRoute)
app.use("/api/freelancer",freelancerRoute)

let users: { userId: string, socketId: string }[] = [];
const connectedUsers:any = {};
io.on('connection', (socket:Socket) => {
    console.log('A user connected',socket.id);

    socket.on('likePost', ({ postId, userId,names }) => {
      console.log(`User ${names} liked post ${postId}`);
      io.emit(`notification_${userId}`, { postId,userId,message: `${names} Intrested in your post!` });
    })

    socket.on('addUser', userId => {
      const isUserExist = users.find(user => user.userId === userId);
      if (!isUserExist) {
          const user = { userId, socketId: socket.id };
        
          
          users.push(user);
          io.emit('getUsers', users);
          console.log("users",users);
          
      }
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
    console.log('socksenMe',senderId, receiverId, message, conversationId );
   
    const receiver: { userId: string, socketId: string } | undefined = users.find(user => user.userId === receiverId);
    const sender: { userId: string, socketId: string } | undefined = users.find(user => user.userId === senderId);
    const user = await User.findById(senderId);
    console.log('sender :>> ', sender, receiver);
  
    if (receiver) {
      io.to(receiver.socketId).to(sender!.socketId).emit('getMessage', {
        senderId,
        message,
        conversationId,
        receiverId,
        user: { id: user?._id, firstname: user?.firstname, email: user?.email }
      });
    } else {
      io.to(sender!.socketId).emit('getMessage', {
        senderId,
        message,
        conversationId,
        receiverId,
        user: { id: user?._id, firstname: user?.firstname, email: user?.email }
      });
    }
  });    


    socket.on('disconnect', () => {
      users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
      console.log('Client disconnected');
    });

  

  });

server.listen(port,()=>{
    console.log(`Server started on ${port}`);
})