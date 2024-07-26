import mongoose, { Schema, Document, Model } from "mongoose";

interface AttachmentDocument extends Document {
  attachment: string;
  originalName: string;
}


interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  message: string;
  receiverId: string;
  createdAt: Date;
  attachments:AttachmentDocument[]
}

const attachmentSchema = new Schema<AttachmentDocument>({
  attachment: { type: String, required: true },
  originalName: { type: String, required: true },
});

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
attachments: { type: [attachmentSchema], required: false },
});

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
