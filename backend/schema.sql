CREATE DATABASE IF NOT EXISTS bus_booking;
USE bus_booking;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  role ENUM('user', 'staff') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bus_number VARCHAR(50) UNIQUE NOT NULL,
  bus_name VARCHAR(100) NOT NULL,
  bus_index VARCHAR(50),
  total_seats INT NOT NULL,
  bus_type VARCHAR(50),
  seat_layout TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  source VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  distance INT,
  duration INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bus_id INT NOT NULL,
  route_id INT NOT NULL,
  departure_time TIME NOT NULL,
  schedule_date DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available_seats INT NOT NULL,
  booked_seats TEXT,
  status ENUM('active', 'cancelled', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_id) REFERENCES buses(id),
  FOREIGN KEY (route_id) REFERENCES routes(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  schedule_id INT NOT NULL,
  seat_numbers VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  booking_status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);





