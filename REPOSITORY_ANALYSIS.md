# Academora - Complete Repository Analysis

## 📋 Executive Summary

**Academora** is a full-stack university discovery and comparison platform designed to help students find their ideal educational institutions. The application provides intelligent matching algorithms, financial aid estimation, university comparison tools, and a rich content management system.

---

## 🏗️ Architecture Overview

### Monorepo Structure
```
Academora_01/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-based pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Zustand state management
│   │   ├── lib/            # Utilities and API client
│   │   ├── types/          # TypeScript type definitions
│   │   └── i18n/           # Internationalization
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # Express Backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── validation/     # Zod schemas
│   │   ├── lib/            # Utilities (cache, cloudinary)
│   │   ├── emails/         # Email templates
│   │   └── tests/          # Unit tests (Vitest)
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seeds/          # Database seeding
│   │   └── migrations/     # Database migrations
│   └── package.json
│
├── package.json            # Root workspace configuration
├── vitest.config.ts        # Test configuration
└── docs/                   # Documentation
    ├── PROJECT_SETUP.md
    ├── DATABASE_MIGRATION_GUIDE.md
    └── SEEDING_IMPLEMENTATION.md
```

---

## 🎯 Core Features

### 1. University Discovery & Search Engine
- **Advanced Filtering**: Filter by academics, financials, location, social factors, and career outcomes
- **Smart Matching Algorithm**: Personalized university recommendations based on user profile
- **Weighted Scoring System**: Customizable importance factors for different criteria
- **Tiered Access**: Different result limits for anonymous, free, premium, and admin users

### 2. User Authentication & Profiles
- **Clerk Integration**: Secure authentication with multiple sign-in methods
- **User Roles**: USER, PREMIUM, ADMIN with different access levels
- **Academic Profile**: GPA, test scores (SAT/ACT/AP/IB), extracurriculars, honors
- **Financial Profile**: Budget, household income, savings, investments, aid eligibility
- **Onboarding System**: Guided profile setup for new users

### 3. Financial Aid Calculator
- **Personalized Estimation**: Based on family income, assets, and academic performance
- **Residency-Based Calculation**: In-state, out-of-state, and international rates
- **Need-Based Aid**: EFC calculation following simplified federal methodology
- **Merit-Based Aid**: Bonus calculations for academic achievement
- **Breakdown Reporting**: Detailed cost and aid breakdown

### 4. University Comparison Engine
- **Side-by-Side Analysis**: Compare up to multiple universities simultaneously
- **Expanded Metrics**: Cost, ROI, rankings, acceptance rates, employment outcomes
- **Risk Assessment**: Risk factor analysis with severity ratings
- **Trend Analysis**: Historical data for rankings, costs, and employment
- **Smart Recommendations**: Best value, most prestigious, most affordable, etc.

### 5. Content Management System (Blog)
- **Article Management**: DRAFT, PENDING, PUBLISHED, REJECTED, ARCHIVED statuses
- **Rich Text Editor**: TipTap-based editor with formatting, images, and media
- **Categories & Tags**: Organized content taxonomy
- **Comments System**: Nested comments with upvote/downvote
- **Analytics**: View counts, likes, shares tracking
- **SEO Support**: Meta titles, descriptions, canonical URLs, OG images

### 6. Review System
- **University Reviews**: Overall rating with detailed breakdown
- **Rating Categories**: Academic, campus, social, career dimensions
- **Moderation**: PENDING, APPROVED, REJECTED status workflow
- **Verification**: Verified reviewer badges
- **Engagement**: Helpful count and anonymous posting option

### 7. Gamification & Referrals
- **Badge System**: Achievement badges for user engagement
- **Referral Program**: Referral codes with reward tracking
- **Profile Completion**: Progress tracking for profile completeness

### 8. Admin Dashboard
- **University Management**: Create, edit, delete universities
- **Article Moderation**: Review and publish user-submitted content
- **Review Moderation**: Approve or reject university reviews
- **Claims Management**: Process university/group verification claims
- **Group Management**: University groups/consortiums
- **Analytics**: Platform health and usage statistics

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI Framework |
| TypeScript | ~5.9.3 | Type Safety |
| Vite (rolldown-vite) | 7.2.5 | Build Tool |
| TailwindCSS | 3.4.1 | Styling |
| React Router | 7.9.6 | Client-side Routing |
| TanStack React Query | 5.90.11 | Server State Management |
| Zustand | 5.0.9 | Client State Management |
| React Hook Form | 7.67.0 | Form Handling |
| Zod | 4.1.13 | Validation |
| Clerk React | 5.57.0 | Authentication |
| Recharts | 3.5.1 | Data Visualization |
| Framer Motion | 12.23.24 | Animations |
| TipTap | 3.11+ | Rich Text Editor |
| Axios | 1.13.2 | HTTP Client |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | - | Runtime |
| Express | 4.18.2 | Web Framework |
| TypeScript | 5.3.3 | Type Safety |
| Prisma | 5.12.0 | ORM |
| PostgreSQL | - | Database |
| Clerk Express | 1.7.53 | Authentication |
| Zod | 3.22.4 | Validation |
| Stripe | 20.0.0 | Payments |
| Resend | 6.5.2 | Email Service |
| Cloudinary | 2.8.0 | Image Storage |
| Multer | 2.0.2 | File Uploads |
| Helmet | 7.1.0 | Security Headers |

