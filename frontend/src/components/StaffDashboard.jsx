import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bus, Route, Calendar, BookOpen, LogOut } from 'lucide-react';
import BusManagement from './BusManagement';
import RouteManagement from './RouteManagement';
import ScheduleManagement from './ScheduleManagement';
import BookingManagement from './BookingManagement';

export default function StaffDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('buses');

  const navItems = [
    { id: 'buses', label: 'Bus Info', icon: Bus },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <Bus className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Staff Panel</span>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t">
          <div className="mb-3">
            <p className="text-sm text-gray-600">Logged in as</p>
            <p className="font-semibold text-gray-900">{user?.name}</p>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'buses' && <BusManagement />}
          {activeTab === 'routes' && <RouteManagement />}
          {activeTab === 'schedules' && <ScheduleManagement />}
          {activeTab === 'bookings' && <BookingManagement />}
        </div>
      </div>
    </div>
  );
}
