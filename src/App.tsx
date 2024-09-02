import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from '@/pages/dashboard/Dashboard.tsx';
import { Layout } from '@/components/app-specific/Layout.tsx';
import { Login } from '@/pages/login/Login.tsx';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
]);

const authRouter = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position={'right'} />
      <Layout isAuthPage={!session}>
        <RouterProvider router={session ? router : authRouter} />
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
