import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, routeId: null });

  useEffect(() => {
    fetchRoutes();
  }, []);

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
    
    const url = editingRoute 
      ? `http://localhost:5000/api/routes/${editingRoute.id}`
      : 'http://localhost:5000/api/routes';
    
    try {
      const response = await fetch(url, {
        method: editingRoute ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          source: formData.get('source'),
          destination: formData.get('destination'),
          distance: parseInt(formData.get('distance')),
          duration: parseInt(formData.get('duration'))
        })
      });
      if (response.ok) {
        toast.success(editingRoute ? 'Route updated successfully' : 'Route added successfully');
      } else {
        toast.error(editingRoute ? 'Failed to update route' : 'Failed to add route');
      }
    } catch (error) {
      toast.error('Error saving route');
    }
    
    setShowModal(false);
    setEditingRoute(null);
    fetchRoutes();
  };

  const handleDelete = async (id) => {
    setConfirmDialog({ isOpen: true, routeId: id });
  };

  const confirmDeleteRoute = async () => {
    const id = confirmDialog.routeId;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/routes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Route deleted successfully');
      } else {
        toast.error('Failed to delete route');
      }
    } catch (error) {
      toast.error('Error deleting route');
    }
    setConfirmDialog({ isOpen: false, routeId: null });
    fetchRoutes();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Route Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Route
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance (km)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration (min)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="px-6 py-4 whitespace-nowrap">{route.source}</td>
                <td className="px-6 py-4 whitespace-nowrap">{route.destination}</td>
                <td className="px-6 py-4 whitespace-nowrap">{route.distance}</td>
                <td className="px-6 py-4 whitespace-nowrap">{route.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setEditingRoute(route);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(route.id)}
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
            <h3 className="text-xl font-bold mb-4">{editingRoute ? 'Edit Route' : 'Add New Route'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="source" defaultValue={editingRoute?.source} placeholder="Source" required className="w-full px-4 py-2 border rounded-lg" />
              <input name="destination" defaultValue={editingRoute?.destination} placeholder="Destination" required className="w-full px-4 py-2 border rounded-lg" />
              <input name="distance" type="number" defaultValue={editingRoute?.distance} placeholder="Distance (km)" required className="w-full px-4 py-2 border rounded-lg" />
              <input name="duration" type="number" defaultValue={editingRoute?.duration} placeholder="Duration (minutes)" required className="w-full px-4 py-2 border rounded-lg" />
              <div className="flex space-x-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  {editingRoute ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setEditingRoute(null); }} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Route"
        message="Are you sure you want to delete this route? This action cannot be undone."
        onConfirm={confirmDeleteRoute}
        onCancel={() => setConfirmDialog({ isOpen: false, routeId: null })}
        confirmText="Delete Route"
        cancelText="Keep Route"
        isDangerous={true}
      />
    </div>
  );
}
