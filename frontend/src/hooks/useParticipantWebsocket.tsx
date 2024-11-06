import { BACKEND_WEBSOCKET_ROOM } from '@/lib/common';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

const roomSchema = z.object({
  roomId: z.string(),
  expiryTime: z.number(),
  participants: z.array(z.string()),
  questionId: z.number(),
  status: z.string(),
});

export type Room = z.infer<typeof roomSchema>;

const participantMessageSchema = z.object({
  type: z.enum(['ENTERED_ROOM', 'EXIT_ROOM', 'RECONNECTED']),
  userId: z.string(),
  timestamp: z.number(),
  activeParticipants: z.array(z.string()),
  room: roomSchema,
});

interface UseParticipantWebSocketProps {
  roomId: string | undefined;
  userId: string | undefined;
  /**
   * Callback function that is called when a user enters the room.
   * Should be memoized to infinite loops.
   */
  onEnteredRoom?: (userId: string) => void;
  /**
   * Callback function that is called when a user exits the room.
   * Should be memoized to infinite loops.
   */
  onExitRoom?: (userId: string) => void;
  /**
   * Callback function that is called when a user reconnected.
   * Should be memoized to infinite loops.
   */
  onReconnected?: (userId: string) => void;
  /**
   * Callback function that is called when the user is disconnected from the room.
   * Should be memoized to infinite loops.
   */
  onDisconnected?: () => void;
}

interface UseParticipantWebSocketReturn {
  activeParticipants: string[];
  isConnected: boolean;
  disconnect: () => void;
}

const useParticipantWebSocket = ({
  roomId,
  userId,
  onEnteredRoom,
  onExitRoom,
  onReconnected,
  onDisconnected,
}: UseParticipantWebSocketProps): UseParticipantWebSocketReturn => {
  const [activeParticipants, setActiveParticipants] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const shouldReconnectRef = useRef(true);
  const cleanupIsInProgressRef = useRef(false);

  useEffect(() => {
    if (!userId || !roomId || !shouldReconnectRef.current) {
      return;
    }

    const initializeWebSocket = async () => {
      while (cleanupIsInProgressRef.current) {
        console.log(
          'Websocket cleanup in progress. Waiting for cleanup to complete...'
        );
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      try {
        wsRef.current = new WebSocket(
          `${BACKEND_WEBSOCKET_ROOM}/${roomId}?userId=${userId}`
        );

        wsRef.current.onopen = () => {
          setIsConnected(true);
          console.log('WebSocket connected');
        };

        wsRef.current.onmessage = (event) => {
          try {
            console.log('Received message:', event.data);
            const jsonMessage = JSON.parse(event.data);
            const parsedMessage = participantMessageSchema.parse(jsonMessage);
            setActiveParticipants(parsedMessage.activeParticipants);

            if (parsedMessage.type === 'ENTERED_ROOM') {
              onEnteredRoom?.(parsedMessage.userId);
            } else if (parsedMessage.type === 'EXIT_ROOM') {
              onExitRoom?.(parsedMessage.userId);
            } else if (parsedMessage.type === 'RECONNECTED') {
              onReconnected?.(parsedMessage.userId);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        wsRef.current.onclose = (event: CloseEvent) => {
          setIsConnected(false);
          console.log('WebSocket connection closed:', {
            wasClean: event.wasClean,
            code: event.code,
            reason: event.reason,
          });

          onDisconnected?.();

          const shouldNotReconnectIfUserIsConnectingFromElsewhere =
            event.wasClean &&
            event.code === 1000 &&
            event.reason.includes('User is connecting a second time');

          if (shouldNotReconnectIfUserIsConnectingFromElsewhere) {
            shouldReconnectRef.current = false;
          }
          cleanupIsInProgressRef.current = false;
        };
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        cleanupIsInProgressRef.current = false;
      }
    };

    const cleanup = async () => {
      cleanupIsInProgressRef.current = true;

      if (wsRef.current) {
        const closePromise = new Promise<void>((resolve) => {
          if (wsRef.current) {
            const originalOnClose = wsRef.current.onclose;
            wsRef.current.onclose = (event: CloseEvent) => {
              if (originalOnClose && wsRef.current) {
                originalOnClose.call(wsRef.current, event);
              }
              resolve();
            };
          }
        });

        wsRef.current.close();
        wsRef.current = null;

        await closePromise;
      }

      cleanupIsInProgressRef.current = false;
    };

    if (!wsRef.current) {
      initializeWebSocket();
    }

    return () => {
      cleanup();
    };
  }, [
    roomId,
    userId,
    onEnteredRoom,
    onExitRoom,
    onReconnected,
    onDisconnected,
  ]);

  const disconnect = () => {
    shouldReconnectRef.current = false;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  return {
    activeParticipants,
    isConnected,
    disconnect,
  };
};

export default useParticipantWebSocket;
