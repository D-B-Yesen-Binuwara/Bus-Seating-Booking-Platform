import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import SeatLayout from '../../components/SeatLayout';

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchRoutes();
    fetchSchedules();
  }, []);

  const fetchRoutes = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/routes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setRoutes(Array.isArray(data) ? data : []);
  };

  const fetchSchedules = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/schedules', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setSchedules(Array.isArray(data) ? data : []);
  };

  const getSchedulesForRoute = (routeId) => {
    return schedules.filter(s => s.route_id === routeId);
  };

  const handleBooking = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedSeats([]);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
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
        toast.success('Booking successful!');
        setShowBookingModal(false);
        fetchSchedules();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Booking failed');
      }
    } catch (error) {
      toast.error('Error creating booking');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Routes</h2>

      <div className="space-y-4">
        {routes.map((route) => {
          const routeSchedules = getSchedulesForRoute(route.id);
          const isExpanded = expandedRoute === route.id;

          return (
            <div key={route.id} className="bg-white rounded-lg shadow">
              <button
                onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="text-left">
                  <h3 className="text-lg font-semibold">{route.source} → {route.destination}</h3>
                  <p className="text-sm text-gray-600">{route.distance} km • {route.duration} min</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{routeSchedules.length} schedules</span>
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-6 py-4">
                  {routeSchedules.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No schedules posted</p>
                  ) : (
                    <div className="space-y-3">
                      {routeSchedules.map((schedule) => (
                        <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{new Date(schedule.schedule_date).toLocaleDateString()}</span>
                              <span className="text-gray-600">at {schedule.departure_time}</span>
                            </div>
                            <p className="text-sm text-gray-600">{schedule.bus_name} • {schedule.available_seats} seats available</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-blue-600">Rs. {schedule.price}</p>
                            {schedule.available_seats > 0 ? (
                              <button
                                onClick={() => handleBooking(schedule)}
                                className="mt-1 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                Book
                              </button>
                            ) : (
                              <button
                                disabled
                                className="mt-1 px-4 py-1 bg-gray-400 text-white text-sm rounded cursor-not-allowed"
                              >
                                All Booked
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showBookingModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Select Seats</h3>
            <div className="mb-4">
              <p className="text-lg">{selectedSchedule.source} → {selectedSchedule.destination}</p>
              <p className="text-gray-600">{selectedSchedule.bus_name} • {new Date(selectedSchedule.schedule_date).toLocaleDateString()} at {selectedSchedule.departure_time}</p>
              <p className="text-gray-600">Price per seat: Rs. {selectedSchedule.price}</p>
            </div>
            
            <SeatLayout
              seatLayout={JSON.parse(selectedSchedule.seat_layout || '[]')}
              bookedSeats={JSON.parse(selectedSchedule.booked_seats || '[]')}
              selectedSeats={selectedSeats}
              onSeatSelect={setSelectedSeats}
              selectedSchedule={selectedSchedule}
            />
            
            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">Selected Seats: {selectedSeats.map(s => s + 1).join(', ') || 'None'}</p>
                <p className="text-xl font-bold text-blue-600">
                  Total: Rs. {selectedSchedule.price * selectedSeats.length}
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
