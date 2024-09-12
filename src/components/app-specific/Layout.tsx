import { SideMenu } from '@/components/app-specific/SideMenu.tsx';
import { Header } from '@/components/app-specific/Header.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { Outlet } from 'react-router-dom';
import { useSession } from '@/context/SessionContext.tsx';

export const Layout = () => {
  const { session, isLoading } = useSession();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {session && <SideMenu />}
      <div className="sm:py-4 sm:pl-14">
        {session && <Header />}
        <main className="grid flex-1 items-start sm:gap-4 sm:p-4 sm:px-6 sm:py-0 ">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
        <Toaster richColors />
      </div>
    </div>
  );
};
