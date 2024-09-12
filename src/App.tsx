import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/components/app-specific/Layout.tsx';
import { Login } from '@/pages/login/Login.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorPage from '@/pages/error-page.tsx';
import { Dashboard } from '@/pages/dashboard/Dashboard.tsx';
import { SessionProvider } from '@/context/SessionContext.tsx';
import { ProtectedRoute } from '@/components/app-specific/ProtectedRoute.tsx';
import { Reports } from '@/pages/reports/Reports.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
    ],
  },
  {
    path: '/login',
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
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} position={'right'} />

        <RouterProvider router={router} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
