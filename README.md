# RupeeRadar 💸

Track smart. Spend wiser.

RupeeRadar is a full-stack expense tracking application built using:

- React (Vite)
- Node.js
- Express
- SQLite
- REST APIs

---

## ✨ Features

- Add, edit, delete expenses
- Monthly analytics
- Category breakdown with progress visualization
- Money handled safely in smallest currency unit (paise)
- Clean full-stack architecture
- RESTful API structure
- Responsive UI

---

## 🧠 Design Decisions

- Money stored as integer (paise) to avoid floating point precision issues.
- Backend separated into routes and DB layer.
- Frontend structured using reusable components and clean state logic.
- Basic validation implemented on both frontend and backend.

---

## 📂 Project Structure

expense-tracker/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── db.js
│   │   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│
└── .gitignore

---

## 🚀 Running Locally

### Backend
cd backend
npm install
node src/index.js

### Frontend
cd frontend
npm install
npm run dev

---

Built with focus on data correctness, money handling precision, and clean code structure.
