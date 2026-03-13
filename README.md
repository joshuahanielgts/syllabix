# SyllabiX - AI-Powered Exam Intelligence

SyllabiX is an AI-powered study assistant that analyzes your syllabus and past exam papers to create a smart study strategy. Upload your documents and get intelligent insights about the most important topics, exam coverage, and a personalized study plan.

## Features

- **Topic Frequency Analysis** - Detects the most frequently appearing topics across exam papers
- **Priority Topic Ranking** - Ranks topics by exam importance: High, Medium, and Low
- **Exam Coverage Estimator** - Predicts how much of the exam is covered by studying top topics
- **AI Study Plan Generator** - Creates an optimized day-by-day study roadmap
- **Predicted Exam Questions** - AI-generated predicted questions based on syllabus analysis
- **PDF Export** - Export your analysis results as a professional PDF report

## Tech Stack

- **Frontend**: React 18.3, TypeScript 5.8, Vite 5.4
- **Styling**: Tailwind CSS 3.4, shadcn/ui (Radix UI primitives)
- **State Management**: TanStack React Query
- **Routing**: React Router DOM 6.30
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **AI**: Google Gemini 2.0 Flash
- **Charts**: Recharts 2.15
- **PDF Generation**: jsPDF 4.2 with autoTable
- **Animations**: Framer Motion 12
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest, Playwright, Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun)
- npm, yarn, or bun
- Supabase account
- Google Gemini API key

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd syllabix

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Gemini API credentials

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## How It Works

1. **Upload** - Upload your syllabus and previous exam papers as PDF files
2. **Analyze** - AI extracts topics and calculates frequency across all papers
3. **Strategize** - Dashboard shows priority topics, coverage, and a study roadmap

## Project Structure

```
syllabix/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── NavLink.tsx     # Navigation link component
│   │   ├── PageTransition.tsx # Page transition animations
│   │   ├── ProtectedRoute.tsx # Auth route guard
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx  # Mobile detection hook
│   │   ├── use-toast.ts    # Toast notifications hook
│   │   └── useAuth.tsx     # Authentication hook
│   ├── integrations/       # Third-party integrations
│   │   ├── lovable/       # Lovable.dev integration
│   │   └── supabase/      # Supabase client & types
│   ├── lib/                # Utility functions
│   │   ├── demo-results.ts # Demo data for testing
│   │   └── utils.ts       # General utilities
│   ├── pages/              # Page components
│   │   ├── Auth.tsx       # Google OAuth sign-in
│   │   ├── Dashboard.tsx  # Analysis results display
│   │   ├── History.tsx    # Past analyses list
│   │   ├── Index.tsx      # Landing page
│   │   ├── NotFound.tsx   # 404 page
│   │   └── Upload.tsx     # PDF upload interface
│   └── test/               # Test files
├── supabase/
│   ├── config.toml         # Supabase local config
│   ├── functions/          # Supabase Edge Functions
│   │   └── analyze-syllabus/  # AI analysis function
│   └── migrations/         # Database migrations
└── public/                 # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## License

MIT
