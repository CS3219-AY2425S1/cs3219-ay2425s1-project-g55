import Navbar from '@/components/navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='grid grid-cols-12 h-screen w-screen'>
        <Navbar />
        <div className='col-span-12 flex flex-col items-center justify-center h-[calc(100vh-4rem)]'>
          <Outlet />
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default Root;