### Development & Testing
| Technology | Version | Purpose |
|-----------|---------|---------|
| Vitest | 4.0.15 | Testing Framework |
| ESLint | 9.39.1 | Linting |
| Nodemon | 3.0.2 | Dev Server |
| ts-node | 10.9.2 | TypeScript Execution |

---

## 📊 Database Schema

### Core Models (24 Total)

#### User Management
- **User**: Core user entity with Clerk integration, roles, and profile data
- **AcademicProfile**: Extended academic information (1:1 with User)
- **FinancialProfile**: Financial information and aid eligibility (1:1 with User)
- **AnalysisWeights**: Custom analysis preferences (1:1 with User)

#### University Data
- **University**: Comprehensive university information with 60+ fields
- **UniversityGroup**: University consortiums/groups
- **UniversityMetricHistory**: Historical metrics for trend analysis
- **SavedUniversity**: User's saved/bookmarked universities
- **MicroContent**: University-specific tips and content

#### Content System
- **Article**: Blog posts with SEO and analytics
- **Category**: Article categories
- **Tag**: Article tags (M:N with Article)
- **Comment**: Nested comment system
- **ArticleLike**: Article engagement tracking
- **ArticleAnalytics**: Daily article metrics

#### Reviews & Claims
- **Review**: University reviews with ratings
- **UniversityClaim**: Verification claims for institutions
- **ComparisonRiskAssessment**: Risk analysis for comparisons
- **ComparisonInsight**: Natural language comparison insights

#### Engagement & Gamification
- **Notification**: User notifications
- **Referral**: Referral tracking
- **Badge**: Achievement definitions
- **UserBadge**: User's earned badges

#### Analysis
- **Comparison**: Saved university comparisons
- **StaticPage**: CMS pages (about, contact, etc.)

### Key Enums
```prisma
enum UserRole { USER, PREMIUM, ADMIN }
enum ArticleStatus { DRAFT, PENDING, REJECTED, PUBLISHED, ARCHIVED }
enum ReviewStatus { PENDING, APPROVED, REJECTED }
enum ClaimStatus { PENDING, APPROVED, REJECTED, VERIFIED }
enum ApplicationStatus { PLANNED, APPLIED, ACCEPTED, REJECTED, WAITLISTED }
enum InstitutionType { PUBLIC, PRIVATE_NON_PROFIT, PRIVATE_FOR_PROFIT }
enum CampusSetting { URBAN, SUBURBAN, RURAL }
enum TestPolicy { REQUIRED, OPTIONAL, BLIND }
```

---

## 🔌 API Endpoints

### Public Routes
| Route | Description |
|-------|-------------|
| `GET /api/health` | Health check |
| `GET /api/profiles/:username` | Public user profiles |

### Protected Routes (Requires Auth)
| Route Prefix | Controller | Description |
|-------------|------------|-------------|
| `/api/universities` | UniversityController | University CRUD & search |
| `/api/matching` | MatchingController | University matching engine |
| `/api/aid` | FinancialAidController | Financial aid calculations |
| `/api/user` | UserController | User profile management |
| `/api/articles` | ArticleController | Blog/article management |
| `/api/comments` | CommentController | Comment system |
| `/api/reviews` | ReviewController | University reviews |
| `/api/compare` | CompareController | Comparison engine |
| `/api/groups` | GroupController | University groups |
| `/api/claims` | ClaimController | Verification claims |
| `/api/notifications` | NotificationController | User notifications |
| `/api/referrals` | ReferralController | Referral system |
| `/api/billing` | BillingController | Stripe payments |
| `/api/onboarding` | OnboardingController | User onboarding |
| `/api/upload` | UploadController | File uploads |

### Admin Routes
| Route Prefix | Description |
|-------------|-------------|
| `/api/admin/*` | Admin dashboard operations |

### Webhook Routes (Signature Verified)
| Route | Description |
|-------|-------------|
| `/api/webhooks/clerk` | Clerk auth webhooks |
| `/api/billing/webhook` | Stripe payment webhooks |

---

## 🎨 Frontend Architecture

### Component Organization
```
components/
├── admin/          # Admin dashboard components
├── auth/           # Authentication components
├── blog/           # Blog/article components
├── calculator/     # Financial aid calculator
├── common/         # Shared components (LoadingSpinner, ErrorBoundary)
├── compare/        # Comparison features
├── dashboard/      # User dashboard
├── editor/         # Rich text editor
├── layout/         # Layout components (Navbar, Footer)
├── matching/       # Matching engine UI
├── profile/        # User profile
├── reviews/        # Review components
├── search/         # Search interface
├── ui/             # Base UI components (shadcn/ui style)
├── university/     # University detail components
└── visualizations/ # Charts and graphs
```

