# YouTube Clone (Full-Stack)

A YouTube-style video platform built with the MERN stack. The backend is a production-minded REST API (JWT auth, Cloudinary media storage, Redis caching, rate limiting, transactions), and the frontend is a React 19 + Tailwind CSS 4 app that is currently under active development.

> **Project status:** Backend API is largely complete. Frontend has the app shell (navbar, sidebar, layout, routing) in place; pages and API integration are in progress. See the [Roadmap](#-roadmap).

## 🚀 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router 7, Redux Toolkit, Lucide Icons |
| **Backend** | Node.js (ES Modules), Express 5, REST APIs |
| **Database** | MongoDB with Mongoose ODM (transactions + aggregation pipelines) |
| **Media Storage** | Cloudinary (videos, thumbnails, avatars, cover images), Multer for uploads |
| **Caching** | Redis via `ioredis` |
| **Security** | JWT (access + refresh tokens), bcrypt, Helmet, CORS, `express-rate-limit` |

## ✨ Features

### Implemented (Backend)

- **Authentication:** Register, login, logout, and refresh-token flow using JWT access/refresh tokens stored in cookies. Passwords are hashed with bcrypt.
- **User Management:** Update profile details, change password, update avatar and cover image, delete account, get current user.
- **Channels:** Public channel details by username (including subscriber data) and per-user watch history.
- **Video Upload & Management:** Upload a video with a thumbnail to Cloudinary, delete videos (cleans up Cloudinary assets), fetch a single video.
- **Paginated Video Feed:** Aggregation-based feed with pagination and configurable sorting (`page`, `limit`, `sortBy`, `sortType`).
- **Likes & Subscriptions:** Toggle like on a video and toggle subscribe on a channel.
- **Redis Caching:** A user's top 10 most-viewed videos are cached with a 2-minute TTL. Cache helpers fail safely, so the API keeps working even if Redis is down.
- **Data Integrity:** MongoDB transactions keep video uploads/deletions and the user's `videosCount` consistent, with Cloudinary rollback on failure.
- **Security Hardening:** Helmet headers, CORS with credentials, and rate limiting (100 requests / 15 minutes per IP).
- **Consistent Error Handling:** Centralised error middleware with `ApiError` / `ApiResponse` helpers.

### Implemented (Frontend)

- Responsive app layout with Navbar, collapsible Sidebar, and mobile overlay sidebar
- Client-side routing with React Router
- Home page video grid (placeholder cards, to be connected to the API)

## 📁 Project Structure

```
youtube/
├── Youtube-Backend/
│   ├── public/temp/            # Temporary upload directory (Multer)
│   └── src/
│       ├── controllers/        # user, video, like, subscription logic
│       ├── db/                 # MongoDB connection
│       ├── middlewares/        # JWT auth, Multer upload
│       ├── models/             # User, Video, Like, Subscription schemas
│       ├── redis/              # Redis client config
│       ├── routes/             # Express routers
│       ├── utils/              # ApiError, ApiResponse, Cloudinary, Redis helpers
│       ├── app.js              # Express app + middleware + routes
│       └── index.js            # Server entry point
└── youtube-Frontend/
    └── src/
        ├── components/layout/  # Navbar, SideBar, OverlaySideBar, Layout
        ├── context/            # SideBar state
        ├── pages/              # Home
        ├── routes/             # Router config
        ├── App.jsx
        └── main.jsx
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas)). **Replica set is required** because the API uses transactions (Atlas works out of the box).
- A Redis instance (defaults to `redis://localhost:6379`)
- A free [Cloudinary](https://cloudinary.com/) account

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Setup the Backend

```bash
cd Youtube-Backend
npm install
```

Create a `.env` file inside `Youtube-Backend/`:

```env
PORT=5000
MONGODBURI=<your-mongodb-connection-string>
CORS=http://localhost:5173

ACCESS_TOKEN_SECRET=<long-random-string>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=<another-long-random-string>
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

REDIS_URI=redis://localhost:6379
```

Start the server (runs with nodemon):

```bash
npm start
```

The API will be available at `http://localhost:5000/api/v1`.

### 3. Setup the Frontend

```bash
cd ../youtube-Frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

Other frontend scripts: `npm run build`, `npm run preview`, `npm run lint`.

## 📡 API Reference

Base URL: `/api/v1`  |  🔒 = requires authentication (JWT)

### Users — `/users`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/register-user` | Register (multipart: `avatar`, `coverImage`) |
| POST | `/login` | Login |
| POST | `/refresh-access-token` | Get a new access token |
| POST | `/logout` 🔒 | Logout |
| GET | `/current-user` 🔒 | Get logged-in user |
| PATCH | `/update-user-details` 🔒 | Update profile details |
| PATCH | `/change-password` 🔒 | Change password |
| PATCH | `/avatar` 🔒 | Update avatar |
| PATCH | `/cover-image` 🔒 | Update cover image |
| GET | `/channel/:username` 🔒 | Channel details |
| GET | `/watch-history` 🔒 | Watch history |
| DELETE | `/delete-account` 🔒 | Delete account |

### Videos — `/videos`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/videoPage` | Paginated video feed (`page`, `limit`, `sortBy`, `sortType`) |
| GET | `/video/:id` 🔒 | Get a single video |
| POST | `/upload-video` 🔒 | Upload video (multipart: `video`, `thumbnail`, plus `title`, `description`) |
| DELETE | `/delete/:id` 🔒 | Delete a video |
| GET | `/top-videos/:id` 🔒 | A user's top 10 videos by views (Redis-cached) |

### Likes — `/likes`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/toggle/v/:videoId` 🔒 | Like / unlike a video |

### Subscriptions — `/subscription`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/toggle/v/:id` 🔒 | Subscribe / unsubscribe to a channel |

## 🗺️ Roadmap

- [ ] Connect Home page to the video feed API
- [ ] Login / Signup pages and auth flow on the frontend
- [ ] Video watch page with player, like, and subscribe actions
- [ ] Global state with Redux Toolkit (user session, video feed)
- [ ] Video upload UI and channel pages
- [ ] Comments system
- [ ] View count tracking on video watch
- [ ] Search and trending videos (with Redis caching)

## 🔐 Security Notes

- Never commit your `.env` file. It is already listed in `.gitignore`.
- Use strong, unique secrets for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.

## 👤 Author

**Hasnain Ahmad**

## 📄 License

ISC
