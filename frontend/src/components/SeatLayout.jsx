export default function SeatLayout({ seatLayout, bookedSeats, onSeatSelect, selectedSeats }) {
  const toggleSeat = (seatIndex) => {
    const seatNum = seatIndex.toString();
    if (bookedSeats.includes(seatNum)) return;
    
    if (selectedSeats.includes(seatIndex)) {
      onSeatSelect(selectedSeats.filter(s => s !== seatIndex));
    } else {
      onSeatSelect([...selectedSeats, seatIndex]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="text-center mb-4 font-bold text-gray-700 bg-gray-200 py-2 rounded">DRIVER</div>
        
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 70 }).map((_, index) => {
            const isSeatActive = seatLayout.includes(index);
            const isBooked = bookedSeats.includes(index.toString());
            const isSelected = selectedSeats.includes(index);
            
            if (!isSeatActive) {
              return <div key={index} className="h-12"></div>;
            }
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => toggleSeat(index)}
                disabled={isBooked}
                className={`h-12 rounded font-semibold transition ${
                  isBooked ? 'bg-red-500 text-white cursor-not-allowed' :
                  isSelected ? 'bg-blue-500 text-white' :
                  'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
