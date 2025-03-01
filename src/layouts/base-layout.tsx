import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export function BaseLayout() {
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {isAuthenticated && (
        <Sidebar className={sidebarOpen ? 'w-64' : 'w-16'} />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}