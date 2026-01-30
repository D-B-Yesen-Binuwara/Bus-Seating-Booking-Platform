import { useState, useEffect } from 'react';
import ScheduleFilter from '../../components/ScheduleFilter';

// Utility function to format date consistently as dd/mm/yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Utility function to normalize date to YYYY-MM-DD format
const normalizeDateForComparison = (dateString) => {
  if (!dateString) return '';
  // If it's already in YYYY-MM-DD format, return as-is
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  // Otherwise, parse and normalize
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [filters, setFilters] = useState({ selectedDates: [], selectedRoutes: [] });

  useEffect(() => {
    fetchBookings();
    fetchRoutes();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, filters]);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setBookings(Array.isArray(data) ? data : []);
  };

  const fetchRoutes = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/routes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setRoutes(Array.isArray(data) ? data : []);
  };

  const handleFilterChange = (filterData) => {
    setFilters(filterData);
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (filters.selectedDates.length > 0) {
      filtered = filtered.filter(b => {
        // Normalize the booking date to YYYY-MM-DD format for comparison
        const bookingDate = normalizeDateForComparison(b.schedule_date);
        return filters.selectedDates.includes(bookingDate);
      });
    }

    if (filters.selectedRoutes.length > 0) {
      filtered = filtered.filter(b => filters.selectedRoutes.includes(`${b.source} → ${b.destination}`));
    }

    setFilteredBookings(filtered);
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

        <div className="grid gap-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-lg">{booking.source} → {booking.destination}</p>
                  <p className="text-sm text-gray-600">Bus: {booking.bus_name}</p>
                  <p className="text-sm text-gray-600">Seats: {booking.seat_numbers}</p>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(booking.schedule_date)} at {booking.departure_time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">Rs. {booking.total_amount}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.booking_status}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">Booking-ID: {booking.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ml-6 w-64">
        <ScheduleFilter routes={routes} onFilterChange={handleFilterChange} title="Filter Bookings" />
      </div>
    </div>
  );
};

export default MyBookings;
