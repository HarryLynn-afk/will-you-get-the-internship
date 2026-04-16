# Will You Get the Internship?

A fun tech interview quiz app where players pick their dream job role, answer 5 questions, and receive an AI-generated hiring verdict with a personalized roast based on the role they wanted.

---

## How the App Works

Player enters their name and picks their dream job role → answers 5 fun tech interview questions one by one → AI acts as a brutally funny recruiter and judges their performance based on their score and chosen role → delivers a verdict (Hired, Ghosted, or Rejected) with a personalized roast → result saves to the leaderboard where everyone can see who got hired and who got destroyed.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** CSS (globals.css + component styles)
- **Database:** MySQL (TiDB for production)
- **AI:** Groq API
- **Deployment:** Vercel
- **Environment:** `.env.local` for DB and API credentials

---

## Database Schema

```sql
CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  option_a VARCHAR(255),
  option_b VARCHAR(255),
  option_c VARCHAR(255),
  option_d VARCHAR(255),
  correct_answer CHAR(1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_name VARCHAR(100) NOT NULL,
  job_role VARCHAR(100),
  score INT NOT NULL,
  verdict VARCHAR(50),
  roast TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Seed the `questions` table with 10 questions so the quiz randomly picks 5 each game.

### Sample questions to seed:

1. "Your interviewer asks your biggest weakness. You say..."
   - A: "I work too hard" (classic red flag)
   - B: "I sometimes forget to push to GitHub"
   - C: "I have none, I am perfect"
   - D: "Honestly? CSS"
   - Correct: B

2. "They ask you to explain recursion. You..."
   - A: "Google it under the table"
   - B: "Explain it by explaining recursion"
   - C: "Give a clear example with a function calling itself"
   - D: "Say it's like a loop but cooler"
   - Correct: C

3. "What does API stand for?"
   - A: "Applied Programming Interface"
   - B: "Application Programming Interface"
   - C: "Automated Process Integration"
   - D: "A Pretty Important thing"
   - Correct: B

4. "They ask about your biggest project. Yours is a to-do list. You..."
   - A: "Tell the truth and explain what you learned"
   - B: "Call it a Full-Stack Task Management System"
   - C: "Say it's under NDA"
   - D: "Cry internally but smile externally"
   - Correct: A

5. "You rate your React skills 9/10 on your resume. They ask a React question. You..."
   - A: "Answer confidently"
   - B: "Ask if they mean Angular"
   - C: "Say you're better at Vue actually"
   - D: "Blame the Wi-Fi"
   - Correct: A

6. "They ask why you want to work here. You say..."
   - A: "I need money for my side hustles"
   - B: "I align with your mission and want to grow"
   - C: "My mom told me to apply"
   - D: "Your office has free snacks"
   - Correct: B

7. "What is Git used for?"
   - A: "Making the code look pretty"
   - B: "Version control and collaboration"
   - C: "Running the server"
   - D: "Fixing bugs automatically"
   - Correct: B

8. "They ask about your salary expectation. You..."
   - A: "Say whatever they're offering"
   - B: "Research the market rate and give a range"
   - C: "Ask them what the maximum is first"
   - D: "Say you work for passion not money"
   - Correct: B

9. "You have a bug in your code during a live coding test. You..."
   - A: "Panic and go silent"
   - B: "Talk through your thinking while debugging"
   - C: "Ask if you can Google it"
   - D: "Say it works on your machine"
   - Correct: B

10. "They ask where you see yourself in 5 years. You say..."
    - A: "In your position, honestly"
    - B: "Growing with this company and leading projects"
    - C: "Retired on a beach"
    - D: "Running my own startup, so this is temporary"
    - Correct: B

---

## File Structure

```
app/
  page.js                    # Home — name + job role form
  quiz/
    page.js                  # Quiz — questions one by one
  result/
    page.js                  # Result — AI verdict + score
  leaderboard/
    page.js                  # Leaderboard — all results ranked
    [id]/
      page.js                # Single result detail page
  admin/
    page.js                  # Admin — add/edit/delete questions
  api/
    questions/
      route.js               # GET all, POST new question
      [id]/
        route.js             # PUT, DELETE single question
    results/
      route.js               # GET all results, POST new result (calls Groq API)
      [id]/
        route.js             # GET single result, DELETE
  globals.css
  layout.js

components/
  Navbar.js
  QuestionCard.js
  ResultCard.js
  LeaderboardCard.js

utils/
  db.js                      # Shared MySQL connection pool
