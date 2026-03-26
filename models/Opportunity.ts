import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOpportunity extends Document {
  company:       mongoose.Types.ObjectId;
  title:         string;
  description:   string;
  requirements:  string[];
  skills:        string[];
  category:      string;
  location:      string;
  modality:      'remote' | 'on-site' | 'hybrid';
  compensation?: string;
  deadline?:     Date;
  isActive:      boolean;
  createdAt:     Date;
  updatedAt:     Date;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    company: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    title:        { type: String, required: true, trim: true },
    description:  { type: String, required: true },
    requirements: [{ type: String, trim: true }],
    skills:       [{ type: String, trim: true }],
    category: {
      type: String,
      enum: [
        'video', 'photography', 'social-media', 'branding',
        'animation', 'journalism', 'podcast', 'documentary',
        'advertising', 'other',
      ],
      default: 'other',
    },
    location: { type: String, default: '' },
    modality: {
      type:    String,
      enum:    ['remote', 'on-site', 'hybrid'],
      default: 'remote',
    },
    compensation: { type: String, default: '' },
    deadline:     { type: Date },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Full-text search on title and description
OpportunitySchema.index({ title: 'text', description: 'text', skills: 'text' });

// Common query: all active opportunities sorted by date
OpportunitySchema.index({ isActive: 1, createdAt: -1 });

const Opportunity: Model<IOpportunity> =
  mongoose.models.Opportunity ??
  mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);

export default Opportunity;
