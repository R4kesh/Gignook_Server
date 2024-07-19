import mongoose,{Schema,Document} from 'mongoose'

interface FeedbackDocument extends Document{
    workId:mongoose.Types.ObjectId;
    freelancerId: mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
    rating:number;
    feedback:string;
    date:Date
}

const feedbackSchema = new Schema<FeedbackDocument>({
  workId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Work',
    
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'userCollection',
    
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userCollection',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Feedback= mongoose.model<FeedbackDocument>('Feedback', feedbackSchema);
export default Feedback