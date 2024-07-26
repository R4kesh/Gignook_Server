import mongoose, { Schema, Document } from 'mongoose';

interface PostDocument extends Document {
    userId: mongoose.Types.ObjectId;
    title?: string;
    description?: string;
    category?: string;
    budget?: number;
    isBudgetFlexible?: boolean;
    isListed?:boolean;
    date?: Date;
    created:Date;
    images: string[];
    interestedUsers: mongoose.Types.ObjectId[];
    savedBy: mongoose.Types.ObjectId[];
}


const postSchema = new Schema<PostDocument>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userCollection', required: true },
    title: { type: String },
    description: { type: String },
    category: { type: String},
    budget: { type: Number},
    isBudgetFlexible: { type: Boolean, default: false },
    isListed:{type:Boolean,default:false},
    date: { type: Date },
    created:{type:Date,default:Date.now},
    images: { type: [String], required: true },
    interestedUsers: [{ type: Schema.Types.ObjectId, ref: 'userCollection' }],
    savedBy: [{ type: Schema.Types.ObjectId, ref: 'userCollection' }],
});

const Post = mongoose.model<PostDocument>('Post', postSchema);
export default Post;
