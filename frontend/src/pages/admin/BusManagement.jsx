import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import BusSeatLayoutDesigner from '../../components/BusSeatLayoutDesigner';

export default function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/buses', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setBuses(Array.isArray(data) ? data : []);
  };

  const handleAddBus = async (busData) => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/buses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(busData)
    });
    setShowAddModal(false);
    fetchBuses();
  };

  const handleUpdateBus = async (busData) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/buses/${editingBus.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(busData)
    });
    setEditingBus(null);
    fetchBuses();
  };

  const handleDeleteBus = async (id) => {
    if (!confirm('Are you sure you want to delete this bus?')) return;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/buses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchBuses();
  };

  const handleEditLayout = (bus) => {
    setSelectedBus(bus);
    setShowLayoutModal(true);
  };

  const handleSaveLayout = async (layoutData) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/buses/${selectedBus.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...selectedBus,
        seat_layout: layoutData.seat_layout,
        total_seats: layoutData.total_seats
      })
    });
    setShowLayoutModal(false);
    setSelectedBus(null);
    fetchBuses();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bus Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Bus
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Index</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Seats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {buses.map((bus) => (
              <tr key={bus.id}>
                <td className="px-6 py-4 whitespace-nowrap">{bus.bus_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.bus_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.bus_index || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.bus_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditLayout(bus)}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {bus.total_seats} seats
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setEditingBus(bus)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBus(bus.id)}
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

      {showAddModal && (
        <BusSeatLayoutDesigner
          onSave={handleAddBus}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {editingBus && (
        <BusSeatLayoutDesigner
          bus={editingBus}
          onSave={handleUpdateBus}
          onCancel={() => setEditingBus(null)}
        />
      )}

      {showLayoutModal && selectedBus && (
        <BusSeatLayoutDesigner
          bus={selectedBus}
          layoutOnly={true}
          onSave={handleSaveLayout}
          onCancel={() => {
            setShowLayoutModal(false);
            setSelectedBus(null);
          }}
        />
      )}
    </div>
  );
}
