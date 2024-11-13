import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

interface TimeoutViewProps {
  onRetry: () => void;
}

export const TimeoutView: React.FC<TimeoutViewProps> = ({ onRetry }) => (
  <Card className='w-full max-w-md mx-auto'>
    <CardHeader>
      <CardTitle>Matching Timed Out</CardTitle>
    </CardHeader>
    <CardContent>
      <div className='space-y-4'>
        <Alert variant='destructive'>
          <AlertTitle>No Match Found</AlertTitle>
          <AlertDescription>
            We couldn't find a match within the time limit.
          </AlertDescription>
        </Alert>
        <p className='text-center text-sm text-muted-foreground'>
          Don't worry! This can happen when there aren't many users online. Feel
          free to try again.
        </p>
        <Button onClick={onRetry} className='w-full'>
          Try Again
        </Button>
      </div>
    </CardContent>
  </Card>
);
