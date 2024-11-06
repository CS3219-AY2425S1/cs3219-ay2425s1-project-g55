import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Timer } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface WaitingViewProps {
  onCancel: () => void;
}

export const WaitingView: React.FC<WaitingViewProps> = ({
  onCancel,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Finding a Match</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex justify-center'>
            <Loader2 className='h-12 w-12 animate-spin text-primary' />
          </div>
          <Alert>
            <AlertTitle>Searching for a match</AlertTitle>
            <AlertDescription>
              Looking for available partners...
            </AlertDescription>
          </Alert>
          <div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground'>
            <Timer className='h-4 w-4' />
            <span>Elapsed time: {formatTime(elapsedTime)}</span>
          </div>
          <p className='text-center text-sm text-muted-foreground'>
            Please wait while we find a coding partner for you. This may take up
            to 30 seconds.
          </p>
          <Button onClick={onCancel} variant='outline' className='w-full'>
            Cancel Matching
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
