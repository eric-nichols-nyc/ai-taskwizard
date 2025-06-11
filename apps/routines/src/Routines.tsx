import React, { useState, useEffect } from 'react';

interface Task {
  key: string;
  text: string;
  time: string;
}

interface TaskState {
  [key: string]: boolean;
}

interface ChecklistItemProps {
  task: Task;
  isChecked: boolean;
  onToggle: (taskKey: string) => void;
  variant: 'morning' | 'evening';
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ task, isChecked, onToggle, variant }) => {
  const borderColor = variant === 'morning' ? 'border-l-red-500' : 'border-l-blue-500';
  const completedBorderColor = 'border-l-green-500';
  
  return (
    <div className={`
      flex items-center p-3 bg-gray-50 rounded-lg transition-all duration-200 hover:translate-x-1 hover:shadow-md
      ${isChecked ? `bg-green-50 ${completedBorderColor}` : borderColor} border-l-4
    `}>
      <button
        className={`
          w-6 h-6 border-2 rounded flex items-center justify-center mr-4 font-bold transition-all duration-200
          ${isChecked 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'bg-white border-gray-600 hover:border-green-500'
          }
        `}
        onClick={() => onToggle(task.key)}
        aria-label={`${isChecked ? 'Uncheck' : 'Check'} ${task.text}`}
      >
        {isChecked && '✓'}
      </button>
      <span className={`
        flex-1 text-gray-800 font-medium transition-all duration-200
        ${isChecked ? 'line-through text-gray-500' : ''}
      `}>
        {task.text}
      </span>
      <span className="text-gray-500 text-sm italic ml-2">
        {task.time}
      </span>
    </div>
  );
};

