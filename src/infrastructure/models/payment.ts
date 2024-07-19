import mongoose,{Schema,Document} from "mongoose";
interface payment extends Document {
    userId: mongoose.Types.ObjectId;
    workId: mongoose.Types.ObjectId;
    amount:number;
    title:String;
    date:Date;
    freelancer:mongoose.Types.ObjectId;
}

const paymentSchema=new Schema<payment>({
    userId:{type:mongoose.Schema.Types.ObjectId, ref: 'userCollection', required: true },
    workId:{type:mongoose.Schema.Types.ObjectId, ref: 'Work',require:true},
    amount:{type:Number},
    title:{type:String},
    date:{type:Date,default:Date.now},
    freelancer:{type:mongoose.Schema.Types.ObjectId, ref: 'userCollection',require:true},
});

const Payment=mongoose.model<payment>('Payment',paymentSchema);
export default Payment
