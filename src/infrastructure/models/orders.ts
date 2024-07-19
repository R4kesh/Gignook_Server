import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  workId: mongoose.Schema.Types.ObjectId;
  status: string;
  amount: number;
  title: string;
  freelancer: mongoose.Schema.Types.ObjectId;
  date: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userCollection', required: true },
  workId: { type: mongoose.Schema.Types.ObjectId, ref: 'Work', required: true },
  status: { type: String, default: 'pending' },
  amount: { type: Number },
  title: { type: String },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'userCollection', required: true },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
