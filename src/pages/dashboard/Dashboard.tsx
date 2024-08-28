import { Header } from '@/pages/dashboard/components/Header.tsx';
import { TableOfContent } from '@/pages/dashboard/components/TableOfContent.tsx';

export function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col p-6">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Header />
            <TableOfContent />
          </div>
        </main>
      </div>
    </div>
  );
}