```

---

## Environment Variables (.env.local)

```
DB_HOST=your_tidb_host
DB_USER=your_username
DB_PASS=your_password
DB_NAME=internship_quiz
DB_PORT=4000
DB_SSL=true
GROQ_API_KEY=your_groq_api_key
```

Get your Groq API key from the Groq Console.

---

## Page by Page Breakdown

### 1. Home Page — `app/page.js`

- Input: player name (text field)
- Dropdown: pick dream job role from a fixed list:
  - Frontend Developer
  - Backend Developer
  - Full Stack Developer
  - Data Scientist
  - DevOps Engineer
  - Product Manager
  - UI/UX Designer
  - Mobile Developer
- "Start Quiz" button
- On submit: store name and job role in `localStorage` then redirect to `/quiz`
- Show tagline: "Think you can survive a real tech interview? Let's find out."
- Link to `/leaderboard` in the navbar

---

### 2. Quiz Page — `app/quiz/page.js`

- `"use client"`
- On mount (`useEffect`): fetch 5 random questions from `GET /api/questions`
- Read name and job role from `localStorage`
- State: `questions`, `currentIndex`, `score`, `selectedAnswer`, `loading`, `answers`
- Show one question at a time using `QuestionCard` component
- Player clicks an answer → highlight selected → show correct or wrong → after 1 second move to next question
- Track score and collect answers summary as player goes
- After question 5: POST to `/api/results` with name, job role, score, and answers summary
- On success: redirect to `/result?id={resultId}`

---

### 3. Result Page — `app/result/page.js`

- `"use client"`
- Read result `id` from URL using `useSearchParams`
- Fetch result from `GET /api/results/[id]`
- Show big verdict: HIRED / GHOSTED / REJECTED
- Show score: X out of 5
- Show job role they applied for
- Show AI roast paragraph
- "Play Again" button → back to home
- Link to leaderboard
- This is the most important page for design — make the verdict dramatic and colorful

---

### 4. Leaderboard Page — `app/leaderboard/page.js`

- Fetch all results from `GET /api/results`
- Sort by score descending
- Render each result as a `LeaderboardCard` (rank, name, job role, score, verdict)
- Click a card → goes to `/leaderboard/[id]`

---

### 5. Leaderboard Detail Page — `app/leaderboard/[id]/page.js`

- `useParams` to get id
- Fetch single result from `GET /api/results/[id]`
- Show full details: name, job role, score, verdict, roast, date
- Delete button → `DELETE /api/results/[id]` → redirect to leaderboard

---

### 6. Admin Page — `app/admin/page.js`

- List all questions with edit and delete buttons
- Form to add a new question (question text + 4 options + correct answer)
- Edit existing questions
- This page covers the full CRUD requirement for the questions table

---

## API Routes

### `GET /api/questions`
- Query: `SELECT * FROM questions ORDER BY RAND() LIMIT 5`
- Return: array of 5 random question objects

### `POST /api/questions`
- Body: `{ question, option_a, option_b, option_c, option_d, correct_answer }`
- Insert into questions table
- Return: new question object

### `PUT /api/questions/[id]`
- Body: updated question fields
- Update the row
- Return: updated question

### `DELETE /api/questions/[id]`
- Delete the row
- Return: `{ ok: true }`

### `GET /api/results`
- Query: `SELECT * FROM results ORDER BY score DESC, created_at DESC`
- Return: all results

### `POST /api/results`
- Body: `{ player_name, job_role, score, answers_summary }`
- Call Groq API to generate verdict and roast
- Save to DB with verdict and roast
- Return: saved result with id

### `GET /api/results/[id]`
- Fetch single result by id
- Return 404 if not found

### `DELETE /api/results/[id]`
- Delete result
- Return: `{ ok: true }`

---

## Groq API Call (inside POST /api/results)

```javascript
const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
  },
  body: JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a brutally honest but funny tech recruiter. Respond only with valid JSON.",
      },
      {
        role: "user",
        content: `A candidate named ${player_name} just interviewed for a ${job_role} position.
They scored ${score} out of 5 on a tech interview quiz.
Their answers summary: ${answers_summary}

Respond only as JSON in this exact shape:
{"verdict":"HIRED","roast":"your roast here"}`,
      },
    ],
    response_format: {
      type: "json_object",
    },
  }),
});

const data = await response.json();
const parsed = JSON.parse(data.choices[0].message.content);
// parsed.verdict and parsed.roast
```

---

## Components

### `Navbar.js`
- Links: Home, Leaderboard, Admin
- Use `Link` from `next/link`

### `QuestionCard.js`
Props: `question`, `options`, `onSelect`, `selectedAnswer`, `correctAnswer`
- Shows question text
- 4 answer buttons (A, B, C, D)
- Highlight green if correct, red if wrong after selection

### `ResultCard.js`
Props: `name`, `job_role`, `score`, `verdict`, `roast`
- Big verdict badge: green = HIRED, yellow = GHOSTED, red = REJECTED
- Score display
- Job role display
- Roast text

### `LeaderboardCard.js`
Props: `rank`, `name`, `job_role`, `score`, `verdict`
- Compact card for leaderboard list
- Rank number on the left
- Verdict badge on the right

---

## Key Concepts Used (maps to PDFs)

| PDF | What is used |
|-----|-------------|
| 1 | CSS layout, flexbox, form styling, navbar |
| 2 | Next.js App Router, JSX, className, routes |
| 3 | QuestionCard, ResultCard, LeaderboardCard components with props, .map() |
| 4 | useState for quiz flow, useEffect for data fetching, useParams, useRouter |
| 5 | CRUD flow for questions and results, controlled forms in admin |
| 6 | MySQL API routes, db.js pool, .env.local, Groq API call, Vercel deploy |

---

## Build Order (recommended)

1. Set up Next.js project and install mysql2
2. Create `utils/db.js` and connect to TiDB
3. Create DB tables and seed questions
4. Build API routes for questions (GET, POST, PUT, DELETE)
5. Build API routes for results (GET, POST with Groq call, DELETE)
6. Test all API routes with Postman before touching frontend
7. Build Admin page (CRUD for questions)
8. Build Home page (name + job role dropdown form)
9. Build Quiz page (question flow with useState)
10. Build Result page (fetch and display AI verdict)
11. Build Leaderboard and detail pages
12. Style all pages with CSS
13. Deploy to Vercel with environment variables

---

## Notes for Claude Code

- Always use `"use client"` on pages that use hooks
- Use `className` not `class` in JSX
- Use `router.push()` for redirects after mutations not `window.location.href`
- Use loading and error states on every page that fetches data
- Keep the Groq API call only in the server-side API route never in the frontend
- The GROQ_API_KEY must stay in `.env.local` and never be exposed to the client
- Store player name and job role in `localStorage` to pass between home and quiz pages
