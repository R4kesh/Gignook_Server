import mongoose, { Schema, Document, Model } from "mongoose";

interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  message: string;
  receiverId: string;
  createdAt: Date;
}

const messageSchema: Schema<IMessage> = new Schema({
  conversationId: {
    type: String,
    
  },
  senderId: {
    type: String,
  
  },
  message: {
    type: String,
   
  },
  receiverId: {
    type: String,
    required: false
},
createdAt:{
    type:Date,
    required:false
},
});

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
