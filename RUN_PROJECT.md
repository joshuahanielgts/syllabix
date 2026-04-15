# Run SyllabiX Locally (Windows)

This guide gives terminal commands to run the full project:
- Frontend (Vite React app)
- Supabase local services
- Supabase Edge Function (`analyze-syllabus`)

## 1) Open project folder

```powershell
cd d:\Projects\codeverse\syllabix
```

## 2) Install dependencies

Use one package manager.

### Option A: npm

```powershell
npm install
```

### Option B: Bun

```powershell
bun install
```

## 3) Create environment file

```powershell
Copy-Item .env.example .env
```

Then edit `.env` and set real values for:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`

## 4) Start Supabase local stack (Terminal 1)

If Supabase CLI is not installed:

```powershell
npm install -g supabase
```

Start services:

```powershell
supabase start
```

Apply migrations (safe for local dev):

```powershell
supabase db reset
```

## 5) Serve Edge Function locally (Terminal 2)

```powershell
supabase functions serve analyze-syllabus
```

## 6) Run frontend app (Terminal 3)

### If using npm

```powershell
npm run dev
```

### If using Bun

```powershell
bun run dev
```

Open the URL shown in terminal (usually `http://localhost:5173`).

## 7) Optional checks

Run lint:

```powershell
npm run lint
```

Run tests:

```powershell
npm run test
```

## 8) Stop everything

In each running terminal press `Ctrl + C`.

To stop Supabase services:

```powershell
supabase stop
```
