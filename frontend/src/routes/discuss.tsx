import React, { useState, useEffect, useRef } from 'react';
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
import {
  MATCH_TIMEOUT_DURATION,
  MATCH_FOUND_MESSAGE_TYPE,
  MATCH_TIMEOUT_MESSAGE_TYPE,
  MATCH_FOUND_STATUS,
  MATCH_TIMEOUT_STATUS,
  MATCH_ERROR_STATUS,
  MATCH_WAITING_STATUS,
  MATCH_IDLE_STATUS,
} from '@/lib/consts';
import { useQuestionCategories } from '@/hooks/useQuestions';

const difficultyLevels = ['Easy', 'Medium', 'Hard'];

interface IdleViewProps {
  onStartMatching: (topic: string, difficulty: string) => void;
}

const IdleView: React.FC<IdleViewProps> = ({ onStartMatching }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const { data: topics, isLoading } = useQuestionCategories();

  const handleStartMatching = () => {
    if (topic && difficulty) {
      onStartMatching(topic, difficulty);
      setShowErrors(false);
    } else {
      setShowErrors(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

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
                {topics &&
                  topics.map((t) => (
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
  onCancel: () => void;
}

const WaitingView: React.FC<WaitingViewProps> = ({ queuePosition, onCancel }) => {
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
          <Button onClick={onCancel} variant="outline" className="w-full">
            Cancel Matching
          </Button>
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
  const [userId] = React.useState(Math.random().toString().split('.')[1]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(
      `ws://localhost:8082/ws/matching?userId=${userId}`
    );

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      if (message.type === MATCH_FOUND_MESSAGE_TYPE) {
        setMatchStatus(MATCH_FOUND_STATUS);
        setRoomId(message.roomId);
      } else if (message.type === MATCH_TIMEOUT_MESSAGE_TYPE) {
        setMatchStatus(MATCH_TIMEOUT_STATUS);
      }
    };

    // ws.current.onerror = (error) => {
    //   console.error('WebSocket error:', error);
    //   setMatchStatus(MATCH_ERROR_STATUS);
    // };

    ws.current.onclose = (event) => {
      console.log('WebSocket closed:', event);
      if (event.wasClean) {
        console.log(
          `Closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.error('Connection died');
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const startMatching = async (
    selectedTopic: string,
    selectedDifficulty: string
  ) => {
    setMatchStatus(MATCH_WAITING_STATUS);
    try {
      const response = await fetch('http://localhost:8082/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          topic: selectedTopic,
          difficultyLevel: selectedDifficulty,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start matching');
      }

      const result = await response.json();
      console.log('Matching request sent:', result);

      // Start a 30-second timeout
      const timeoutId = setTimeout(() => {
        if (matchStatus === MATCH_WAITING_STATUS) {
          setMatchStatus(MATCH_TIMEOUT_STATUS);
        }
      }, MATCH_TIMEOUT_DURATION);

      // Clear the timeout if the component unmounts or if we get a match
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Error starting match:', error);
      setMatchStatus(MATCH_ERROR_STATUS);
    }
  };

  const cancelMatching = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/match/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel matching');
      }

      setMatchStatus(MATCH_IDLE_STATUS);
    } catch (error) {
      console.error('Error cancelling match:', error);
      setMatchStatus(MATCH_ERROR_STATUS);
    }
  };

  // TODO: Implement retry logic for different match status
  const resetState = () => {
    setMatchStatus(MATCH_IDLE_STATUS);
    setQueuePosition(0);
    setRoomId('');

    // Close existing WebSocket connection
    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket(
      `ws://localhost:8082/ws/matching?userId=${userId}`
    );

    // Re-attach event listeners
    ws.current.onopen = () => {
      console.log('WebSocket Reconnected');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      if (message.type === MATCH_FOUND_MESSAGE_TYPE) {
        setMatchStatus(MATCH_FOUND_STATUS);
        setRoomId(message.roomId);
      } else if (message.type === MATCH_TIMEOUT_MESSAGE_TYPE) {
        setMatchStatus(MATCH_TIMEOUT_STATUS);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMatchStatus(MATCH_ERROR_STATUS);
    };
  };

  return (
    <div className="container mx-auto p-4">
      {matchStatus === MATCH_IDLE_STATUS && (
        <IdleView onStartMatching={startMatching} />
      )}
      {matchStatus === MATCH_WAITING_STATUS && (
        <WaitingView queuePosition={queuePosition} onCancel={cancelMatching} />
      )}
      {matchStatus === MATCH_FOUND_STATUS && (
        <MatchedView roomId={roomId} onNewMatch={resetState} />
      )}
      {matchStatus === MATCH_TIMEOUT_STATUS && (
        <TimeoutView onRetry={resetState} />
      )}
      {matchStatus === MATCH_ERROR_STATUS && <ErrorView onRetry={resetState} />}
    </div>
  );
}
