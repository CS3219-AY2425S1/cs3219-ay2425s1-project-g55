import { ErrorView } from '@/components/discuss/views/ErrorView';
import { IdleView } from '@/components/discuss/views/IdleView';
import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';
import { MatchedView } from '@/components/discuss/views/MatchedView';
import { TimeoutView } from '@/components/discuss/views/TimeoutView';
import { WaitingView } from '@/components/discuss/views/WaitingView';
import { useAuth } from '@/hooks/auth/useAuth';
import { BACKEND_URL_MATCHING, BACKEND_WEBSOCKET_MATCHING } from '@/lib/common';
import {
  MATCH_ERROR_STATUS,
  MATCH_FOUND_MESSAGE_TYPE,
  MATCH_FOUND_STATUS,
  MATCH_IDLE_STATUS,
  MATCH_TIMEOUT_DURATION,
  MATCH_TIMEOUT_MESSAGE_TYPE,
  MATCH_TIMEOUT_STATUS,
  MATCH_WAITING_STATUS,
} from '@/lib/consts';
import { getToken } from '@/lib/utils';
import React, { useRef } from 'react';

export default function DiscussRoute() {
  const [matchStatus, setMatchStatus] = React.useState('idle');
  const [queuePosition, setQueuePosition] = React.useState(0);
  const [roomId, setRoomId] = React.useState('');

  const auth = useAuth();
  const userId = auth?.user?.userId;

  const ws = useRef<WebSocket | null>(null);
  const matchSound = useRef<HTMLAudioElement | null>(null);

  const setupWebSocket = async () => {
    return new Promise((resolve, reject) => {
      ws.current = new WebSocket(
        `${BACKEND_WEBSOCKET_MATCHING}?userId=${userId}`
      );

      ws.current.onopen = () => {
        console.log('WebSocket Connected');
        resolve(ws.current);
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);

        if (message.type === MATCH_FOUND_MESSAGE_TYPE) {
          setMatchStatus(MATCH_FOUND_STATUS);
          setRoomId(message.roomId);
          matchSound.current?.play().catch((error) => {
            console.error('Error playing match sound:', error);
          });
        } else if (message.type === MATCH_TIMEOUT_MESSAGE_TYPE) {
          setMatchStatus(MATCH_TIMEOUT_STATUS);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setMatchStatus(MATCH_ERROR_STATUS);
        reject(error);
      };

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
    });
  };

  const startMatching = async (
    selectedTopic: string,
    selectedDifficulty: string
  ) => {
    setMatchStatus(MATCH_WAITING_STATUS);

    // Setup WebSocket before making the match request
    await setupWebSocket();

    try {
      const response = await fetch(BACKEND_URL_MATCHING, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
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
      const response = await fetch(`${BACKEND_URL_MATCHING}/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel matching');
      }

      setMatchStatus(MATCH_IDLE_STATUS);
      if (ws.current) {
        ws.current.close();
      }
    } catch (error) {
      console.error('Error cancelling match:', error);
      setMatchStatus(MATCH_ERROR_STATUS);
    }
  };

  // Update resetState to use setupWebSocket
  const resetState = async () => {
    setMatchStatus(MATCH_IDLE_STATUS);
    setQueuePosition(0);
    setRoomId('');

    // Close existing WebSocket connection
    if (ws.current) {
      ws.current.close();
    }
  };

  // If user is not logged in, show the login prompt
  if (!userId) {
    return (
      <div className='container mx-auto p-4'>
        <LoginPromptView />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
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
