import { SideMenu } from '@/components/app-specific/SideMenu.tsx';
import { Header } from '@/components/app-specific/Header.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';

export const Layout = ({ children, isAuthPage }: { children: React.ReactNode; isAuthPage?: boolean }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {!isAuthPage && <SideMenu />}
      <div className="sm:py-4 sm:pl-14">
        {!isAuthPage && <Header />}
        <main className="grid flex-1 items-start sm:gap-4 sm:p-4 sm:px-6 sm:py-0 ">{children}</main>
        <Toaster richColors />
      </div>
    </div>
  );
};
