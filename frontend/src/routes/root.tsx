import Navbar from '@/components/navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Code2, Users, MessageSquare, Layout } from 'lucide-react';

const queryClient = new QueryClient();

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to PeerPrep</h1>
      <p className="text-xl text-muted-foreground">
        Practice coding interviews with peers in real-time
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
        <Link
          to="/problems"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <Code2 className="w-12 h-12 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">Practice Problems</h2>
          <p className="text-muted-foreground">
            Access a diverse collection of coding challenges
          </p>
        </Link>

        <Link
          to="/discuss"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <MessageSquare className="w-12 h-12 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">Find a Partner</h2>
          <p className="text-muted-foreground">
            Match with peers for collaborative practice
          </p>
        </Link>

        <div className="p-6 border rounded-lg">
          <Layout className="w-12 h-12 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">Collaborative Rooms</h2>
          <p className="text-muted-foreground">
            Real-time code editing and discussion
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <Users className="w-12 h-12 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">Active Community</h2>
          <p className="text-muted-foreground">
            Join other developers preparing for technical interviews
          </p>
        </div>
      </div>
    </div>
  );
}

function Root() {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid grid-cols-12 h-screen w-screen">
        <Navbar />
        <div className="col-span-12 flex flex-col items-center justify-center h-[calc(100vh-4rem)] pb-4 px-4">
          {location.pathname === '/' ? <LandingPage /> : <Outlet />}
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default Root;
