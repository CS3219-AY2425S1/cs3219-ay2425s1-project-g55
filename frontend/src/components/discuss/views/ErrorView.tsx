import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

interface ErrorViewProps {
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ onRetry }) => (
  <Card className='w-full max-w-md mx-auto'>
    <CardHeader>
      <CardTitle>Error Occurred</CardTitle>
    </CardHeader>
    <CardContent>
      <div className='space-y-4'>
        <Alert variant='destructive'>
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            An error occurred while trying to find a match.
          </AlertDescription>
        </Alert>
        <p className='text-center text-sm text-muted-foreground'>
          This could be due to a network issue or a problem with our servers.
          Please try again later.
        </p>
        <Button onClick={onRetry} className='w-full'>
          Retry
        </Button>
      </div>
    </CardContent>
  </Card>
); 