<div align="center">

# 🚀 Intervix AI

### AI-Powered Interview Preparation Platform

Prepare smarter. Practice confidently. Get AI-generated interview questions tailored to your role, experience, and tech stack.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/AI-Vapi-7C3AED?style=for-the-badge" />
</p>

</div>

---

## ✨ Overview

**Intervix** is a modern AI-powered interview preparation platform built with **Next.js**, **Firebase**, and **Vapi AI**.

It helps candidates practice realistic interviews by generating intelligent interview questions based on:

- 💼 Job Role
- 📈 Experience Level
- 🧠 Technical Stack
- 🎯 Interview Type
- 🔢 Number of Questions

Every generated interview is securely stored in Firebase, allowing users to revisit and continue their preparation anytime.

---

# ✨ Features

### 🤖 AI Interview Generation

Generate personalized interview questions using AI.

- Technical Interviews
- Behavioral Interviews
- Custom Question Count
- Multiple Tech Stacks

---

### 🎤 Interactive Interview Experience

- Realistic interview flow with step-by-step navigation
- Built-in Voice-to-Text (STT) and Text-to-Speech (TTS) question playback
- Dual-mode mock interview room (Interactive Mode + Vapi Voice Call)
- AI-generated evaluation & structured feedback scoring across 5 key competencies
- Interview completion tracking

---

### 📝 AI Resume Analysis & ATS Scanner

- Upload or paste resume experience
- Instant ATS compatibility scoring against target role
- Missing keyword gap identification
- Action-oriented bullet point rewrites (X-Y-Z formula)
- Direct generation of personalized mock interview questions from resume bullets

---

### 📚 Targeted Practice Drills

- Topic tracks for Frontend, Backend, System Design, Behavioral (STAR), and DSA
- Model answer outlines and interviewer guidance
- 1-click launch into targeted mock interview sessions

---

### ⭐ Saved Question Bank

- Searchable, filterable library of core tech questions
- Key concepts and interviewer intent notes
- Ability to add custom questions and copy notes
- Professional interview interface

---

### 📊 Dashboard

- Interview statistics
- Recent interviews
- Quick actions
- Continue previous interviews
- Performance overview

---

### 👤 User Profile

- Manage profile
- Update personal information
- Avatar support
- Account settings

---

### 📚 Interview History

- View completed interviews
- Search previous sessions
- Resume interviews
- Performance records

---

### ⭐ Saved Questions

Bookmark important interview questions for future practice.

---

### 📈 Performance Analytics

Track your progress with insights including:

- Average Score
- Total Interviews
- Practice Hours
- Success Rate
- AI Feedback

---

### 🔐 Authentication

- Secure authentication
- Protected routes
- Firebase integration

---

### ☁ Firebase Integration

Stores:

- User information
- Interview history
- Generated questions
- Performance records

---

# 🛠 Tech Stack

| Category       | Technology         |
| -------------- | ------------------ |
| Framework      | Next.js 15         |
| Language       | TypeScript         |
| Styling        | Tailwind CSS       |
| Database       | Firebase Firestore |
| Authentication | Firebase Auth      |
| AI             | Vapi AI            |
| Icons          | Lucide React       |
| Deployment     | Vercel             |

---

# 📂 Project Structure

```bash
Intervix/
│
├── app/
│   ├── dashboard/
│   ├── interview/
│   ├── profile/
│   ├── settings/
│   ├── api/
│
├── components/
│
├── firebase/
│
├── lib/
│
├── public/
│
├── types/
│
├── hooks/
│
├── utils/
│
└── README.md
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/intervix.git
```

Navigate into the project

```bash
cd intervix
```

Install dependencies

```bash
npm install
```

---

# ⚙ Environment Variables

Create a `.env.local`

```env
# Firebase

NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin

FIREBASE_CLIENT_EMAIL=

FIREBASE_PRIVATE_KEY=

# AI

VAPI_API_KEY=
```

> Configure these using your Firebase project credentials.

---

# ▶ Running the Project

Development

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Run Production

```bash
npm start
```

Visit

```
http://localhost:3000
```

---

# 🔗 API

## Generate Interview Questions

```
POST /api/vapi/generate
```

### Request

```json
{
  "type": "Technical",
  "role": "Frontend Developer",
  "level": "Mid Level",
  "techstack": "React, Next.js, TypeScript",
  "amount": 10,
  "userid": "user123"
}
```

---

### Success Response

```json
{
  "success": true
}
```

---

### Error Response

```json
{
  "success": false,
  "error": "Something went wrong"
}
```

---

# 📦 Database

Collection

```
interviews
```

Example document

```json
{
  "userId": "user123",
  "role": "Frontend Developer",
  "level": "Mid",
  "techstack": ["React", "Next.js"],
  "questions": [],
  "createdAt": "Timestamp"
}
```

---

# 🎯 Future Roadmap

- AI Voice Interviews
- Resume Analyzer
- Coding Assessments
- Company-specific Questions
- AI Performance Reports
- Leaderboard
- Mock Interview Scheduling
- Dark & Light Themes
- Mobile Application

---

# 🚀 Deployment

Deploy easily on **Vercel**

```bash
npm run build
```

Add the same environment variables in your deployment platform before deploying.

---

# 🤝 Contributing

Contributions are always welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit changes

```bash
git commit -m "Added amazing feature"
```

4. Push

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

### ⭐ If you found this project helpful, please consider giving it a star.

Made with ❤️ using **Next.js**, **Firebase**, and **AI**

</div>
