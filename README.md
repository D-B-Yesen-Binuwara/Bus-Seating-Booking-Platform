# Bus Seat Booking Application

A MERN stack application for bus seat booking with MySQL database.

## Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MySQL

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bus_booking
JWT_SECRET=your_jwt_secret_key_here
```

4. Create MySQL database and run schema:
```bash
mysql -u root -p < schema.sql
```

**If you already have an existing database, run the migration:**
```bash
mysql -u root -p < migration.sql
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Features

### User Features
- User registration and login
- View available bus schedules
- Book bus seats
- View booking history

### Staff Features
- Add and manage buses
- Add and manage routes
- Create bus schedules
- View all bookings

## Default Credentials

**Staff Login:**
- Email: admin@busbook.com
- Password: admin123

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Buses
- GET `/api/buses` - Get all buses
- POST `/api/buses` - Add new bus (Staff only)

### Routes
- GET `/api/routes` - Get all routes
- POST `/api/routes` - Add new route (Staff only)

### Schedules
- GET `/api/schedules` - Get all schedules
- POST `/api/schedules` - Add new schedule (Staff only)

### Bookings
- GET `/api/bookings` - Get user bookings
- POST `/api/bookings` - Create new booking
