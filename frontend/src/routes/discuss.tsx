import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Timer } from 'lucide-react';

const topics = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs'];
const difficultyLevels = ['Easy', 'Medium', 'Hard'];

interface IdleViewProps {
  onStartMatching: (topic: string, difficulty: string) => void;
}

const IdleView: React.FC<IdleViewProps> = ({ onStartMatching }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const handleStartMatching = () => {
    if (topic && difficulty) {
      onStartMatching(topic, difficulty);
      setShowErrors(false);
    } else {
      setShowErrors(true);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Find a Coding Partner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Select onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showErrors && !topic && (
              <p className="text-sm text-red-500 mt-1">Please select a topic</p>
            )}
          </div>

          <div>
            <Select onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showErrors && !difficulty && (
              <p className="text-sm text-red-500 mt-1">
                Please select a difficulty level
              </p>
            )}
          </div>

          <Button onClick={handleStartMatching} className="w-full">
            Start Matching
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface WaitingViewProps {
  queuePosition: number;
}

const WaitingView: React.FC<WaitingViewProps> = ({ queuePosition }) => {
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Finding a Match</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <Alert>
            <AlertTitle>Searching for a match</AlertTitle>
            <AlertDescription>
              Your position in queue: {queuePosition}
            </AlertDescription>
          </Alert>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Timer className="h-4 w-4" />
            <span>Elapsed time: {formatTime(elapsedTime)}</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Please wait while we find a coding partner for you. This may take up
            to 30 seconds.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

interface MatchedViewProps {
  roomId: string;
  onNewMatch: () => void;
}

const MatchedView: React.FC<MatchedViewProps> = ({ roomId, onNewMatch }) => (
  <Card className="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle>Match Found!</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your room ID is: <span className="font-bold">{roomId}</span>
          </AlertDescription>
        </Alert>
        <p className="text-center text-sm text-muted-foreground">
          You've been matched with a coding partner. Use the room ID to join
          your collaborative session.
        </p>
        <Button onClick={onNewMatch} className="w-full">
          Find Another Match
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface TimeoutViewProps {
  onRetry: () => void;
}

const TimeoutView: React.FC<TimeoutViewProps> = ({ onRetry }) => (
  <Card className="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle>Matching Timed Out</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>No Match Found</AlertTitle>
          <AlertDescription>
            We couldn't find a match within the time limit.
          </AlertDescription>
        </Alert>
        <p className="text-center text-sm text-muted-foreground">
          Don't worry! This can happen when there aren't many users online. Feel
          free to try again.
        </p>
        <Button onClick={onRetry} className="w-full">
          Try Again
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface ErrorViewProps {
  onRetry: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ onRetry }) => (
  <Card className="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle>Error Occurred</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            An error occurred while trying to find a match.
          </AlertDescription>
        </Alert>
        <p className="text-center text-sm text-muted-foreground">
          This could be due to a network issue or a problem with our servers.
          Please try again later.
        </p>
        <Button onClick={onRetry} className="w-full">
          Retry
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function DiscussRoute() {
  const [matchStatus, setMatchStatus] = React.useState('idle');
  const [queuePosition, setQueuePosition] = React.useState(0);
  const [roomId, setRoomId] = React.useState('');

  const startMatching = (selectedTopic: string, selectedDifficulty: string) => {
    setMatchStatus('waiting');

    // TODO: Implement actual API call and SSE
    // Simulating API call and SSE
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.6) {
        setMatchStatus('matched');
        console.log(
          `Matching started with topic: ${selectedTopic}, difficulty: ${selectedDifficulty}`
        );
        setRoomId('ROOM-' + Math.random().toString(36).substr(2, 9));
      } else if (random < 0.9) {
        setMatchStatus('timeout');
      } else {
        setMatchStatus('error');
      }
    }, 3000);

    // TODO: Implement timeout handling
    // For actual timeout handling
    // const matchTimeout = setTimeout(() => {
    //   setMatchStatus('timeout');
    // }, 30000);

    // Remember to clear the timeout when the match is found
    // clearTimeout(matchTimeout);
  };

  // TODO: Implement retry logic for different match status
  const resetState = () => {
    setMatchStatus('idle');
    setQueuePosition(0);
    setRoomId('');
  };

  return (
    <div className="container mx-auto p-4">
      {matchStatus === 'idle' && <IdleView onStartMatching={startMatching} />}
      {matchStatus === 'waiting' && (
        <WaitingView queuePosition={queuePosition} />
      )}
      {matchStatus === 'matched' && (
        <MatchedView roomId={roomId} onNewMatch={resetState} />
      )}
      {matchStatus === 'timeout' && <TimeoutView onRetry={resetState} />}
      {matchStatus === 'error' && <ErrorView onRetry={resetState} />}
    </div>
  );
}
