import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * View component shown when a room is unavailable (closed/expired)
 */
export const RoomUnavailableView = () => {
  return (
    <div className='container relative min-h-screen flex items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Room Unavailable
          </h1>
          <p className='text-sm text-muted-foreground'>
            This room is no longer available for collaboration.
          </p>
        </div>

        <Alert>
          <AlertTitle>Unable to Access Room</AlertTitle>
          <AlertDescription>
            The room you're trying to access either no longer exists or has been
            closed.
          </AlertDescription>
        </Alert>

        <Button asChild className='w-full group'>
          <Link to='/'>
            <Home className='w-4 h-4 mr-2' />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};
