import { useState } from 'react';

export default function BusSeatLayoutDesigner({ bus, layoutOnly, onSave, onCancel }) {
  const [busNumber, setBusNumber] = useState(bus?.bus_number || '');
  const [busName, setBusName] = useState(bus?.bus_name || '');
  const [busIndex, setBusIndex] = useState(bus?.bus_index || '');
  const [busType, setBusType] = useState(bus?.bus_type || '');
  const [customType, setCustomType] = useState('');
  const [seatLayout, setSeatLayout] = useState(
    bus?.seat_layout ? JSON.parse(bus.seat_layout).reduce((acc, idx) => {
      acc[idx] = true;
      return acc;
    }, Array(70).fill(false)) : Array(70).fill(false)
  );

  const toggleSeat = (index) => {
    const newLayout = [...seatLayout];
    newLayout[index] = !newLayout[index];
    setSeatLayout(newLayout);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeSeatIndices = seatLayout.map((active, idx) => active ? idx : null).filter(idx => idx !== null);
    const finalBusType = busType === 'custom' ? customType : busType;
    
    onSave({
      bus_number: busNumber,
      bus_name: busName,
      bus_index: busIndex,
      bus_type: finalBusType,
      total_seats: activeSeatIndices.length,
      seat_layout: JSON.stringify(activeSeatIndices)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-3">
          {layoutOnly ? 'Edit Seat Layout' : bus ? 'Edit Bus' : 'Add New Bus'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          {!layoutOnly && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                placeholder="Bus Number"
                required
                className="px-3 py-1.5 border rounded-lg text-sm"
              />
              <input
                value={busName}
                onChange={(e) => setBusName(e.target.value)}
                placeholder="Bus Name"
                required
                className="px-3 py-1.5 border rounded-lg text-sm"
              />
              <input
                value={busIndex}
                onChange={(e) => setBusIndex(e.target.value)}
                placeholder="Bus Index (Optional)"
                className="px-3 py-1.5 border rounded-lg text-sm"
              />
              <select
                value={busType}
                onChange={(e) => setBusType(e.target.value)}
                required
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                <option value="">Select Bus Type</option>
                <option value="A/C">A/C</option>
                <option value="Non A/C">Non A/C</option>
                <option value="custom">+ Custom Type</option>
              </select>
              {busType === 'custom' && (
                <input
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="Enter Custom Bus Type"
                  required
                  className="px-3 py-1.5 border rounded-lg col-span-2 text-sm"
                />
              )}
            </div>
          )}

          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-1">Click to toggle seats (Green = Active, Gray = Empty)</p>
            <p className="text-sm font-semibold">Total Seats: {seatLayout.filter(s => s).length}</p>
          </div>

          <div className="border-2 border-gray-300 rounded-lg p-3 bg-gray-50 mb-4">
            <div className="text-center mb-2 font-bold text-gray-700 bg-gray-200 py-1.5 rounded text-sm">DRIVER</div>
            
            <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
              {seatLayout.map((isActive, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleSeat(index)}
                  className={`h-9 w-11 rounded text-xs font-semibold transition ${
                    isActive 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  }`}
                >
                  {isActive ? index + 1 : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={seatLayout.filter(s => s).length === 0}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {layoutOnly ? 'Save Layout' : bus ? 'Update Bus' : 'Save Bus'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
