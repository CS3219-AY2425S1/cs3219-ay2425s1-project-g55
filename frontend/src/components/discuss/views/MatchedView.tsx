import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface MatchedViewProps {
  roomId: string;
  onNewMatch: () => void;
}

export const MatchedView: React.FC<MatchedViewProps> = ({
  roomId,
  onNewMatch,
}) => {
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  }, []);

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Match Found!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your room ID is: <span className='font-bold'>{roomId}</span>
            </AlertDescription>
          </Alert>
          <p className='text-center text-sm text-muted-foreground'>
            You've been matched with a coding partner. Use the room ID to join
            your collaborative session.
          </p>
          <div className='space-y-4'>
            {isDisabled ? (
              <Button disabled={isDisabled} className='w-full'>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Getting your room ready...
              </Button>
            ) : (
              <Button asChild className='w-full group' disabled={isDisabled}>
                <Link to={`/rooms/${roomId}`}>
                  Join Room
                  <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform' />
                </Link>
              </Button>
            )}
            <Button onClick={onNewMatch} variant='outline' className='w-full'>
              Find Another Match
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
