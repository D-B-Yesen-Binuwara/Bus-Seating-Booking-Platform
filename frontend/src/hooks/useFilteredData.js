import { useMemo } from 'react';

// Utility function to normalize date to YYYY-MM-DD format for comparison
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

const useFilteredData = (data, filters, options = {}) => {
  const {
    dateField = 'schedule_date',        // Field name for date filtering
    routeField = 'route',               // Field name or function for route filtering
    extraFilters = {}                   // Additional filters like search, status, etc.
  } = options;

  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    let filtered = [...data];

    // Date filtering (common to all pages)
    if (filters?.selectedDates?.length > 0) {
      filtered = filtered.filter(item => {
        const itemDate = normalizeDateForComparison(item[dateField]);
        return filters.selectedDates.includes(itemDate);
      });
    }

    // Route filtering (common to all pages)
    if (filters?.selectedRoutes?.length > 0) {
      filtered = filtered.filter(item => {
        let itemRoute;
        if (typeof routeField === 'function') {
          // Custom route formatter function
          itemRoute = routeField(item);
        } else {
          // Direct field access
          itemRoute = item[routeField];
        }
        return filters.selectedRoutes.includes(itemRoute);
      });
    }

    // Extra filters (search, status, etc.)
    Object.entries(extraFilters).forEach(([filterKey, filterValue]) => {
      if (!filterValue || filterValue === '') return;

      if (filterKey === 'search' && typeof filterValue === 'object') {
        // Special handling for search across multiple fields
        const { term, fields = [] } = filterValue;
        if (term && fields.length > 0) {
          filtered = filtered.filter(item => {
            return fields.some(field => {
              const fieldValue = item[field];
              return fieldValue && fieldValue.toString().toLowerCase().includes(term.toLowerCase());
            });
          });
        }
      } else {
        // Standard field equality/exact match filtering
        filtered = filtered.filter(item => {
          const fieldValue = item[filterKey];
          if (typeof fieldValue === 'string' && typeof filterValue === 'string') {
            // Case-insensitive string comparison
            return fieldValue.toLowerCase() === filterValue.toLowerCase();
          }
          // Exact match for other types
          return fieldValue === filterValue;
        });
      }
    });

    return filtered;
  }, [data, filters, options]);
};

export default useFilteredData;