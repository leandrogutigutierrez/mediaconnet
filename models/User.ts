import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const PortfolioItemSchema = new Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    mediaType:   { type: String, enum: ['image', 'video', 'link'], required: true },
    url:         { type: String, required: true },
    thumbnail:   { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const SocialLinksSchema = new Schema(
  {
    linkedin:  { type: String, default: '' },
    instagram: { type: String, default: '' },
    behance:   { type: String, default: '' },
    github:    { type: String, default: '' },
  },
  { _id: false }
);

// ─── Main User interface ──────────────────────────────────────────────────────

export interface IUser extends Document {
  name:        string;
  email:       string;
  password:    string;
  role:        'student' | 'company';
  avatar?:     string;
  // Student fields
  career?:     string;
  skills?:     string[];
  bio?:        string;
  portfolio?:  mongoose.Types.DocumentArray<mongoose.Document>;
  // Company fields
  companyName?:  string;
  industry?:     string;
  website?:      string;
  description?:  string;
  // Shared
  location?:    string;
  socialLinks?: { linkedin?: string; instagram?: string; behance?: string; github?: string };
  createdAt:    Date;
  updatedAt:    Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ['student', 'company'], required: true },
    avatar:   { type: String, default: '' },

    // Student-specific
    career:    { type: String, default: '' },
    skills:    [{ type: String, trim: true }],
    bio:       { type: String, default: '' },
    portfolio: { type: [PortfolioItemSchema], default: [] },

    // Company-specific
    companyName:  { type: String, default: '' },
    industry:     { type: String, default: '' },
    website:      { type: String, default: '' },
    description:  { type: String, default: '' },

    // Shared
    location:    { type: String, default: '' },
    socialLinks: { type: SocialLinksSchema, default: {} },
  },
  { timestamps: true }
);

// Index for search
UserSchema.index({ name: 'text', bio: 'text', skills: 'text', career: 'text' });

// Never return the hashed password in JSON output
UserSchema.set('toJSON', {
  transform(_doc, ret) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ret as any).password = undefined;
    return ret;
  },
});

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema);

export default User;
