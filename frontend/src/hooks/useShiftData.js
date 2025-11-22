import React, { useMemo, useCallback } from 'react';

// Custom hook for optimized shift filtering and calculations
export const useShiftData = (shifts, user, userRole) => {
  
  // Memoize filtered shifts for hospital users
  const hospitalShifts = useMemo(() => {
    if (userRole !== 'hospital' || !user?._id) return [];
    return shifts.filter(shift => shift.hospital?._id === user._id);
  }, [shifts, user?._id, userRole]);

  // Memoize filtered shifts for nurses
  const nurseShifts = useMemo(() => {
    if (userRole !== 'nurse') return shifts;
    return shifts;
  }, [shifts, userRole]);

  // Memoize statistics calculation
  const hospitalStats = useMemo(() => {
    if (userRole !== 'hospital') return null;
    
    const totalShifts = hospitalShifts.length;
    const openShifts = hospitalShifts.filter(shift => shift.status === 'open').length;
    const assignedShifts = hospitalShifts.filter(shift => shift.status === 'assigned').length;
    const completedShifts = hospitalShifts.filter(shift => shift.status === 'completed').length;

    return { totalShifts, openShifts, assignedShifts, completedShifts };
  }, [hospitalShifts, userRole]);

  // Memoize nurse statistics
  const nurseStats = useMemo(() => {
    if (userRole !== 'nurse' || !user?._id) return null;
    
    const available = nurseShifts.filter(shift => shift.status === 'open').length;
    const applied = nurseShifts.filter(shift => 
      shift.nursesApplied?.some(app => app.nurse === user._id)
    ).length;
    const assigned = nurseShifts.filter(shift => 
      shift.nurseAssigned === user._id
    ).length;
    const earnings = nurseShifts
      .filter(shift => shift.nurseAssigned === user._id && shift.status === 'completed')
      .reduce((total, shift) => total + (shift.paymentRate * (shift.duration || 8)), 0);

    return { available, applied, assigned, earnings };
  }, [nurseShifts, user?._id, userRole]);

  // Callback for filtering shifts by status
  const getFilteredShifts = useCallback((filter) => {
    const shiftsToFilter = userRole === 'hospital' ? hospitalShifts : nurseShifts;
    
    switch (filter) {
      case 'available':
        return shiftsToFilter.filter(shift => shift.status === 'open');
      case 'applied':
        return shiftsToFilter.filter(shift => 
          shift.nursesApplied?.some(app => app.nurse === user._id)
        );
      case 'assigned':
        return shiftsToFilter.filter(shift => 
          userRole === 'hospital' 
            ? shift.status === 'assigned'
            : shift.nurseAssigned === user._id
        );
      default:
        return shiftsToFilter;
    }
  }, [hospitalShifts, nurseShifts, user?._id, userRole]);

  return {
    shifts: userRole === 'hospital' ? hospitalShifts : nurseShifts,
    stats: userRole === 'hospital' ? hospitalStats : nurseStats,
    getFilteredShifts
  };
};

// Utility for formatting dates consistently
export const formatShiftDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Utility for getting urgency colors
export const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case 'emergency':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-green-100 text-green-800 border-green-200';
  }
};

// Debounce utility for search/filter operations
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};