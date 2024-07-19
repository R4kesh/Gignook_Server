import mongoose,{Schema,Document} from 'mongoose'
interface WorkDocument extends Document {
    userId: mongoose.Types.ObjectId;
    images: string[];
    title: string;
    freelancerName: string;
    freelancerEmail:string;
    description: string;
    link:string
    cost: number;
}

const workSchema = new Schema<WorkDocument>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userCollection', required: true },
    images: {
        type:[String]
        
    },
    title: {
        type: String,
        
    },
   
    description: {
        type: String,
       
    },
    link:{
        type:String,
        
    },
    cost: {
        type: Number,
       
    }
});

const Work = mongoose.model<WorkDocument>('Work', workSchema);
export default Work