import React, { useState, useEffect, useCallback } from 'react';
import { PlayIcon, PauseIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const Timer: React.FC = () => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(5);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
            // Play sound or show notification
            new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGBzvLTgjMGHm7A7+OZURE').play();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isRunning || (minutes === 0 && seconds === 0)) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, seconds]);
  
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setMinutes(selectedDuration);
    setSeconds(0);
  }, [selectedDuration]);
  
  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
    setMinutes(duration);
    setSeconds(0);
    setIsRunning(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Timer</h3>
        <div className="flex gap-1">
          {[5, 15, 30].map(duration => (
            <button
              key={duration}
              onClick={() => handleDurationChange(duration)}
              className={`px-2 py-1 text-xs rounded ${
                selectedDuration === duration
                  ? 'bg-walmart-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {duration}m
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-800 font-mono">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        
        <div className="flex justify-center gap-2 mt-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-full ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors`}
          >
            {isRunning ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;