export const Routines: React.FC = () => {
  const [morningTasks, setMorningTasks] = useState<TaskState>({
    wakeUp: false,
    drinkWater: false,
    takeMedication: false,
    brushTeeth: false,
    getDressed: false,
    eatBreakfast: false,
    reviewPriorities: false,
    grabEssentials: false,
    packBag: false,
    bodyMovement: false,
    wakeupMusic: false
  });

  const [eveningTasks, setEveningTasks] = useState<TaskState>({
    chargePhone: false,
    tidySpace: false,
    prepareClothes: false,
    packTomorrowBag: false,
    writeGratitude: false,
    reviewSchedule: false,
    brushTeethEvening: false,
    takeEveningMeds: false,
    organizeEssentials: false,
    relaxingActivity: false
  });

  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setCurrentDate(today);
  }, []);

  const handleMorningTaskChange = (taskKey: string): void => {
    setMorningTasks(prev => ({ ...prev, [taskKey]: !prev[taskKey] }));
  };

  const handleEveningTaskChange = (taskKey: string): void => {
    setEveningTasks(prev => ({ ...prev, [taskKey]: !prev[taskKey] }));
  };

  const morningTasksData: Task[] = [
    { key: 'wakeUp', text: 'Wake up at 5 am', time: '0 min' },
    { key: 'drinkWater', text: 'Drink a full glass of water', time: '1 min' },
    { key: 'takeMedication', text: 'Take adderall (if applicable)', time: '1 min' },
    { key: 'wakeupMusic', text: 'Listen to wakeupmusic', time: '1 min' },
    { key: 'brushTeeth', text: 'Brush teeth & wash face', time: '2 min' },
    { key: 'getDressed', text: 'Get dressed in clothes laid out night before', time: '5 min' },
    { key: 'eatBreakfast', text: 'make coffee and eat breakfast', time: '5 min' },
    { key: 'reviewPriorities', text: "Review today's top 3 priorities", time: '3 min' },
    { key: 'grabEssentials', text: 'Grab wallet, phone from designated spot', time: '1 min' },
    { key: 'packBag', text: 'Pack gym bag with essentials', time: '1 min' },
    { key: 'bodyMovement', text: 'Get to gym by 5:30-5:45', time: '5 min' }
  ];

  const eveningTasksData: Task[] = [
    { key: 'chargePhone', text: 'Set phone to charge in another room', time: '1 min' },
    { key: 'tidySpace', text: 'Tidy up living space (10-item pickup)', time: '5 min' },
    { key: 'prepareClothes', text: "Prepare tomorrow's clothes", time: '3 min' },
    { key: 'packTomorrowBag', text: 'Pack work bag for tomorrow', time: '3 min' },
    { key: 'writeGratitude', text: 'Write down 3 things that went well today', time: '3 min' },
    { key: 'reviewSchedule', text: "Review tomorrow's schedule", time: '2 min' },
    { key: 'brushTeethEvening', text: 'Brush teeth & wash face', time: '5 min' },
    { key: 'takeEveningMeds', text: 'Take evening medication (if applicable)', time: '1 min' },
    { key: 'organizeEssentials', text: 'Put keys, wallet, phone in designated spot', time: '1 min' },
    { key: 'relaxingActivity', text: 'Read or listen to calming content', time: '15 min' }
  ];

  const getCompletionPercentage = (tasks: TaskState): number => {
    const completed = Object.values(tasks).filter(Boolean).length;
    const total = Object.values(tasks).length;
    return Math.round((completed / total) * 100);
  };

  const resetAllTasks = (): void => {
    setMorningTasks(Object.keys(morningTasks).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    setEveningTasks(Object.keys(eveningTasks).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Daily Routine Checklist
            </h1>
            <p className="text-gray-600 italic">
              ADHD-Friendly Structure for Success
            </p>
          </div>

          {/* Date Section */}
          <div className="text-center mb-8 p-4 bg-gray-100 rounded-lg">
            <span className="text-lg font-semibold text-gray-700">
              📅 {currentDate}
            </span>
          </div>

          {/* Controls */}
          <div className="flex justify-center mb-8">
            <button
              onClick={resetAllTasks}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              🔄 Reset All Tasks
            </button>
          </div>

          {/* Morning Routine */}
          <div className="mb-10 border-2 border-red-500 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-500 flex items-center gap-3">
                ☀️ Morning Routine (30-45 mins)
              </h2>
              <div className="text-xl font-bold text-green-600">
                {getCompletionPercentage(morningTasks)}% Complete
              </div>
            </div>
            <div className="space-y-3">
              {morningTasksData.map((task) => (
                <ChecklistItem
                  key={task.key}
                  task={task}
                  isChecked={morningTasks[task.key]}
                  onToggle={handleMorningTaskChange}
                  variant="morning"
                />
              ))}
            </div>
          </div>

          {/* Evening Routine */}
          <div className="mb-10 border-2 border-blue-500 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-500 flex items-center gap-3">
                🌙 Evening Routine (30-40 mins)
              </h2>
              <div className="text-xl font-bold text-green-600">
                {getCompletionPercentage(eveningTasks)}% Complete
              </div>
            </div>
            <div className="space-y-3">
              {eveningTasksData.map((task) => (
                <ChecklistItem
                  key={task.key}
                  task={task}
                  isChecked={eveningTasks[task.key]}
                  onToggle={handleEveningTaskChange}
                  variant="evening"
                />
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
              💡 ADHD Success Tips
            </h3>
            <ul className="text-yellow-800 space-y-2">
              <li>
                <strong>Start small:</strong> Pick 3-5 items to focus on first, then gradually add more
              </li>
              <li>
                <strong>Use timers:</strong> Set alarms for each routine to stay on track
              </li>
              <li>
                <strong>Prep the night before:</strong> Reduce morning decision fatigue
              </li>
              <li>
                <strong>Create visual cues:</strong> Leave items in obvious places as reminders
              </li>
              <li>
                <strong>Be flexible:</strong> Some days won't be perfect, and that's okay
              </li>
              <li>
                <strong>Celebrate wins:</strong> Acknowledge when you complete tasks!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};