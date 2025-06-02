import React from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { IconLayoutDashboard, IconNotes, IconCalendar, IconBrain, IconSettings, IconX } from '@tabler/icons-react';
import { useAuth } from '@turbo-with-tailwind-v4/supabase';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  onClick?: () => void;
  className?: string;
}

export const NavItem = ({ icon, label, to, onClick, className }: NavItemProps) => {
  const router = useRouter();
  const isActive = router.state.location.pathname === to;
  const isOverlay = className && (className.includes('text-2xl') || className.includes('text-3xl'));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={
        className ||
        `flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer ${
          isActive ? 'bg-gray-800' : ''
        }`
      }
    >
      <div className={
        isOverlay
          ? 'mr-3 text-white flex items-center'
          : isActive
            ? 'text-indigo-500'
            : 'text-gray-400'
      }>
        {icon}
      </div>
      <span className={
        isOverlay
          ? 'text-white'
          : isActive
            ? 'text-indigo-500'
            : 'text-gray-300'
      }>
        {label}
      </span>
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
    { icon: <IconLayoutDashboard size={20} />, label: 'Dashboard', to: '/dashboard' },
    { icon: <IconNotes size={20} />, label: 'Notes', to: '/notes' },
    { icon: <IconCalendar size={20} />, label: 'Calendar', to: '/calendar' },
    { icon: <IconBrain size={20} />, label: 'Focus Mode', to: '/focus' },
    { icon: <IconSettings size={20} />, label: 'Settings', to: '/settings' },
  ];

  return (
    <div
      className={
        variant === 'sidebar'
          ? 'bg-background  h-full w-[230px] p-4 flex flex-col'
          : 'fixed inset-0 z-50 bg-background flex items-center justify-center'
      }
    >
      <div
        className={
          variant === 'sidebar'
            ? 'flex flex-col h-full w-full'
            : 'relative w-full h-full flex flex-col items-center justify-center'
        }
      >
        {/* Overlay close button */}
        {variant === 'overlay' && (
          <button
            className="absolute top-6 right-6 bg-white rounded-full p-2 z-10"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <IconX size={32} className="text-red-600" />
          </button>
        )}
        {/* Navigation Items */}
        <div className={
          variant === 'overlay'
            ? 'flex flex-col items-start gap-6 w-full h-full pl-10 pt-24'
            : 'flex flex-col gap-1'
        }>
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              onClick={variant === 'overlay' ? onClose : undefined}
              className={
                variant === 'overlay'
                  ? 'flex items-center gap-3 text-2xl md:text-3xl font-extrabold text-white tracking-wide'
                  : undefined
              }
            />
          ))}
        </div>
        {/* Sidebar-only content */}
        {variant === 'sidebar' && <>
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
        </>}
      </div>
    </div>
  );
};