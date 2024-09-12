import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import routes from '@/lib/routes.ts';
import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router-dom';

export const SideMenu = () => {
  const location = useLocation();

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {routes.map((route) => (
            <Tooltip key={route.route}>
              <TooltipTrigger asChild>
                <Link
                  to={route.route}
                  className={clsx({
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8':
                      true,
                    'bg-accent text-accent-foreground': location.pathname === route.route,
                  })}
                >
                  <route.icon className="h-5 w-5" />
                  <span className="sr-only">{route.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{route.name}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
};
