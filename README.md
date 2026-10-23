# YouTube Clone (Full-Stack)

A YouTube-style video platform built with the MERN stack. The backend is a production-minded REST API (JWT auth, Cloudinary media storage, Redis caching, rate limiting, MongoDB transactions), and the frontend is a React 19 + Tailwind CSS 4 app that is under active development.

> **Project status:** Backend API is largely complete. On the frontend, the app shell (navbar, sidebar, layout, routing) and the **Login / Sign Up** pages (connected to the API) are done. The Home feed, video upload form, watch page, and profile/history pages are still in progress. See the [Roadmap](#️-roadmap).

## 🚀 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router 7, React Hook Form, Axios, React Hot Toast, Lucide Icons (Redux Toolkit installed, not wired up yet) |
| **Backend** | Node.js (ES Modules), Express 5, REST APIs |
| **Database** | MongoDB with Mongoose ODM (transactions + aggregation pipelines, `mongoose-aggregate-paginate-v2`) |
| **Media Storage** | Cloudinary (videos, thumbnails, avatars, cover images), Multer for uploads |
| **Caching** | Redis via `ioredis` |
| **Security** | JWT (access + refresh tokens), bcrypt, Helmet, CORS, `express-rate-limit` |

## ✨ Features

### Implemented (Backend)

- **Authentication:** Register, login, logout, and refresh-token flow using JWT access/refresh tokens stored in `httpOnly` cookies (the access token is also accepted via the `Authorization: Bearer` header). Passwords are hashed with bcrypt; the stored refresh token is validated on refresh.
- **Input Validation:** Required-field checks, email format validation, minimum password length (8 characters), and duplicate username/email checks on register and profile update.
- **User Management:** Update profile details, change password, update avatar and cover image (old image is removed from Cloudinary), delete account, get current user.
- **Channels:** Channel details by username, including subscribers, the channel's videos, `videosCount`, and an `isSubscribed` flag for the logged-in user.
- **Watch History:** Aggregation-based watch history that returns watched videos along with the channel (owner) username.
- **Video Upload & Management:** Upload a video with a thumbnail to Cloudinary, delete videos (cleans up Cloudinary assets), fetch a single video.
- **Paginated Video Feed:** Aggregation-based feed with pagination and configurable sorting (`page`, `limit`, `sortBy`, `sortType`). Public endpoint (no login required).
- **Likes & Subscriptions:** Toggle like on a video and toggle subscribe on a channel. Both run inside transactions and keep the denormalized counters (`likes`, `subscribers`) in sync. Unique indexes prevent duplicate likes/subscriptions, and users cannot subscribe to themselves.
- **Redis Caching:** A user's top 10 most-viewed videos are cached with a 2-minute TTL. Cache helpers fail safely, so the API keeps working even if Redis is down.
- **Data Integrity:** MongoDB transactions keep video uploads/deletions and the user's `videosCount` consistent, with Cloudinary rollback if an upload fails.
- **Security Hardening:** Helmet headers, CORS with credentials, and rate limiting (100 requests / 15 minutes per IP).
- **Consistent Error Handling:** Centralised error middleware with `ApiError` / `ApiResponse` helpers and an `asyncHandler` wrapper.

### Implemented (Frontend)

- Responsive app layout with Navbar (search bar, Create button, notifications), collapsible Sidebar, and mobile overlay sidebar
- Client-side routing with React Router (`/`, `/login`, `/signup`, `/upload-video`)
- **Login page:** username-or-email login, password validation, show/hide password, toast feedback — connected to the API
- **Sign Up page:** full registration form with avatar and cover image upload (multipart `FormData`), validation, toast feedback — connected to the API
- Preconfigured Axios instance (`withCredentials`, base URL from `VITE_API_URL`) so cookies are sent automatically
- Reusable `VideoCard` and `VideoCardSkeleton` components with a loading-skeleton state

### In Progress (Frontend)

- **Home page:** currently renders placeholder cards with a fake loading delay; not yet connected to `GET /videos/videoPage`
- **Video upload page:** form UI with validation (video file, title, description, thumbnail) is built; the submit handler and progress bar are not wired to the API yet
- **History** and **Profile** pages exist as stubs and are not added to the router yet

## 📁 Project Structure

```
youtube/
├── Youtube-Backend/
│   ├── public/temp/            # Temporary upload directory (Multer)
│   └── src/
│       ├── controllers/        # user, video, like, subscription logic
│       ├── db/                 # MongoDB connection
│       ├── middlewares/        # JWT auth (verifyJWT), Multer upload
│       ├── models/             # User, Video, Like, Subscription schemas
│       ├── redis/              # Redis client config
│       ├── routes/             # Express routers
│       ├── utils/              # ApiError, ApiResponse, asyncHandler, Cloudinary, Redis helpers
│       ├── constants.js        # DB name
│       ├── app.js              # Express app + middleware + routes
│       └── index.js            # Server entry point
└── youtube-Frontend/
    └── src/
        ├── api/                # Axios instance
        ├── assets/             # Logo, placeholder avatar and thumbnail
        ├── components/
        │   ├── common/         # VideoCard, VideoCardSkeleton, ApiLoader
        │   └── layout/         # Navbar, SideBar, OverlaySideBar, Layout
        ├── context/            # SideBar open/close state
        ├── pages/              # Home, Login, SignUp, VideoUpload, History, Profile
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
MONGODBURI=<your-mongodb-connection-string>   # without a database name, it is added automatically
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
```

Create a `.env` file inside `youtube-Frontend/`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

Other frontend scripts: `npm run build`, `npm run preview`, `npm run lint`.

> **Note:** Auth cookies are set with `httpOnly` and `secure` flags. Modern browsers allow secure cookies on `localhost`, but if you deploy over plain HTTP the cookies will not be stored.

## 📡 API Reference

Base URL: `/api/v1`  |  🔒 = requires authentication (JWT via cookie or `Authorization: Bearer <token>`)

### Users — `/users`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/register-user` | Register (multipart: `avatar` (required), `coverImage`, plus `username`, `email`, `password`, `fullName`) |
| POST | `/login` | Login with `email` or `username` + `password` |
| POST | `/refresh-access-token` | Get a new access token (uses the refresh token cookie or body) |
| POST | `/logout` 🔒 | Logout |
| GET | `/current-user` 🔒 | Get logged-in user |
| PATCH | `/update-user-details` 🔒 | Update `fullName`, `username`, or `email` |
| PATCH | `/change-password` 🔒 | Change password (`oldPassword`, `newPassword`) |
| PATCH | `/avatar` 🔒 | Update avatar (multipart: `avatar`) |
| PATCH | `/cover-image` 🔒 | Update cover image (multipart: `coverImage`) |
| GET | `/channel/:username` 🔒 | Channel details (subscribers, videos, `isSubscribed`) |
| GET | `/watch-history` 🔒 | Watch history |
| DELETE | `/delete-account` 🔒 | Delete account |

### Videos — `/videos`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/videoPage` | Paginated video feed (`page`, `limit`, `sortBy`, `sortType`) |
| GET | `/video/:id` 🔒 | Get a single video |
| POST | `/upload-video` 🔒 | Upload video (multipart: `video`, `thumbnail`, plus `title`, `description`) |
| DELETE | `/delete/:id` 🔒 | Delete a video |
| GET | `/top-videos/:id` 🔒 | A user's top 10 videos by views (Redis-cached, 2-minute TTL) |

### Likes — `/likes`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/toggle/v/:videoId` 🔒 | Like / unlike a video |

### Subscriptions — `/subscription`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/toggle/v/:id` 🔒 | Subscribe / unsubscribe to a channel (`:id` is the channel's user ID) |

### Response Format

All responses follow the same shape:

```json
{
  "statusCode": 200,
  "message": "Videos fetched successfully",
  "data": {},
  "success": true
}
```

## 🗺️ Roadmap

- [x] Backend REST API (auth, users, videos, likes, subscriptions)
- [x] Redis caching with safe fallbacks
- [x] App layout, sidebar, and routing
- [x] Login / Signup pages and API integration
- [ ] Connect Home page to the video feed API
- [ ] Wire up the video upload form (submit handler + upload progress)
- [ ] Auth state on the frontend (protected routes, current user in navbar, logout)
- [ ] Global state with Redux Toolkit (user session, video feed)
- [ ] Video watch page with player, like, and subscribe actions
- [ ] Channel, Profile, and Watch History pages
- [ ] Comments system
- [ ] View count tracking and watch-history updates on video watch
- [ ] Search and trending videos (with Redis caching)
- [ ] Backend hardening: ownership check on video delete, populate channel info in the video feed

## 🔐 Security Notes

- Never commit your `.env` files (backend and frontend). They are already listed in `.gitignore`.
- Never share a zip/archive of the project that includes your `.env` files. If one was shared, rotate the MongoDB, Cloudinary, and JWT secrets.
- Use strong, unique secrets for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.

## 👤 Author

**Hasnain Ahmad**

## 📄 License

ISC
