import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useParticipantWebsocket from '@/hooks/useParticipantWebsocket';
import { useCallback } from 'react';

import CodeEditor from '@/components/code-editor';
import ParticipantView from '@/components/ParticipantView';
import Question from '@/components/question';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRoom } from '@/hooks/useRoom';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function RoomRoute() {
  const { roomId } = useParams<{ roomId: string }>();
  const { isLoading, data, error } = useRoom(roomId);
  const auth = useAuth();
  const { activeParticipants, isConnected } = useParticipantWebsocket({
    roomId,
    userId: auth?.user?.userId?.toString(),
    onEnteredRoom: useCallback((userId: string) => {
      toast(`User ${userId} entered the room`);
    }, []),
    onExitRoom: useCallback((userId: string) => {
      toast(`User ${userId} exited the room`);
    }, []),
    onReconnected: useCallback((userId: string) => {
      toast(`User ${userId} reconnected`);
    }, []),
    onDisconnected: useCallback(() => {
      toast('You have been disconnected from the room');
    }, []),
  });

  if (!roomId) {
    return <div>No room ID</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const room = data!;
  const questionId = room.questionId;

  if (isNaN(questionId)) {
    return <div>Invalid question ID</div>;
  }

  return (
    <div className='border rounded-lg overflow-hidden h-full w-full'>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={40} className=''>
          <Tabs defaultValue='participants'>
            <TabsList className='w-full'>
              <TabsTrigger value='participants' className='flex-1'>
                Participants
              </TabsTrigger>
              <TabsTrigger value='question' className='flex-1'>
                Question
              </TabsTrigger>
            </TabsList>
            <TabsContent value='participants' className='w-full'>
              <ParticipantView
                allParticipants={room.participants}
                activeParticipants={activeParticipants}
                isConnected={isConnected}
              />
            </TabsContent>
            <TabsContent value='question'>
              <Question id={questionId} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
