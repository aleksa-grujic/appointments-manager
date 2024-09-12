import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-lg text-gray-700 mb-2">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-500">
          <i>{error?.statusText || error?.message}</i>
        </p>
      </div>
    </div>
  );
}
