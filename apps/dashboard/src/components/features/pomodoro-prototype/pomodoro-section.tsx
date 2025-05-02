import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Edit2, Trash2 } from 'lucide-react';

interface Timer {
  id: number;
  label: string;
  currentTime: number;
  isActive: boolean;
  intervalId: NodeJS.Timeout | null;
}

const PomodoroTimer = () => {
  // Main timer state (completely independent)
  const [mainTime, setMainTime] = useState(25 * 60);
  const [isMainActive, setIsMainActive] = useState(false);
  const mainIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Collection of all independent timers
  const [timers, setTimers] = useState<Timer[]>([
    { 
      id: 1, 
      label: "Focus Block", 
      currentTime: 10,
      isActive: false,
      intervalId: null
    }
  ]);
  
  // Audio ref for notification sound
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Format time to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Play sound when timer ends
  const playSound = () => {
    console.log("Playing sound");
    if (audioRef.current) {
        audioRef.current.play();

        audioRef.current.currentTime = 0; // rewind to start
    }
  };
  
  // Debug function to log timer states
  // const logTimerStates = () => {
  //   console.log("Current timer states:", timers.map(t => ({
  //     id: t.id,
  //     label: t.label,
  //     time: t.currentTime,
  //     active: t.isActive,
  //     hasInterval: t.intervalId !== null
  //   })));
  // };

  // MAIN TIMER CONTROLS
  const startMainTimer = () => {
    // Clear existing interval if any
    if (mainIntervalRef.current) {
      clearInterval(mainIntervalRef.current);
    }
    setIsMainActive(true);
    // Create new interval
    const newInterval = setInterval(() => {
      setMainTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(newInterval);
          setIsMainActive(false);
          if (prevTime !== 0) playSound(); // Only play if not already zero
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    // Store interval reference
    mainIntervalRef.current = newInterval;
  };
  
  const pauseMainTimer = () => {
    if (mainIntervalRef.current) clearInterval(mainIntervalRef.current);
    setIsMainActive(false);
  };
  
  const resetMainTimer = () => {
    if (mainIntervalRef.current) clearInterval(mainIntervalRef.current);
    setIsMainActive(false);
    setMainTime(25 * 60); // Reset to 25 minutes
  };

  // INDIVIDUAL TIMER CONTROLS
  // Start a specific timer
  const startTimer = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    setTimers(prevTimers => {
      // Find the timer we're starting
      const timerToStart = prevTimers.find(timer => timer.id === id);
      
      // Don't start if already at zero
      if (timerToStart && timerToStart.currentTime <= 0) {
        return prevTimers;
      }
      
      return prevTimers.map(timer => {
        if (timer.id === id) {
          // Clear any existing interval
          if (timer.intervalId) {
            clearInterval(timer.intervalId);
          }
          
          // Create a new interval with a persistent reference
          const newIntervalId = setInterval(() => {
            setTimers(prev => {
              return prev.map(t => {
                if (t.id === id) {
                  // Check if timer has reached zero
                  if (t.currentTime <= 1) {
                    if (t.intervalId) clearInterval(t.intervalId);
                    if (t.currentTime !== 0) playSound(); // Only play if not already zero
                    return { ...t, currentTime: 0, isActive: false, intervalId: null };
                  }
                  // Otherwise decrease time by 1 second
                  return { ...t, currentTime: t.currentTime - 1 };
                }
                return t;
              });
            });
          }, 1000);
          
          // Store the interval ID and mark as active
          return { ...timer, isActive: true, intervalId: newIntervalId };
        }
        return timer;
      });
    });
  };
  
  // Pause a specific timer
  const pauseTimer = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    setTimers(prevTimers => {
      return prevTimers.map(timer => {
        if (timer.id === id) {
          if (timer.intervalId) {
            clearInterval(timer.intervalId);
          }
          return { ...timer, isActive: false, intervalId: null };
        }
        return timer;
      });
    });
  };
  
  // Reset a specific timer
  const resetTimer = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    setTimers(prevTimers => {
      return prevTimers.map(timer => {
        if (timer.id === id) {
          if (timer.intervalId) {
            clearInterval(timer.intervalId);
          }
          return { 
            ...timer, 
            currentTime: 25 * 60, // Reset to 25 minutes
            isActive: false, 
            intervalId: null 
          };
        }
        return timer;
      });
    });
  };
  
  // Add a new timer
  const addNewTimer = () => {
    const newTimer: Timer = {
      id: Date.now(),
      label: "New Timer",
      currentTime: 25 * 60,
      isActive: false,
      intervalId: null
    };
    
    setTimers(prevTimers => [...prevTimers, newTimer]);
  };
  
  // Delete a timer
  const deleteTimer = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    setTimers(prevTimers => {
      // Clear interval if timer is active
      const timerToDelete = prevTimers.find(timer => timer.id === id);
      if (timerToDelete && timerToDelete.intervalId) {
        clearInterval(timerToDelete.intervalId);
      }
      
      return prevTimers.filter(timer => timer.id !== id);
    });
  };

  // Edit timer label
  const editTimer = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    const newLabel = prompt("Enter new timer name:");
    if (newLabel && newLabel.trim() !== "") {
      setTimers(prevTimers => {
        return prevTimers.map(timer => {
          if (timer.id === id) {
            return { ...timer, label: newLabel };
          }
          return timer;
        });
      });
    }
  };
  
  // Clean up all intervals on unmount
  useEffect(() => {
    return () => {
      // Clear main timer interval
      if (mainIntervalRef.current) {
        clearInterval(mainIntervalRef.current);
      }
      
      // Clear all timer intervals
      timers.forEach(timer => {
        if (timer.intervalId) {
          clearInterval(timer.intervalId);
        }
      });
    };
  }, [timers]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
     
      
      {/* Header with new timer button */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
        <button 
          onClick={addNewTimer}
          className="bg-purple-700 hover:bg-purple-600 text-white rounded-full p-2 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
      
      {/* Main timer display - completely independent */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Main Timer</h2>
          <h3 className="text-6xl font-bold text-purple-500 mb-8">
            {formatTime(mainTime)}
          </h3>
          
          {/* Main timer controls */}
          <div className="flex justify-center gap-4">
            {!isMainActive ? (
              <button 
                onClick={startMainTimer}
                className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-6 py-3 flex items-center gap-2 transition-colors"
              >
                <Play size={18} />
                Start
              </button>
            ) : (
              <button 
                onClick={pauseMainTimer}
                className="bg-gray-600 hover:bg-gray-500 text-white rounded-lg px-6 py-3 flex items-center gap-2 transition-colors"
              >
                <Pause size={18} />
                Pause
              </button>
            )}
            
            <button 
              onClick={resetMainTimer}
              className="bg-red-600 hover:bg-red-500 text-white rounded-lg px-6 py-3 flex items-center gap-2 transition-colors"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Saved timers list - each with independent countdown */}
      <div className="w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Saved Timers</h3>
        <div className="space-y-3">
          {timers.map(timer => (
            <div 
              key={timer.id}
              className="bg-gray-800 rounded-lg p-4 flex items-center justify-between cursor-default transition-colors"
            >
              <div>
                <h4 className="font-medium">{timer.label}</h4>
                <p className="text-gray-400">{formatTime(timer.currentTime)}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {!timer.isActive ? (
                  <button 
                    onClick={(e) => startTimer(timer.id, e)}
                    className="text-green-500 hover:text-green-400 transition-colors"
                  >
                    <Play size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={(e) => pauseTimer(timer.id, e)}
                    className="text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    <Pause size={18} />
                  </button>
                )}
                
                <button 
                  onClick={(e) => editTimer(timer.id, e)}
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                
                <button 
                  onClick={(e) => resetTimer(timer.id, e)}
                  className="text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  <RotateCcw size={18} />
                </button>
                
                <button 
                  onClick={(e) => deleteTimer(timer.id, e)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
       {/* Hidden audio element for notification */}
       <audio ref={audioRef} >
        <source src="/sounds/chime.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default PomodoroTimer;