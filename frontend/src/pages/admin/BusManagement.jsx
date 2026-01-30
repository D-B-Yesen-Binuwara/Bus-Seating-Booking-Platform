import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import BusSeatLayoutDesigner from '../../components/BusSeatLayoutDesigner';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, busId: null });

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
    try {
      const response = await fetch('http://localhost:5000/api/buses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(busData)
      });
      if (response.ok) {
        toast.success('Bus added successfully');
      } else {
        toast.error('Failed to add bus');
      }
    } catch (error) {
      toast.error('Error adding bus');
    }
    setShowAddModal(false);
    fetchBuses();
  };

  const handleUpdateBus = async (busData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/buses/${editingBus.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(busData)
      });
      if (response.ok) {
        toast.success('Bus updated successfully');
      } else {
        toast.error('Failed to update bus');
      }
    } catch (error) {
      toast.error('Error updating bus');
    }
    setEditingBus(null);
    fetchBuses();
  };

  const handleDeleteBus = async (id) => {
    setConfirmDialog({ isOpen: true, busId: id });
  };

  const confirmDeleteBus = async () => {
    const id = confirmDialog.busId;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/buses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Bus deleted successfully');
      } else {
        toast.error('Failed to delete bus');
      }
    } catch (error) {
      toast.error('Error deleting bus');
    }
    setConfirmDialog({ isOpen: false, busId: null });
    fetchBuses();
  };

  const handleEditLayout = (bus) => {
    setSelectedBus(bus);
    setShowLayoutModal(true);
  };

  const handleSaveLayout = async (layoutData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/buses/${selectedBus.id}`, {
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
      if (response.ok) {
        toast.success('Seat layout saved successfully');
      } else {
        toast.error('Failed to save seat layout');
      }
    } catch (error) {
      toast.error('Error saving seat layout');
    }
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Driver</th>
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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Bus"
        message="Are you sure you want to delete this bus? This action cannot be undone."
        onConfirm={confirmDeleteBus}
        onCancel={() => setConfirmDialog({ isOpen: false, busId: null })}
        confirmText="Delete Bus"
        cancelText="Keep Bus"
        isDangerous={true}
      />
    </div>
  );
}
