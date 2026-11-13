# YouTube Clone (Full-Stack)

A YouTube-style video platform built with the MERN stack. The backend is a production-minded REST API (JWT auth, Cloudinary media storage, Redis caching, rate limiting, MongoDB transactions), and the frontend is a React 19 + Tailwind CSS 4 app that is under active development.

> **Project status:** Backend API is largely complete. On the frontend, the app shell (navbar, sidebar, layout, routing), **Login / Sign Up** (with automatic token refresh), the **Video Upload** page (two-step upload with live progress) and a basic **Profile** page are done and connected to the API. The Home feed, watch page, and watch-history page are still in progress. See the [Roadmap](#️-roadmap).

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
- **Two-Step Video Upload (Draft → Publish):**
  1. `POST /videos/upload-video` uploads only the video file to Cloudinary and creates a **draft** video document (stores `videoFile`, `duration`, `owner`).
  2. `PATCH /videos/video/:id` adds the `title`, `description` and `thumbnail` to that draft (only the owner can publish it) and increments the user's `videosCount` inside a transaction.
  - If publishing fails, the transaction is aborted and the draft video plus any uploaded thumbnail are cleaned up from Cloudinary/DB.
  - This allows the frontend to start uploading the large video file immediately, while the user is still filling in the title/description/thumbnail.
- **Video Management:** Delete videos (cleans up Cloudinary assets), fetch a single video, and fetch all videos of the **currently logged-in user** (with channel avatar and username, newest first).
- **Paginated Video Feed:** Aggregation-based feed with pagination and configurable sorting (`page`, `limit`, `sortBy`, `sortType`). Public endpoint (no login required).
- **Likes & Subscriptions:** Toggle like on a video and toggle subscribe on a channel. Both run inside transactions and keep the denormalized counters (`likes`, `subscribers`) in sync. Unique indexes prevent duplicate likes/subscriptions, and users cannot subscribe to themselves.
- **Redis Caching:** A user's top 10 most-viewed videos are cached with a 2-minute TTL. Cache helpers fail safely, so the API keeps working even if Redis is down.
- **Data Integrity:** MongoDB transactions keep video publishing/deletion and the user's `videosCount` consistent, with Cloudinary rollback if an upload fails.
- **Security Hardening:** Helmet headers, CORS with credentials, and rate limiting (100 requests / 15 minutes per IP).
- **Consistent Error Handling:** Centralised error middleware with `ApiError` / `ApiResponse` helpers and an `asyncHandler` wrapper.

### Implemented (Frontend)

- Responsive app layout with Navbar (search bar, Create button, notifications), collapsible Sidebar, and mobile overlay sidebar. The sidebar's **You** item links to the profile page.
- Client-side routing with React Router (`/`, `/login`, `/signup`, `/upload-video`, `/profile`)
- **Login page:** username-or-email login, password validation, show/hide password, toast feedback — connected to the API
- **Sign Up page:** full registration form with avatar and cover image upload (multipart `FormData`), validation, toast feedback — connected to the API
- **Video Upload page (connected to the API):**
  - The video starts uploading to the server as soon as it is selected, with a live **progress bar** (Axios `onUploadProgress`)
  - **Cancel** the in-flight upload (`AbortController`) and **delete** the uploaded draft with the trash button
  - **Video preview** and **thumbnail preview** modals before submitting
  - Form validation with React Hook Form (video type, title max 300 chars, thumbnail must be JPG/PNG/WEBP and under 5 MB)
  - The Submit button stays disabled until the video upload has finished; on submit the title, description and thumbnail are sent to publish the draft, and the user is redirected to Home
- **Profile page:** shows the logged-in user's cover image, avatar, full name, username and subscriber count, plus a grid of their uploaded videos (thumbnail, views, time since upload) with loading and empty states
- Preconfigured Axios instance (`withCredentials`, base URL from `VITE_API_URL`) so cookies are sent automatically
- **Automatic token refresh:** an Axios response interceptor catches a `401`, calls `/users/refresh-access-token` once (a shared promise prevents duplicate refresh calls when several requests fail together) and retries the original request
- **Route loaders:** `/login` redirects to Home if the user is already logged in, and `/profile` loads the current user and their videos in the loader and redirects to `/login` on a `401`
- Reusable `VideoCard` and `VideoCardSkeleton` components with a loading-skeleton state
- Utility helpers for formatting view counts (`1.2K views`) and relative time (`3 days ago`)

### In Progress (Frontend)

- **Home page:** currently renders placeholder cards with a fake loading delay (a 2 s delay in the route loader plus a `setTimeout` in the component); not yet connected to `GET /videos/videoPage`
- **History** page exists as a stub and is not added to the router yet
- **Auth state:** there is no global user state yet, so protected routes (e.g. `/upload-video` has no login guard), the current user in the navbar and logout are still to do. The sidebar's Shorts and Subscriptions items are placeholders without a route. The Profile page is currently outside the main `Layout` (no navbar/sidebar).

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
        ├── api/                # Axios instance + 401 auto-refresh interceptor
        ├── assets/             # Logo, placeholder avatar and thumbnail
        ├── components/
        │   ├── common/         # VideoCard, VideoCardSkeleton, VideoPreview, ThumbnailPreview, ApiLoader
        │   └── layout/         # Navbar, SideBar, OverlaySideBar, Layout
        ├── context/            # SideBar open/close state
        ├── pages/              # Home, Login, SignUp, VideoUpload, Profile, History
        ├── routes/             # Router config (with loaders for /login and /profile)
        ├── utils/              # DateViewFormat (formatViews, timeAgo)
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
| POST | `/upload-video` 🔒 | **Step 1:** upload the video file and create a draft (multipart: `Video`) |
| PATCH | `/video/:id` 🔒 | **Step 2:** publish the draft (multipart: `Thumbnail`, plus `title`, `description`) |
| GET | `/video/:id` 🔒 | Get a single video |
| GET | `/get-current-user-videos` 🔒 | All videos of the logged-in user (with channel `avatar` and `username`) |
| DELETE | `/delete/:id` 🔒 | Delete a video (also used to discard an unpublished draft) |
| GET | `/top-videos/:id` 🔒 | A user's top 10 videos by views (Redis-cached, 2-minute TTL) |

> **Note:** The multipart field names for video uploads are case-sensitive: `Video` and `Thumbnail` (capital first letter).

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
- [x] Two-step video upload (draft → publish) on the backend
- [x] Video upload page with progress bar, cancel, delete and previews
- [x] Basic Profile page (cover, avatar, channel info, own videos grid)
- [x] Automatic access-token refresh on the frontend (Axios interceptor)
- [ ] Connect Home page to the video feed API
- [ ] Auth state on the frontend (protected routes, current user in navbar, logout)
- [ ] Put the Profile page inside the main Layout (navbar + sidebar)
- [ ] Global state with Redux Toolkit (user session, video feed)
- [ ] Video watch page with player, like, and subscribe actions
- [ ] Channel (other users) and Watch History pages
- [ ] Comments system
- [ ] View count tracking and watch-history updates on video watch
- [ ] Search and trending videos (with Redis caching)

### 🐞 Known issues / backend hardening to-do

- [ ] **Ownership check on video delete:** `DELETE /videos/delete/:id` currently deletes by id only; it should also match `owner: req.user._id`.
- [ ] **`videosCount` drift:** deleting an unpublished draft still decrements `videosCount`, even though the count is only incremented when a video is published. Only decrement for published videos (e.g. when `title`/`thumbnail` exist).
- [ ] **Thumbnail cleanup on delete:** the check `deleteVideo?.thumbnail` in `deleteVideo` should be `deletedVideo?.thumbnail`, otherwise the thumbnail stays on Cloudinary.
- [ ] **Hide drafts from the public feed:** `GET /videos/videoPage` also returns unpublished drafts (no title/thumbnail). Filter on published videos only.
- [ ] **Orphaned drafts:** if the user closes the tab after step 1 and never publishes, the draft and its Cloudinary video stay. Add a cleanup job or expiry for old drafts.
- [ ] **Populate channel info in the video feed** (owner username/avatar) so the Home cards can show the channel.
- [ ] **Profile page:** the video grid shows `video.description` where the `title` should be shown.
- [ ] **Temp uploads:** add `public/temp/*` (except `.gitkeep`) to the backend `.gitignore` so leftover uploaded files are never committed. `public/temp/` currently still contains leftover avatar/cover files (~15 MB) from earlier uploads; delete them and make sure Multer's temp files are removed after the Cloudinary upload.
- [ ] **Home page:** remove the fake delay in the route loader and the `setTimeout` that runs on every render of `Home.jsx`; fetch the feed from the API instead.
- [ ] **Channel/avatar shape:** `GET /videos/get-current-user-videos` returns `avatar` and `channel` as arrays (they come from `$userField.*`); use `$arrayElemAt` or `$unwind` so they are plain strings.
- [ ] **Route guards:** `/upload-video` is reachable without being logged in; add a loader that redirects to `/login` on a `401`.
- [ ] **Cleanup:** the empty `src/app/` and `src/services/` folders in the frontend are unused.

## 🔐 Security Notes

- Never commit your `.env` files (backend and frontend). They are already listed in `.gitignore`.
- Never share a zip/archive of the project that includes your `.env` files. If one was shared, rotate the MongoDB, Cloudinary, and JWT secrets.
- Use strong, unique secrets for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.

## 👤 Author

**Hasnain Ahmad**

## 📄 License

ISC
