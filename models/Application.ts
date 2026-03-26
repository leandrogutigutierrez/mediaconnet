import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApplication extends Document {
  opportunity: mongoose.Types.ObjectId;
  student:     mongoose.Types.ObjectId;
  coverLetter: string;
  status:      'pending' | 'accepted' | 'rejected';
  createdAt:   Date;
  updatedAt:   Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    opportunity: {
      type:     Schema.Types.ObjectId,
      ref:      'Opportunity',
      required: true,
    },
    student: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    coverLetter: { type: String, default: '' },
    status: {
      type:    String,
      enum:    ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// A student can only apply once per opportunity
ApplicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });

const Application: Model<IApplication> =
  mongoose.models.Application ??
  mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;
