import React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { IconLayoutDashboard, IconNotes, IconCalendar, IconBrain, IconSettings, IconX } from '@tabler/icons-react';
import { useAuth } from '@turbo-with-tailwind-v4/supabase';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  onClick?: () => void;
}

export const NavItem = ({ icon, label, to, onClick }: NavItemProps) => {
  const router = useRouter();
  const isActive = router.state.location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer ${
        isActive ? 'bg-gray-800' : ''
      }`}
    >
      <div className={isActive ? 'text-indigo-500' : 'text-gray-400'}>{icon}</div>
      <span className={isActive ? 'text-indigo-500' : 'text-gray-300'}>{label}</span>
    </Link>
  );
};

interface SidebarProps {
  variant?: 'sidebar' | 'overlay';
  onClose?: () => void;
}

export const Sidebar = ({ variant = 'sidebar', onClose }: SidebarProps) => {
  const { user } = useAuth();
  const navItems = [
    { icon: <IconLayoutDashboard size={20} />, label: 'Dashboard', to: '/' },
    { icon: <IconNotes size={20} />, label: 'Notes', to: '/notes' },
    { icon: <IconCalendar size={20} />, label: 'Calendar', to: '/calendar' },
    { icon: <IconBrain size={20} />, label: 'Focus Mode', to: '/focus' },
    { icon: <IconSettings size={20} />, label: 'Settings', to: '/settings' },
  ];

  return (
    <div
      className={
        variant === 'sidebar'
          ? 'bg-[#0A0A0B] h-full w-[230px] p-4 flex flex-col'
          : 'fixed inset-0 z-50 bg-black/60 flex items-center justify-center'
      }
    >
      <div
        className={
          variant === 'sidebar'
            ? 'flex flex-col h-full w-full'
            : 'bg-[#0A0A0B] w-[320px] max-h-[95vh] p-6 flex flex-col shadow-lg animate-slide-in rounded-xl'
        }
      >
        {/* Overlay close button */}
        {variant === 'overlay' && (
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <IconX size={24} />
          </button>
        )}
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 mb-6 mt-2">
          <div className="text-indigo-500 text-xl">⚡</div>
          <span className="text-indigo-500 font-semibold">TaskWizard AI</span>
        </div>
        {/* Navigation Items */}
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={variant === 'overlay' ? onClose : undefined} />
          ))}
        </div>
        <div className="flex-grow" />
        {/* User Profile */}
        <div className="px-4 py-2 flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-base leading-none">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-300 text-sm truncate max-w-[140px]">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};