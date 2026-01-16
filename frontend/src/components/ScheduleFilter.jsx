import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ScheduleFilter = ({ routes, onFilterChange }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDates((prev) => {
      if (prev.includes(date)) {
        return prev.filter((d) => d !== date);
      } else {
        return [...prev, date];
      }
    });
  };

  const handleRouteChange = (route) => {
    setSelectedRoutes((prev) => {
      if (prev.includes(route)) {
        return prev.filter((r) => r !== route);
      } else {
        return [...prev, route];
      }
    });
  };

  const removeDate = (dateToRemove) => {
    setSelectedDates((prev) => prev.filter((d) => d !== dateToRemove));
  };

  const removeRoute = (routeToRemove) => {
    setSelectedRoutes((prev) => prev.filter((r) => r !== routeToRemove));
  };

  const clearAllFilters = () => {
    setSelectedDates([]);
    setSelectedRoutes([]);
  };

  useEffect(() => {
    onFilterChange({ selectedDates, selectedRoutes });
  }, [selectedDates, selectedRoutes]);

  return (
    <div className="filter-container bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Schedules</h3>
        {(selectedDates.length > 0 || selectedRoutes.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Select Dates</h4>
        <input
          type="date"
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <div className="flex flex-wrap gap-1">
          {selectedDates.map((date) => (
            <span key={date} className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {date}
              <button
                onClick={() => removeDate(date)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-md font-medium mb-2">Select Routes</h4>
        {routes.map((route) => (
          <div key={route.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`route-${route.id}`}
              checked={selectedRoutes.includes(`${route.source} → ${route.destination}`)}
              onChange={() => handleRouteChange(`${route.source} → ${route.destination}`)}
              className="mr-2"
            />
            <label htmlFor={`route-${route.id}`} className="text-sm flex-1">
              {route.source} → {route.destination}
            </label>
          </div>
        ))}
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedRoutes.map((route) => (
            <span key={route} className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              {route}
              <button
                onClick={() => removeRoute(route)}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleFilter;