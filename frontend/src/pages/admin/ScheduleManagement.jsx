import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
    alert(result.message);
    setShowModal(false);
    fetchSchedules();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this schedule?')) return;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/schedules/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchSchedules();
  };

  return (
    <div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.bus_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.source} → {schedule.destination}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(schedule.schedule_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.departure_time}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{schedule.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.available_seats}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
}
