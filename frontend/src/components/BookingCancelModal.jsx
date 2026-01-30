import { useState } from 'react';
import { toast } from 'react-hot-toast';

const BookingCancelModal = ({ isOpen, booking, onConfirm, onCancel }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  if (!isOpen || !booking) return null;

  const seatNumbers = booking.seat_numbers.split(',').map(s => s.trim());

  const handleSeatToggle = (seat) => {
    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

  const handleDeleteBooking = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${booking.id}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Booking cancelled successfully');
        onConfirm('delete');
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (error) {
      toast.error('Error cancelling booking');
    }
  };

  const handleCancelSeats = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to cancel');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${booking.id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ seats_to_cancel: selectedSeats })
      });
      if (response.ok) {
        toast.success('Selected seats cancelled successfully');
        onConfirm('partial', selectedSeats);
      } else {
        toast.error('Failed to cancel selected seats');
      }
    } catch (error) {
      toast.error('Error cancelling selected seats');
    }
  };

  const handleKeepBooking = () => {
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Cancel Booking</h3>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Booking ID:</strong> #{booking.id}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Route:</strong> {booking.source} → {booking.destination}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Seats:</strong> {booking.seat_numbers}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Amount:</strong> Rs. {booking.total_amount}
          </p>
        </div>

        {seatNumbers.length > 1 && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">Select seats to cancel (optional):</p>
            <div className="grid grid-cols-4 gap-2">
              {seatNumbers.map(seat => (
                <button
                  key={seat}
                  onClick={() => handleSeatToggle(seat)}
                  className={`px-3 py-2 text-sm border rounded ${
                    selectedSeats.includes(seat)
                      ? 'bg-red-100 border-red-300 text-red-700'
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {seat}
                </button>
              ))}
            </div>
            {selectedSeats.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {selectedSeats.join(', ')}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleKeepBooking}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Keep Booking
          </button>
          {selectedSeats.length > 0 && (
            <button
              onClick={handleCancelSeats}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Cancel Selected Seats
            </button>
          )}
          <button
            onClick={handleDeleteBooking}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Entire Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCancelModal;