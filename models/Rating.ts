import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRating extends Document {
  reviewer:  mongoose.Types.ObjectId;
  reviewee:  mongoose.Types.ObjectId;
  score:     number; // 1–5
  comment:   string;
  createdAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score:    { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// One review per reviewer-reviewee pair
RatingSchema.index({ reviewer: 1, reviewee: 1 }, { unique: true });

const Rating: Model<IRating> =
  mongoose.models.Rating ?? mongoose.model<IRating>('Rating', RatingSchema);

export default Rating;
