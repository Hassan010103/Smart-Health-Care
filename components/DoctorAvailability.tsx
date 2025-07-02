
import React from 'react';
import { AvailabilitySlot } from '../types';
import { ClockIcon } from './IconComponents';

interface DoctorAvailabilityProps {
  availability: AvailabilitySlot[];
  selectedSlot: { day: string, time: string } | null;
  onSelectSlot: (slot: { day: string, time: string }) => void;
}

const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DoctorAvailability: React.FC<DoctorAvailabilityProps> = ({ availability, selectedSlot, onSelectSlot }) => {
  const availabilityMap = new Map(availability.map(slot => [slot.day, slot.times]));

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        <ClockIcon className="w-6 h-6 text-primary" />
        Weekly Availability
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
        {allDays.map(day => {
          const availableTimes = availabilityMap.get(day);
          const isAvailableDay = !!availableTimes && availableTimes.length > 0;

          return (
            <div key={day} className={`p-3 rounded-lg ${isAvailableDay ? 'bg-cyan-50 dark:bg-slate-700/60' : 'bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500'}`}>
              <p className={`font-bold text-sm uppercase ${isAvailableDay ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`}>{day}</p>
              <div className="mt-2 space-y-1">
              {isAvailableDay ? (
                availableTimes.map(time => {
                  const isSelected = selectedSlot?.day === day && selectedSlot?.time === time;
                  return (
                    <button 
                        key={time} 
                        onClick={() => onSelectSlot({ day, time })}
                        className={`w-full text-xs font-semibold p-1 rounded transition-colors ${
                            isSelected 
                            ? 'bg-primary text-white scale-105 shadow' 
                            : 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200 dark:bg-slate-700 dark:text-cyan-300 dark:hover:bg-slate-600'
                        }`}
                    >
                      {time}
                    </button>
                  )
                })
              ) : (
                <p className="mt-2 text-xs">-</p>
              )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorAvailability;
