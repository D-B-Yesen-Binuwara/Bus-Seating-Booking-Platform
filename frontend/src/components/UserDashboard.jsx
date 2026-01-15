import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bus, LogOut, Calendar, MapPin } from 'lucide-react';
import SeatLayout from './SeatLayout';

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchSchedules();
    fetchBookings();
  }, []);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/schedules', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const handleBooking = async (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedSeats([]);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    const totalAmount = selectedSchedule.price * selectedSeats.length;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          schedule_id: selectedSchedule.id,
          seat_numbers: selectedSeats,
          total_amount: totalAmount
        })
      });

      if (response.ok) {
        alert('Booking successful!');
        setShowBookingModal(false);
        fetchSchedules();
        fetchBookings();
      } else {
        const data = await response.json();
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      alert('Error creating booking');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Bus Booking</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={signOut}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Schedules</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid gap-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-lg font-semibold">{schedule.source} → {schedule.destination}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(schedule.schedule_date).toLocaleDateString()} at {schedule.departure_time}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Bus: {schedule.bus_name} ({schedule.bus_number})
                      </p>
                      <p className="text-sm text-gray-500">
                        Available Seats: {schedule.available_seats}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{schedule.price}</p>
                      <button
                        onClick={() => handleBooking(schedule)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Bookings</h2>
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{booking.source} → {booking.destination}</p>
                    <p className="text-sm text-gray-600">Bus: {booking.bus_name}</p>
                    <p className="text-sm text-gray-600">Seats: {booking.seat_numbers}</p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(booking.schedule_date).toLocaleDateString()} at {booking.departure_time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">₹{booking.total_amount}</p>
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

        {showBookingModal && selectedSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Select Seats</h3>
              <div className="mb-4">
                <p className="text-lg">{selectedSchedule.source} → {selectedSchedule.destination}</p>
                <p className="text-gray-600">{selectedSchedule.bus_name}</p>
                <p className="text-gray-600">Price per seat: ₹{selectedSchedule.price}</p>
              </div>
              
              <SeatLayout
                seatLayout={JSON.parse(selectedSchedule.seat_layout || '[]')}
                bookedSeats={JSON.parse(selectedSchedule.booked_seats || '[]')}
                selectedSeats={selectedSeats}
                onSeatSelect={setSelectedSeats}
              />
              
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">Selected Seats: {selectedSeats.join(', ') || 'None'}</p>
                  <p className="text-xl font-bold text-blue-600">
                    Total: ₹{selectedSchedule.price * selectedSeats.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={confirmBooking}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
