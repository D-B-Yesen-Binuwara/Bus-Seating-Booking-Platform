import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import ScheduleFilter from '../../components/ScheduleFilter';
import BookingCancelModal from '../../components/BookingCancelModal';

// Utility function to format date consistently as dd/mm/yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Utility function to normalize date to YYYY-MM-DD format
const normalizeDateForComparison = (dateString) => {
  if (!dateString) return '';
  // If it's already in YYYY-MM-DD format, return as-is
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  // Otherwise, parse and normalize
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState([]);
  const [filters, setFilters] = useState({ selectedDates: [], selectedRoutes: [] });
  const [statusFilter, setStatusFilter] = useState('');
  const [bookingCancelModal, setBookingCancelModal] = useState({ isOpen: false, booking: null });

  useEffect(() => {
    fetchBookings();
    fetchRoutes();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, filters, statusFilter]);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setBookings(Array.isArray(data) ? data : []);
  };

  const fetchRoutes = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/routes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setRoutes(Array.isArray(data) ? data : []);
  };

  const handleFilterChange = (filterData) => {
    setFilters(filterData);
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.selectedDates.length > 0) {
      filtered = filtered.filter(b => {
        // Normalize the booking date to YYYY-MM-DD format for comparison
        const bookingDate = normalizeDateForComparison(b.schedule_date);
        return filters.selectedDates.includes(bookingDate);
      });
    }

    if (filters.selectedRoutes.length > 0) {
      filtered = filtered.filter(b => filters.selectedRoutes.includes(`${b.source} → ${b.destination}`));
    }

    if (statusFilter) {
      filtered = filtered.filter(b => b.booking_status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = (booking) => {
    setBookingCancelModal({ isOpen: true, booking });
  };

  const handleBookingCancelConfirm = (action, selectedSeats) => {
    setBookingCancelModal({ isOpen: false, booking: null });
    fetchBookings(); // Refresh the bookings list
  };

  const handleBookingCancelCancel = () => {
    setBookingCancelModal({ isOpen: false, booking: null });
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg w-80 pr-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus No.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">#{booking.id}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm">{booking.user_name}</div>
                    <div className="text-xs text-gray-500">{booking.email}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">{booking.bus_number}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">{booking.source} → {booking.destination}</td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm">{formatDate(booking.schedule_date)}</td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm">{booking.seat_numbers}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">Rs. {booking.total_amount}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.booking_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.booking_status}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {booking.booking_status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Cancel
                      </button>
                    )}
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

      <BookingCancelModal
        isOpen={bookingCancelModal.isOpen}
        booking={bookingCancelModal.booking}
        onConfirm={handleBookingCancelConfirm}
        onCancel={handleBookingCancelCancel}
      />
    </div>
  );
}
