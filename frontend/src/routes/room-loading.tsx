import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BACKEND_URL_ROOM } from '@/lib/common';
import { getToken } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function RoomLoadingRoute() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const checkRoom = async () => {
      try {
        const response = await fetch(`${BACKEND_URL_ROOM}/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const isNotCreatedYet = response.status === 404;
        if (isNotCreatedYet) {
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch room status');
        }

        const data = await response.json();
        if (data.status === 'OPEN') {
          navigate(`/rooms/${roomId}`);
        } else {
          setError(`Room is ${data.status?.toLowerCase()}`);
        }
      } catch (err) {
        setError('Failed to check room status');
        console.error(err);
      }
    };

    const interval = setInterval(checkRoom, 3000);
    checkRoom(); // Initial check

    return () => clearInterval(interval);
  }, [roomId, navigate, token]);

  return (
    <Card className='w-full max-w-md mx-auto mt-8'>
      <CardHeader>
        <CardTitle>Preparing Your Room</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col items-center space-y-4'>
          <Loader2 className='w-8 h-8 animate-spin' />
          <p className='text-center text-sm text-muted-foreground'>
            Setting up your collaborative coding environment...
          </p>
          {error && <p className='text-center text-sm text-red-500'>{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
