import { useAuth } from '@/hooks/auth/useAuth';
import { BACKEND_URL_ROOM } from '@/lib/common';
import { useQuery } from '@tanstack/react-query';

interface Room {
  roomId: string;
  expiryTime: number; // ISO timestamp number
  participants: string[];
  questionId: number;
  status: 'OPEN' | 'CLOSED' | 'EXPIRED';
}

/**
 * Hook to fetch room data by roomId
 * @param roomId - The ID of the room to fetch
 */
export function useRoom(roomId: string | undefined) {
  const auth = useAuth();
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async (): Promise<Room> => {
      if (!roomId) {
        throw new Error('Room ID is required');
      }

      if (!auth) {
        throw new Error('useRoom must be used by an authenticated user');
      }

      console.log(`ID is ${roomId}`);
      const response = await fetch(`${BACKEND_URL_ROOM}/${roomId}`, {
        headers: {
          'X-User-Id': auth.user.userId.toString(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch room');
      }

      const data = await response.json();

      return data;
    },
    // Don't fetch if no roomId is provided
    enabled: !!roomId,
  });
}
