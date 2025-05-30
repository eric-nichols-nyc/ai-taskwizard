import { Sidebar } from "../components/sidebar";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-[#0A0A0B] w-full">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto bg-[#141416]">
        {children}
      </main>
    </div>
  );
};