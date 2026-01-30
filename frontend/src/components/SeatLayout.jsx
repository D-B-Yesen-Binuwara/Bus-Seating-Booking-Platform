export default function SeatLayout({ seatLayout, bookedSeats, onSeatSelect, selectedSeats, selectedSchedule }) {
  const toggleSeat = (seatIndex) => {
    // Convert index to display number (1-based)
    const displayNumber = seatIndex + 1;
    const displayNumberStr = displayNumber.toString();
    
    if (bookedSeats.includes(displayNumberStr)) return;
    
    if (selectedSeats.includes(displayNumber)) {
      onSeatSelect(selectedSeats.filter(s => s !== displayNumber));
    } else {
      onSeatSelect([...selectedSeats, displayNumber]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="mb-3 flex gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-red-500 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-orange-500 rounded"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-lg p-3 bg-gray-50">
        <div className="text-center mb-2 font-bold text-gray-700 bg-gray-200 py-1.5 rounded text-sm">DRIVER</div>
        
        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
          {Array.from({ length: 70 }).map((_, index) => {
            const isSeatActive = seatLayout.includes(index);
            const displayNumber = index + 1;
            const displayNumberStr = displayNumber.toString();
            const isBooked = bookedSeats.includes(displayNumberStr);
            const reservedSeatsData = JSON.parse(selectedSchedule.reserved_seats || '[]');
            const isReserved = reservedSeatsData.includes(displayNumber);
            const isSelected = selectedSeats.includes(displayNumber);
            
            if (!isSeatActive) {
              return <div key={index} className="h-9 w-11"></div>;
            }
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => toggleSeat(index)}
                disabled={isBooked || isReserved}
                className={`h-9 w-11 rounded text-xs font-semibold transition ${
                  isBooked ? 'bg-red-500 text-white cursor-not-allowed' :
                  isReserved ? 'bg-orange-500 text-white cursor-not-allowed' :
                  isSelected ? 'bg-blue-500 text-white' :
                  'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {displayNumber}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
