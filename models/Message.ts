import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  sender:    mongoose.Types.ObjectId;
  receiver:  mongoose.Types.ObjectId;
  content:   string;
  read:      boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content:  { type: String, required: true, trim: true },
    read:     { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Efficient conversation lookups
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

const Message: Model<IMessage> =
  mongoose.models.Message ?? mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
