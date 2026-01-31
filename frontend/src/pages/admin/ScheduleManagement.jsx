import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit } from 'lucide-react';
import ScheduleFilter from '../../components/ScheduleFilter';
import ConfirmDialog from '../../components/ConfirmDialog';
import useFilteredData from '../../hooks/useFilteredData';

// Utility function to format date consistently as dd/mm/yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [reserveMode, setReserveMode] = useState(false);
  const [filters, setFilters] = useState({ selectedDates: [], selectedRoutes: [] });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, scheduleId: null });

  const handleFilterChange = (filterData) => {
    setFilters(filterData);
  };

  // Filter schedules using unified hook
  const filteredSchedules = useFilteredData(schedules, filters, {
    routeField: (schedule) => `${schedule.source} → ${schedule.destination}`
  });

  useEffect(() => {
    fetchSchedules();
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchSchedules = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/schedules', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setSchedules(Array.isArray(data) ? data : []);
  };

  const fetchBuses = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/buses', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setBuses(Array.isArray(data) ? data : []);
  };

  const fetchRoutes = async () => {
    // Fetch routes logic
    fetchBuses(); // Call fetchBuses to ensure buses are loaded
    fetchSchedules(); // Call fetchSchedules to ensure schedules are loaded
    // ...existing code...
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/routes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setRoutes(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bus_id: parseInt(formData.get('bus_id')),
        route_id: parseInt(formData.get('route_id')),
        departure_time: formData.get('departure_time'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        price: parseFloat(formData.get('price'))
      })
    });
    
    const result = await response.json();
    toast.success(result.message || 'Operation completed');
    setShowModal(false);
    fetchSchedules();
  };

  const handleEdit = (id) => {
    toast('Edit functionality to be implemented');
  };

  const handleViewSeats = (schedule) => {
    setSelectedSchedule(schedule);
    setReservedSeats(JSON.parse(schedule.reserved_seats || '[]'));
    setReserveMode(false);
    setShowSeatModal(true);
  };

  const toggleSeatReservation = (seatIndex) => {
    if (!reserveMode) return;
    setReservedSeats(prev => 
      prev.includes(seatIndex) 
        ? prev.filter(s => s !== seatIndex)
        : [...prev, seatIndex]
    );
  };

  const saveReservations = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/schedules/${selectedSchedule.id}/reserve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reserved_seats: reservedSeats })
    });
    if (response.ok) {
      toast.success('Reservations saved successfully');
      setShowSeatModal(false);
      fetchSchedules();
    }
  };

  const handleDelete = async (id) => {
    setConfirmDialog({ isOpen: true, scheduleId: id });
  };

  const confirmDeleteSchedule = async () => {
    const id = confirmDialog.scheduleId;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/schedules/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Schedule deleted successfully');
      } else {
        toast.error('Failed to delete schedule');
      }
    } catch (error) {
      toast.error('Error deleting schedule');
    }
    setConfirmDialog({ isOpen: false, scheduleId: null });
    fetchSchedules();
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Schedule Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Driver</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Available</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{schedule.bus_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{schedule.bus_number}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{schedule.source} → {schedule.destination}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">{formatDate(schedule.schedule_date)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">{schedule.departure_time}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">Rs. {schedule.price}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => handleViewSeats(schedule)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {schedule.available_seats}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(schedule.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ml-6 w-64">
        <ScheduleFilter routes={routes} onFilterChange={handleFilterChange} title="Filter Schedules" />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create Schedule</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select name="bus_id" required className="w-full px-4 py-2 border rounded-lg">
                <option value="">Select Bus</option>
                {buses.map(bus => <option key={bus.id} value={bus.id}>{bus.bus_name} ({bus.bus_number})</option>)}
              </select>
              <select name="route_id" required className="w-full px-4 py-2 border rounded-lg">
                <option value="">Select Route</option>
                {routes.map(route => <option key={route.id} value={route.id}>{route.source} → {route.destination}</option>)}
              </select>
              <input name="departure_time" type="time" required className="w-full px-4 py-2 border rounded-lg" placeholder="Departure Time" />
              <div className="grid grid-cols-2 gap-2">
                <input name="start_date" type="date" required className="w-full px-4 py-2 border rounded-lg" />
                <input name="end_date" type="date" required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <input name="price" type="number" step="0.01" placeholder="Price" required className="w-full px-4 py-2 border rounded-lg" />
              <div className="flex space-x-2">
                <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">Create</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSeatModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-3">Seat Management - {selectedSchedule.bus_name}</h3>
            <p className="text-sm text-gray-600 mb-3">{selectedSchedule.source} → {selectedSchedule.destination} | {formatDate(selectedSchedule.schedule_date)}</p>
            
            <div className="mb-3">
              <div className="flex gap-4 text-xs mb-2">
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
              </div>
              <button
                onClick={() => setReserveMode(!reserveMode)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  reserveMode ? 'bg-red-600 text-white' : 'bg-blue-400 text-white'
                }`}
              >
                {reserveMode ? 'Stop Reserving' : 'Reserve Seats'}
              </button>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-3 bg-gray-50 mb-4">
              <div className="text-center mb-2 font-bold text-gray-700 bg-gray-200 py-1.5 rounded text-sm">DRIVER</div>
              
              <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
                {Array.from({ length: 70 }).map((_, index) => {
                  const seatLayout = JSON.parse(selectedSchedule.seat_layout || '[]');
                  const bookedSeats = JSON.parse(selectedSchedule.booked_seats || '[]');
                  const reservedSeatsData = JSON.parse(selectedSchedule.reserved_seats || '[]');
                  const isSeatActive = seatLayout.includes(index);
                  const displayNumber = index + 1;
                  const displayNumberStr = displayNumber.toString();
                  const isBooked = bookedSeats.includes(displayNumberStr);
                  const isReserved = reservedSeats.includes(displayNumber);
                  
                  if (!isSeatActive) {
                    return <div key={index} className="h-9 w-11"></div>;
                  }
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleSeatReservation(index)}
                      disabled={isBooked}
                      className={`h-9 w-11 rounded text-xs font-semibold transition ${
                        isBooked ? 'bg-red-500 text-white cursor-not-allowed' :
                        isReserved ? 'bg-orange-500 text-white' :
                        'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {displayNumber}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveReservations}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                Save Reservations
              </button>
              <button
                onClick={() => setShowSeatModal(false)}
                className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule? This action cannot be undone."
        onConfirm={confirmDeleteSchedule}
        onCancel={() => setConfirmDialog({ isOpen: false, scheduleId: null })}
        confirmText="Delete Schedule"
        cancelText="Keep Schedule"
        isDangerous={true}
      />
    </div>
  );
}
