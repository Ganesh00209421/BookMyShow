# 🎬 BookMyShow — Book A Movie Ticket (Fullstack)

A simplified, fullstack clone of the BookMyShow movie ticket booking flow — built as a three-tier application with a React frontend, an Express.js REST API backend, and a MongoDB database.

Users can pick a movie, pick a time slot, choose seat counts across six seat types, and book a ticket — with the last booking always visible, and in-progress selections persisted across page reloads.

---

## ✨ Features

- Browse a hardcoded list of movies, time slots, and seat types
- Select a movie and time slot with visual highlighting
- Enter seat counts for 6 seat types: `A1`, `A2`, `A3`, `A4`, `D1`, `D2`
- Book a ticket with a single API call (no redundant requests)
- View the most recent booking at all times ("Last Booking Details")
- In-progress selections persist across page reloads via `localStorage`
- Responsive, cinema-ticket-themed UI with hover animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 16, Webpack 4, Babel |
| Backend | Node.js, Express 4 |
| Database | MongoDB (Atlas), Mongoose |
| Styling | Custom CSS (dark cinema-ticket theme) |
| Config | dotenv (environment variables) |

---

## 📁 Project Structure

```
BookMyShow/
├── .gitignore
├── README.md
└── src/                      # Backend (Express server)
    ├── index.js               # Express app entry point + API routes
    ├── connector.js            # MongoDB connection (Mongoose)
    ├── schema.js               # Mongoose schema for bookings
    ├── .env                    # Environment variables (NOT committed)
    ├── .env.example             # Template for required env vars
    ├── package.json
    └── client/                 # Frontend (React app)
        ├── webpack.config.js
        ├── package.json
        └── src/
            ├── index.html
            ├── index.js         # React DOM entry point
            ├── components/
            │   ├── App.js       # Main application component
            │   └── data.js      # Hardcoded movies / slots / seat types
            └── styles/
                ├── App.css      # Application theme
                └── bootstrap.min.css
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18** (this project uses legacy tooling — Webpack 4 / OpenSSL 1 APIs — that breaks on Node 20+)
- A MongoDB connection string (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository
```bash
git clone https://github.com/Ganesh00209421/BookMyShow.git
cd BookMyShow
```

### 2. Backend setup
```bash
cd src
npm install
```

Create a `.env` file inside `src/` (see `.env.example`):
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/bookMovie?retryWrites=true&w=majority
```

Start the backend:
```bash
npm start
```
Runs on **http://localhost:8080**

### 3. Frontend setup (in a separate terminal)
```bash
cd src/client
npm install
npm start
```
Runs on **http://localhost:3000** — API calls are proxied to `localhost:8080` automatically via `webpack.config.js`.

> **Note:** On Node.js 17+, you may need to run the frontend with the legacy OpenSSL flag:
> ```bash
> NODE_OPTIONS=--openssl-legacy-provider npm start
> ```

---

## 📡 API Documentation

Base URL (local): `http://localhost:8080`

### 1. Create a Booking

| | |
|---|---|
| **Endpoint** | `/api/booking` |
| **Method** | `POST` |
| **Content-Type** | `application/json` |

**Request Body**
```json
{
  "movie": "Tenet",
  "slot": "01:00 PM",
  "seats": {
    "A1": 2,
    "A2": 0,
    "A3": 1,
    "A4": 0,
    "D1": 0,
    "D2": 0
  }
}
```

| Field | Type | Description |
|---|---|---|
| `movie` | `string` | Name of the selected movie |
| `slot` | `string` | Selected time slot (e.g. `"10:00 AM"`) |
| `seats` | `object` | Seat counts keyed by seat type (`A1`–`D2`), each a `number` |

**Success Response**
- **Status:** `200 OK`

---

### 2. Get Last Booking

| | |
|---|---|
| **Endpoint** | `/api/booking` |
| **Method** | `GET` |

**Success Response — booking exists**
- **Status:** `200 OK`
```json
{
  "movie": "Tenet",
  "slot": "01:00 PM",
  "seats": {
    "A1": 2,
    "A2": 0,
    "A3": 1,
    "A4": 0,
    "D1": 0,
    "D2": 0
  }
}
```

**Success Response — no bookings yet**
- **Status:** `200 OK`
```json
{
  "message": "no previous booking found"
}
```

> Any endpoint other than the two listed above is considered invalid, per the assignment spec.

---

## 🗄️ Database Schema

Collection: `bookmovietickets`

| Field | Type | Description |
|---|---|---|
| `movie` | `String` | Movie name |
| `slot` | `String` | Time slot |
| `seats.A1` | `Number` | Count of A1-type seats |
| `seats.A2` | `Number` | Count of A2-type seats |
| `seats.A3` | `Number` | Count of A3-type seats |
| `seats.A4` | `Number` | Count of A4-type seats |
| `seats.D1` | `Number` | Count of D1-type seats |
| `seats.D2` | `Number` | Count of D2-type seats |

---

## ✅ Testing

Manual test cases covering movie/slot/seat selection, booking validation, API responses, `localStorage` persistence, and responsive UI are documented separately in `BookMyShow-Manual-Test-Cases.md`.

---

## 🔒 Environment Variables & Security

The MongoDB connection string (including credentials) is stored in a local `.env` file which is excluded from version control via `.gitignore`. Use `.env.example` as a reference for the required variable.

---

## 📌 Notes

- Movie, slot, and seat-type data is intentionally hardcoded in `client/src/components/data.js` per the assignment scope.
- Only the most recent booking is retained/displayed; there is no full booking history view.
