# SyllabiX – Authentication System (Google Only)

## Authentication Strategy

SyllabiX uses **Google OAuth via Supabase Auth** for all user authentication.

Users log in using their Google account. Supabase manages sessions, user identity, and secure access to user data.

No email/password authentication is implemented.

---

# Auth Flow

The authentication flow works like this:

```
Landing Page
     ↓
Click "Analyze Your Syllabus"
     ↓
Redirect → /auth
     ↓
Google OAuth Sign-In
     ↓
Supabase creates user session
     ↓
Redirect → /upload
     ↓
User uploads syllabus and exam papers
     ↓
AI analysis
     ↓
Dashboard
```

---

# Auth Page (`/auth`)

This page contains a **single login action**.

Interface elements:

Title  
  
**Sign in to SyllabiX**

Description  
  
Continue with your Google account to analyze your syllabus.

Primary button:

```
Sign in with Google
```

No additional login options.

---

# Supabase Auth Configuration

Authentication provider enabled:

```
Google OAuth
```

Supabase automatically creates a user entry in:

```
auth.users
```

User information available:

```
id
email
full_name
avatar_url
```

---

# User Session Handling

Supabase manages user sessions automatically.

Session contains:

```
user.id
user.email
user.metadata
```

This session is used to associate each analysis with the correct user.

---

# Protected Routes

The following routes require authentication.

```
/upload
/dashboard/:id
```

If a user is not logged in:

```
Redirect → /auth
```

---

# Database Relationship

Each analysis is linked to the user that created it.

Table:

```
analyses
```

Schema:

```
id
user_id
file_names
topics (jsonb)
coverage_percentage
study_plan (jsonb)
predicted_questions (jsonb)
created_at
```

`user_id` references:

```
auth.users.id
```

---

# Row Level Security (RLS)

Supabase Row Level Security ensures users only access their own data.

Policy:

```
Users can read analyses where user_id = auth.uid()
Users can insert analyses where user_id = auth.uid()
```

This prevents users from accessing other users' results.

---

# File Storage Structure

Uploaded PDFs are stored in Supabase Storage.

Bucket:

```
syllabus-uploads
```

Folder structure:

```
user_id/
    syllabus.pdf
    exam_paper_1.pdf
    exam_paper_2.pdf
```

This keeps files isolated per user.

---

# Frontend Authentication Flow

React checks for active session.

If session exists:

```
redirect → /upload
```

If session missing:

```
redirect → /auth
```

Supabase client handles OAuth redirect automatically.

---

# Sign Out Feature

Users can log out from the dashboard.

Action:

```
Sign Out
```

This clears the Supabase session and redirects to:

```
/
```