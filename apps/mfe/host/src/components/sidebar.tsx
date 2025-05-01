import { Link, useLocation } from 'react-router-dom';
import { IconLayoutDashboard, IconFolders, IconNotes, IconCalendar, IconUsers, IconWorld, IconBrain, IconRobot, IconSettings, IconCrown } from '@tabler/icons-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const NavItem = ({ icon, label, to }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer ${
        isActive ? 'bg-gray-800' : ''
      }`}
    >
      <div className={isActive ? 'text-indigo-500' : 'text-gray-400'}>{icon}</div>
      <span className={isActive ? 'text-indigo-500' : 'text-gray-300'}>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  return (
    <div className="bg-[#0A0A0B] h-full w-[230px] p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 mb-6">
        <div className="text-indigo-500 text-xl">⚡</div>
        <span className="text-indigo-500 font-semibold">TaskMaster AI</span>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-1">
        <NavItem icon={<IconLayoutDashboard size={20} />} label="Dashboard" to="/" />
        <NavItem icon={<IconFolders size={20} />} label="Folders" to="/folders" />
        <NavItem icon={<IconNotes size={20} />} label="Notes" to="/notes" />
        <NavItem icon={<IconCalendar size={20} />} label="Calendar" to="/calendar" />
        <NavItem icon={<IconUsers size={20} />} label="Friends" to="/friends" />
        <NavItem icon={<IconWorld size={20} />} label="Community" to="/community" />
        <NavItem icon={<IconBrain size={20} />} label="Focus Mode" to="/focus" />
        <NavItem icon={<IconRobot size={20} />} label="AI Assistant" to="/ai-assistant" />
        <NavItem icon={<IconSettings size={20} />} label="Settings" to="/settings" />
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Premium Button */}
      <div className="px-4 mb-4">
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
          <IconCrown size={20} />
          <span>Upgrade to Premium</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="px-4 py-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
          E
        </div>
        <div className="flex flex-col">
          <span className="text-gray-300 text-sm">Eric Nichols</span>
          <span className="text-gray-500 text-xs">Basic</span>
        </div>
      </div>
    </div>
  );
};