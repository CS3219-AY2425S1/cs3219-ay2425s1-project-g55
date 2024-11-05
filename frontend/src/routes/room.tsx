import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useParticipantWebsocket from '@/hooks/useParticipantWebsocket';
import { useCallback, useState } from 'react';

import ParticipantView from '@/components/ParticipantView';
import QuestionView from '@/components/QuestionView';
import MonacoEditor from '@/components/code-editor/MonacoEditor';
import CollaborativeEditor from '@/components/code-editor/collaborative-code-editor';
import VideoCall from '@/components/VideoCall';
import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRoom } from '@/hooks/useRoom';
import { BACKEND_WEBSOCKET_COLLABORATIVE_EDITOR } from '@/lib/common';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function RoomRoute() {
  const [editorCode, setEditorCode] = useState<string>(
    '// Write your code here\n'
  );
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

  const [activeTab, setActiveTab] = useState('participants');

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

  if (!auth?.user) {
    return (
      <LoginPromptView
        featureName='rooms'
        featureUsage='view and solve questions in a room'
      />
    );
  }

  return (
    <div className='border rounded-lg overflow-hidden h-full w-full'>
      <ResizablePanelGroup direction='horizontal'>
        {/* Tabs Panel */}
        <ResizablePanel defaultSize={30} className=''>
          <Tabs
            defaultValue='participants'
            onValueChange={(value) => setActiveTab(value)}
          >
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
              <QuestionView id={questionId} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Video Call Panel */}
        <ResizablePanel defaultSize={40}>
          <VideoCall showVideo={true} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Collaborative Editor Panel */}
        <ResizablePanel>
          {isConnected ? (
            <CollaborativeEditor
              initialValue={editorCode}
              roomName={roomId}
              websocketUrl={BACKEND_WEBSOCKET_COLLABORATIVE_EDITOR}
              userName={auth.user.userName}
            />
          ) : (
            <MonacoEditor
              questionId={questionId}
              value={editorCode}
              onChange={(value: string | undefined) =>
                setEditorCode(value ?? '')
              }
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
