import mongoose, { Schema, Document, Model } from "mongoose";

interface IConversation extends Document {
  members: string[];
  lastMessage:string,
    lastMessagedTime:string,
}

const conversationSchema: Schema<IConversation> = new Schema({
  members: {
    type: [String],
    required: false,
  },
  lastMessage:{
    type:String,
    required:false,

},
lastMessagedTime:{
    type:String,
    required:false
}
});

const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);
export default Conversation;
