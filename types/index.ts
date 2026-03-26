// ─── Domain Types ────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'company';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export type OpportunityCategory =
  | 'video'
  | 'photography'
  | 'social-media'
  | 'branding'
  | 'animation'
  | 'journalism'
  | 'podcast'
  | 'documentary'
  | 'advertising'
  | 'other';

// ─── User ────────────────────────────────────────────────────────────────────

export interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video' | 'link';
  url: string;
  thumbnail?: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  // student-specific
  career?: string;
  skills?: string[];
  bio?: string;
  portfolio?: PortfolioItem[];
  // company-specific
  companyName?: string;
  industry?: string;
  website?: string;
  description?: string;
  // shared
  location?: string;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    behance?: string;
    github?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ─── Opportunity ─────────────────────────────────────────────────────────────

export interface Opportunity {
  _id: string;
  company: User;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  category: OpportunityCategory;
  location: string;
  modality: 'remote' | 'on-site' | 'hybrid';
  compensation?: string;
  deadline?: string;
  isActive: boolean;
  applicantCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Application ─────────────────────────────────────────────────────────────

export interface Application {
  _id: string;
  opportunity: Opportunity;
  student: User;
  coverLetter: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Message ─────────────────────────────────────────────────────────────────

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  partner: User;
  lastMessage: Message;
  unreadCount: number;
}

// ─── Rating ──────────────────────────────────────────────────────────────────

export interface Rating {
  _id: string;
  reviewer: User;
  reviewee: User;
  score: number; // 1-5
  comment: string;
  createdAt: string;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  // additional role-specific
  companyName?: string;
  career?: string;
}

// ─── Search / Filter ─────────────────────────────────────────────────────────

export interface SearchFilters {
  query?: string;
  skills?: string[];
  category?: OpportunityCategory;
  modality?: string;
  location?: string;
  page?: number;
  limit?: number;
}
