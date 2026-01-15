import { useState, useEffect } from 'react';

export default function BookingManagement() {
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

  const handleCancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchBookings();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Booking Management</h2>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">#{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>{booking.user_name}</div>
                  <div className="text-xs text-gray-500">{booking.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.bus_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.source} → {booking.destination}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.seat_numbers}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{booking.total_amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.booking_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.booking_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.booking_status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
