import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bus, Route as RouteIcon, Calendar, BookOpen, LogOut, Menu, X } from 'lucide-react';
import BusManagement from './BusManagement';
import RouteManagement from './RouteManagement';
import ScheduleManagement from './ScheduleManagement';
import BookingManagement from './BookingManagement';

export default function StaffDashboard() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'buses', label: 'Bus Info', icon: Bus, path: '/admin/buses' },
    { id: 'routes', label: 'Routes', icon: RouteIcon, path: '/admin/routes' },
    { id: 'schedules', label: 'Schedules', icon: Calendar, path: '/admin/schedules' },
    { id: 'bookings', label: 'Bookings', icon: BookOpen, path: '/admin/bookings' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-48'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Bus className="h-6 w-6 text-blue-600" />
              {!sidebarCollapsed && (
                <span className="ml-2 text-lg font-bold text-gray-900">Staff Panel</span>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 transition"
            >
              {sidebarCollapsed ? (
                <Menu className="h-4 w-4 text-gray-600" />
              ) : (
                <X className="h-4 w-4 text-gray-600" />
              )}
            </button>
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
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {!sidebarCollapsed && item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={`absolute bottom-0 ${sidebarCollapsed ? 'w-16' : 'w-48'} p-4 border-t`}>
          {!sidebarCollapsed && (
            <div className="mb-3">
              <p className="text-xs text-gray-600">Logged in as</p>
              <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
            </div>
          )}
          <button
            onClick={signOut}
            className={`w-full flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm ${
              sidebarCollapsed ? 'px-2' : ''
            }`}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<BusManagement />} />
            <Route path="/buses" element={<BusManagement />} />
            <Route path="/routes" element={<RouteManagement />} />
            <Route path="/schedules" element={<ScheduleManagement />} />
            <Route path="/bookings" element={<BookingManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
