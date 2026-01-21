import { useState, useEffect } from 'react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setBookings(Array.isArray(data) ? data : []);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-lg">{booking.source} → {booking.destination}</p>
                <p className="text-sm text-gray-600">Bus: {booking.bus_name}</p>
                <p className="text-sm text-gray-600">Seats: {booking.seat_numbers}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(booking.schedule_date).toLocaleDateString()} at {booking.departure_time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">Rs. {booking.total_amount}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.booking_status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