### State Management
- **Server State**: TanStack React Query for API data caching
- **Client State**: Zustand stores for UI state
  - `useUserStore`: User authentication state
  - `useSearchStore`: Search criteria and results
  - `useOnboardingStore`: Onboarding flow state
  - `useMatchingProfileStore`: Matching preferences

### Routing Structure
```
/ (RootLayout)
├── /                       # Landing page
├── /search                 # University search
├── /compare                # University comparison
├── /pricing                # Pricing plans
├── /blog                   # Blog listing
├── /blog/:slug             # Article detail
├── /university/:slug       # University detail
├── /groups                 # University groups
├── /@:username             # Public profile

/dashboard (DashboardLayout - Protected)
├── /dashboard              # User dashboard
├── /dashboard/saved        # Saved universities
├── /dashboard/profile      # Profile settings
├── /dashboard/badges       # User badges
├── /dashboard/referrals    # Referral dashboard
├── /dashboard/matching-engine  # Matching tool

/admin (AdminLayout - Protected/Admin)
├── /admin                  # Admin dashboard
├── /admin/universities     # University management
├── /admin/articles         # Article management
├── /admin/reviews          # Review moderation
├── /admin/claims           # Claims management
```

---

## 🔒 Security Features

### Authentication
- Clerk-based authentication with JWT tokens
- Session management and token refresh
- Role-based access control (USER, PREMIUM, ADMIN)

### API Security
- Helmet for security headers
- CORS configuration
- Request validation with Zod schemas
- Webhook signature verification (Svix for Clerk, Stripe)

### Data Protection
- Parameterized queries via Prisma (SQL injection prevention)
- Input sanitization (DOMPurify on client)
- Profile visibility controls (PUBLIC, PRIVATE, FOLLOWERS_ONLY)

---

## 📈 Build & Test Status

### Current Issues
1. **Server Build Errors** (4 TypeScript errors in tests):
   - Prisma mock missing `count` method
   - Type safety issues with JSON fields in tests

2. **Client Lint Errors** (96 total):
   - Unused imports
   - `any` type usage
   - Missing type-only imports
   - Missing component props

### Commands
```bash
# Root
npm install                 # Install root dependencies
npm run test:server         # Run server tests

# Server
cd server
npm run dev                 # Start dev server (port 3001)
npm run build               # Build TypeScript
npm run db:push             # Push schema to database
npm run db:seed             # Seed database
npm run db:studio           # Open Prisma Studio

# Client
cd client
npm run dev                 # Start Vite dev server (port 5173)
npm run build               # Build for production
npm run lint                # Run ESLint
npm run preview             # Preview production build
```

---

## 📁 Key Files Reference

### Configuration
- `server/prisma/schema.prisma` - Database schema
- `server/tsconfig.json` - Server TypeScript config
- `client/vite.config.ts` - Vite build configuration
- `client/tailwind.config.js` - Tailwind CSS configuration
- `vitest.config.ts` - Test configuration

### Entry Points
- `server/src/index.ts` - Express server entry
- `server/src/routes.ts` - API route registration
- `client/src/main.tsx` - React app entry
- `client/src/App.tsx` - React Router configuration

### Core Services
- `MatchingService.ts` - University matching algorithm
- `FinancialAidService.ts` - Aid calculation engine
- `ComparisonAnalysisService.ts` - Comparison analytics
- `UserService.ts` - User management
- `EmailService.ts` - Email notifications

---

## 🚀 Deployment Configuration

### Server (Render)
- Configuration: `server/render.yaml`
- Build command: `npm install && npm run build`
- Start command: `npm start`

### Client (Vercel)
- Configuration: `client/vercel.json`
- Framework: Vite
- Build command: `npm run build`

### Environment Variables Required
```env
# Server
DATABASE_URL=postgresql://...
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
STRIPE_SECRET_KEY=sk_...
CLOUDINARY_URL=cloudinary://...

# Client
VITE_API_URL=https://api.academora.com
VITE_CLERK_PUBLISHABLE_KEY=pk_...
```

---

## 📝 Recommendations

### Code Quality Improvements
1. Fix TypeScript errors in test files (4 errors)
2. Address unused import warnings (96 lint issues)
3. Add type-only imports where required
4. Add missing `count` mock to Prisma test setup

### Testing Enhancements
1. Add integration tests for API endpoints
2. Add E2E tests with Playwright/Cypress
3. Increase test coverage for services
4. Add client-side component tests

### Security Recommendations
1. Implement rate limiting on API endpoints
2. Add CSRF protection for form submissions
3. Implement audit logging for admin actions
4. Add input sanitization middleware

### Performance Optimizations
1. Implement Redis caching for frequent queries
2. Add database query optimization indexes
3. Implement lazy loading for images
4. Add service worker for offline support

---

## 📚 Documentation Available

| Document | Description |
|----------|-------------|
| `PROJECT_SETUP.md` | Initial project setup guide |
| `DATABASE_MIGRATION_GUIDE.md` | Database migration instructions |
| `SEEDING_IMPLEMENTATION.md` | Database seeding documentation |
| `client/README.md` | Client-specific documentation |

---

*Analysis completed on December 5, 2025*
