import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './components/sidebar';

export const Root = () => {
  return (
    <div className="flex h-screen bg-[#0A0A0B]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto bg-[#141416]">
        <Outlet />
      </main>
    </div>
  );
}; 