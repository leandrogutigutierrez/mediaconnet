# MediaConnet

> Connecting Transmedia Production students with real-world creative opportunities.

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | Next.js 14 (App Router) + TypeScript    |
| Styling     | Tailwind CSS v3                          |
| Backend     | Next.js API Routes                       |
| Database    | MongoDB + Mongoose                       |
| Auth        | JWT (httpOnly cookies via `jose`)        |
| Forms       | React Hook Form + Zod                    |
| Uploads     | Local filesystem (`/public/uploads/`)    |

---

## Getting started locally

### 1 · Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally
  Install via [MongoDB Community](https://www.mongodb.com/try/download/community) or run with Docker:
  ```bash
  docker run -d -p 27017:27017 --name mongo mongo:7
  ```

### 2 · Install dependencies

```bash
cd mediaconnet
npm install
```

### 3 · Configure environment

Copy the example file and edit if needed:

```bash
cp .env.local.example .env.local
```

Default `.env.local` values work out-of-the-box for local development:

```env
MONGODB_URI=mongodb://localhost:27017/mediaconnet
JWT_SECRET=mediaconnet-super-secret-change-in-production-32chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
UPLOAD_PROVIDER=local
```

### 4 · Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5 · Build for production

```bash
npm run build
npm start
```

---

## Project structure

```
mediaconnet/
├── app/                        # Next.js App Router pages + API routes
│   ├── api/                    # REST API endpoints
│   │   ├── auth/               # register · login · logout · me
│   │   ├── users/[id]/         # profile · portfolio
│   │   ├── opportunities/      # CRUD + apply
│   │   ├── applications/       # list + accept/reject
│   │   ├── messages/           # conversations + threads
│   │   ├── search/             # unified search
│   │   ├── ratings/            # create + list
│   │   └── upload/             # file upload
│   ├── dashboard/              # role-aware dashboard
│   ├── opportunities/          # list · detail · new · edit
│   ├── profile/[id]/           # public profile
│   ├── profile/edit/           # edit own profile + portfolio
│   ├── students/               # talent directory (company view)
│   ├── messages/               # messaging UI
│   ├── applications/           # application tracker
│   ├── search/                 # global search results
│   ├── login/                  # login page
│   └── register/               # register page
├── components/
│   ├── ui/                     # Button · Input · Card · Badge · Avatar · Modal · Loading · RatingStars
│   ├── layout/                 # Navbar · Footer
│   ├── forms/                  # LoginForm · RegisterForm · ProfileForm · OpportunityForm
│   ├── student/                # StudentCard · PortfolioItem
│   ├── opportunity/            # OpportunityCard · ApplicationCard
│   ├── search/                 # SearchBar · FilterPanel
│   ├── messages/               # MessageThread
│   └── dashboard/              # StatsCard
├── contexts/
│   └── AuthContext.tsx         # global auth state + login/register/logout
├── hooks/
│   ├── useOpportunities.ts     # paginated opportunities with filters
│   └── useMessages.ts          # conversations + thread + send
├── lib/
│   ├── db.ts                   # Mongoose connection (cached)
│   ├── auth.ts                 # JWT sign/verify + cookie helpers
│   └── utils.ts                # cn · timeAgo · formatDate · apiFetch …
├── models/
│   ├── User.ts                 # student & company (single collection)
│   ├── Opportunity.ts
│   ├── Application.ts
│   ├── Message.ts
│   └── Rating.ts
├── middleware.ts               # JWT route protection (edge-compatible)
├── types/index.ts              # shared TypeScript interfaces
└── public/uploads/             # local file storage (gitignored)
```

---

## Roles & features

### Student
- Create profile: career · skills · bio · social links · location
- Upload portfolio items (images / videos / links)
- Browse & filter opportunities (category · modality · skill)
- Apply with a cover letter
- Track application status (pending / accepted / rejected)
- Message companies
- Rate other users

### Company
- Create company profile: name · industry · website · description
- Post opportunities: title · description · requirements · skills · category · modality · deadline
- View all applicants per opportunity
- Accept or reject applications
- Message students
- Rate students

### Platform
- Unified search (students + opportunities)
- Skill-based filtering
- Responsive design (mobile-first)
- Rating & review system
- Real-time-style messaging (polling)

---

## API reference (brief)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/logout` | — | Clear cookie |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/users/:id` | — | Public profile |
| PATCH | `/api/users/:id` | ✓ owner | Update profile |
| POST | `/api/users/:id/portfolio` | ✓ owner | Add portfolio item |
| DELETE | `/api/users/:id/portfolio?itemId=` | ✓ owner | Remove item |
| GET | `/api/opportunities` | — | List (filters + pagination) |
| POST | `/api/opportunities` | ✓ company | Create |
| GET | `/api/opportunities/:id` | — | Detail |
| PATCH | `/api/opportunities/:id` | ✓ owner | Update |
| DELETE | `/api/opportunities/:id` | ✓ owner | Delete |
| POST | `/api/opportunities/:id/apply` | ✓ student | Apply |
| GET | `/api/applications` | ✓ | My applications / received |
| PATCH | `/api/applications/:id` | ✓ company | Accept / reject |
| GET | `/api/messages` | ✓ | Conversation list |
| POST | `/api/messages` | ✓ | Send message |
| GET | `/api/messages/:partnerId` | ✓ | Thread (marks as read) |
| GET | `/api/search` | — | Unified search |
| GET | `/api/ratings?userId=` | — | Ratings for a user |
| POST | `/api/ratings` | ✓ | Create / update rating |
| POST | `/api/upload` | ✓ | Upload file (≤ 10 MB) |
