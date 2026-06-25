# 🚌 Ghurni - Online Ticket Booking Platform

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-4-green?style=for-the-badge&logo=mongodb)
![Better Auth](https://img.shields.io/badge/BetterAuth-1.x-purple?style=for-the-badge&logo=auth0)

A full-stack Bengali travel ticket booking platform for bus, train, launch, and plane tickets across Bangladesh. Built with the modern MERN stack (MongoDB, Express, React, Next.js) with a focus on performance, real-time data, and a seamless user experience.

## 🌐 Live Demo

[https://ghurni-083.vercel.app](https://ghurni-083.vercel.app)

---

## ✨ Key Features

### 🎫 For All Users
- **Browse & Book Tickets**: Search, filter, and book tickets across multiple transport types.
- **Search & Filter**: Search by `From` → `To` location, filter by Transport Type (Bus, Train, Launch, Plane).
- **Sort & Pagination**: Sort by Price (Low to High / High to Low) and view tickets with server-side pagination.
- **Secure Payments**: Integrated Stripe payment gateway.
- **Dark/Light Mode**: Fully functional theme toggle persisted in local storage.

### 👥 Role-Based Dashboards
- **User (Traveler)**:
  - View personal profile.
  - Track booked tickets with live countdown timers (based on departure time).
  - View transaction history.
  - PDF ticket download (optional requirement).
- **Vendor**:
  - Add, update, and delete tickets (with Image upload via imgbb).
  - Manage incoming booking requests (Accept / Reject).
  - View Revenue Overview with interactive charts (Recharts).
- **Admin**:
  - Approve / Reject vendor tickets.
  - Manage users (Promote to Admin/Vendor, Mark Fraud).
  - Advertise tickets on the homepage (Limit: 6 max).

### 🛡️ Security & Performance
- **BetterAuth**: Robust authentication with Email/Password and Google OAuth.
- **MongoDB Session-based Protection**: API endpoints are securely protected by verifying a session token stored directly in the database, using built-in BetterAuth middleware.
- **Vercel Deploy**: Frontend optimized for production on Vercel.

---

## 🛠️ Tech Stack

### Frontend
| Package | Purpose |
| :--- | :--- |
| **Next.js 16** | React framework (App Router) |
| **React 19** | UI library |
| **Tailwind CSS** | Styling & responsiveness |
| **HeroUI** | Modern component library |
| **Better Auth** | Authentication & session management |
| **Framer Motion** | Premium page and element animations |
| **Recharts** | Vendor revenue charts & analytics |
| **Stripe.js** | Client-side payment processing |
| **Lucide & React Icons** | Comprehensive icon set |

### Backend
| Package | Purpose |
| :--- | :--- |
| **Express.js** | Node.js server framework |
| **MongoDB (Native Driver)** | Database for tickets, users, bookings |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |
| **Stripe** | Server-side payment intent processing |

---

## 🌐 Server Side Repository

[https://github.com/ORNOB-083/Ghurni-Server](https://github.com/ORNOB-083/Ghurni-Server)


---
