import { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import SeatLayout from '../../components/SeatLayout';

export default function AllSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/schedules', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setSchedules(Array.isArray(data) ? data : []);
  };

  const handleBooking = (schedule) => {
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
      } else {
        const data = await response.json();
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      alert('Error creating booking');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Schedules</h2>

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

      {showBookingModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Select Seats</h3>
            <div className="mb-4">
              <p className="text-lg">{selectedSchedule.source} → {selectedSchedule.destination}</p>
              <p className="text-gray-600">{selectedSchedule.bus_name} • {new Date(selectedSchedule.schedule_date).toLocaleDateString()} at {selectedSchedule.departure_time}</p>
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
                <p className="font-semibold">Selected Seats: {selectedSeats.map(s => s + 1).join(', ') || 'None'}</p>
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
  );
}
