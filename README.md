# YouTube Clone (Full-Stack)

A feature-rich, high-performance YouTube replication built using the MERN stack, enhanced with Redis for caching and Redux for global state management.

## 🚀 Tech Stack

- **Frontend:** React.js, TailwindCSS, Redux Toolkit, React Router
- **Backend:** Node.js, Express.js, REST APIs
- **Database:** MongoDB with Mongoose ODM
- **Caching & Performance:** Redis

## ✨ Key Features

- **Video Streaming & Upload:** Seamless video playback and secure uploads.
- **User Authentication:** Secure signup/login (JWT based).
- **State Management:** Predictable state container using Redux Toolkit for user sessions and video feeds.
- **Performance Optimization:** Redis caching for frequently accessed data (like trending videos or user profiles).
- **Responsive UI:** Modern, clean, and fully responsive interface styled with TailwindCSS.
- **Interactions:** Like, comment, subscribe, and view count tracking.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your MONGO_URI, REDIS_URL, and JWT_SECRET
   npm start
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
