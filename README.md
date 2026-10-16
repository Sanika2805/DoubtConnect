# DoubtConnect (MERN Stack)

A collaborative platform where students post academic doubts and answer each other's questions.

| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Database | MongoDB + Mongoose                          |
| Backend  | Node.js + Express (REST API)                |
| Frontend | React 18 + React Router                     |
| Auth     | JWT (login token) + bcrypt (password hash)  |

## Folder structure
```
doubt-connect/
├── server/                 Express + MongoDB backend
│   ├── server.js           app entry point
│   ├── config/             database connection, subject list
│   ├── models/             User, Question (answers are stored inside the question)
│   ├── middleware/auth.js  checks the JWT token
│   └── routes/             auth, users, questions
└── client/                 React frontend
    └── src/
        ├── api.js          every call to the backend
        ├── context/        AuthContext (login state)
        ├── components/     DashboardLayout, ProtectedRoute, QuestionRow
        ├── pages/          Home, Login, Register, Dashboard, AskDoubt,
        │                   Questions, QuestionDetail, MyDoubts, Profile
        └── styles/         your original CSS + pages.css
```

## How to run
1. Install Node.js and MongoDB (or make a free MongoDB Atlas database).
2. Start MongoDB (local) - e.g. `mongod`.
3. In the project folder:
   ```
   npm run install-all
   npm run dev
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000  (open this one)

Settings are in `server/.env` (MONGO_URI, JWT_SECRET). For Atlas, paste your connection string into MONGO_URI.
There is **no dummy data** - create an account on the Sign Up page and start using it.

## API
| Method | Route | Login needed | What it does |
|--------|-------|:-:|--------------|
| POST | /api/auth/register | no | create account |
| POST | /api/auth/login | no | login, returns token |
| GET | /api/auth/me | yes | current user |
| PUT | /api/users/profile | yes | edit profile |
| GET | /api/users/stats | yes | asked / solved / answers given |
| GET | /api/questions?search=&subject=&author=&limit= | no | list / search / filter |
| GET | /api/questions/:id | no | one question with answers |
| POST | /api/questions | yes | ask a doubt |
| POST | /api/questions/:id/answers | yes | answer a doubt |
| DELETE | /api/questions/:id | yes (owner) | delete own doubt |
| DELETE | /api/questions/:id/answers/:answerId | yes (owner) | delete own answer |

## Features
Sign up / login (hashed passwords, JWT), protected pages, ask a doubt, browse with search + subject filter,
answer doubts, My Doubts (solved/unsolved), delete own doubts/answers, dashboard stats, editable profile.
