# Bus Seat Booking Application

This project is a full-stack bus seat booking application featuring a React frontend, a Node.js and Express.js backend, and a MySQL database. It provides a platform for users to browse bus schedules, select seats, and book tickets. Staff members can manage buses, routes, and schedules through a dedicated admin dashboard. The application includes real-time seat availability, secure JWT-based authentication, and role-based access control.

## Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Key Features Implemented

### User Features:
- Registration and login
- View available bus schedules
- Book seats with seat selection
- View booking history
- Real-time seat availability

### Staff Features:
- Add and manage buses
- Create routes
- Schedule buses on routes
- Set pricing
- View all bookings

## Project Structure

### Backend
```
backend/
├── config/
│   └── db.js                 # MySQL connection pool
├── controllers/
│   └── authController.js     # Authentication logic
├── middleware/
│   └── auth.js               # JWT verification & role check
├── routes/
│   ├── auth.js               # Auth routes
│   ├── buses.js              # Bus management
│   ├── routes.js             # Route management
│   ├── schedules.js          # Schedule management
│   └── bookings.js           # Booking management
├── .env                      # Environment variables
├── package.json
├── schema.sql                # Database schema
└── server.js                 # Express server
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── UserDashboard.jsx
│   │   └── StaffDashboard.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## API Endpoints

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

### Buses
- GET `/api/buses`
- POST `/api/buses` (Staff only)

### Routes
- GET `/api/routes`
- POST `/api/routes` (Staff only)

### Schedules
- GET `/api/schedules`
- POST `/api/schedules` (Staff only)

### Bookings
- GET `/api/bookings` (user's bookings)
- POST `/api/bookings`

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- SQL injection prevention with parameterized queries
- CORS enabled for frontend-backend communication

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` file with MySQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bus_booking
JWT_SECRET=your_jwt_secret_key_here
```
4. Run `mysql -u root -p < schema.sql` to create database
5. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
