import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bus, LogOut, MapPin, Calendar, BookOpen, User } from 'lucide-react';
import RoutesPage from './Routes';
import AllSchedules from './AllSchedules';
import MyBookings from './MyBookings';
import MyProfile from './MyProfile';
import Footer from '../../components/Footer';

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { id: 'routes', label: 'Routes', icon: MapPin, path: '/user/routes' },
    { id: 'schedules', label: 'All Schedules', icon: Calendar, path: '/user/schedules' },
    { id: 'bookings', label: 'My Bookings', icon: BookOpen, path: '/user/bookings' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/user/profile' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-48 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center mb-6">
            <Bus className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold text-gray-900">Bus Booking</span>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition text-sm ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-48 p-4 border-t">
          <div className="mb-3">
            <p className="text-xs text-gray-600">Logged in as</p>
            <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 pb-24">
          <Routes>
            <Route path="/" element={<RoutesPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/schedules" element={<AllSchedules />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/profile" element={<MyProfile />} />
          </Routes>
        </div>
        {location.pathname !== '/user/profile' && <Footer />}
      </div>
    </div>
  );
}
