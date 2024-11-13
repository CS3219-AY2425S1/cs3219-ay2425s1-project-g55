import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useParticipantWebsocket from '@/hooks/useParticipantWebsocket';
import { useCallback, useState } from 'react';

import { CloseRoomDialog } from '@/components/CloseRoomDialog';
import CodeExecutionView from '@/components/CodeExecutionView';
import ParticipantView from '@/components/ParticipantView';
import QuestionView from '@/components/QuestionView';
import { RoomClosedDialog } from '@/components/RoomClosedDialog';
import { RoomUnavailableView } from '@/components/RoomUnavailableView';
import SubmissionView from '@/components/SubmissionView';
import VideoCall from '@/components/VideoCall';
import MonacoEditor, {
  SubmitButton,
} from '@/components/code-editor/MonacoEditor';
import CollaborativeEditor from '@/components/code-editor/collaborative-code-editor';
import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/auth/useAuth';
import useExecuteCode, { CodeExecutionResponse } from '@/hooks/useExecuteCode';
import { useCloseRoom, useRoom } from '@/hooks/useRoom';
import { BACKEND_WEBSOCKET_COLLABORATIVE_EDITOR } from '@/lib/common';
import { Loader2, PlayIcon, Plug, Unplug, VideoIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function RoomRoute() {
  const [editorCode, setEditorCode] = useState<string>(
    '// Write your code here\n'
  );
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { isLoading, data, error } = useRoom(roomId);
  const { mutateAsync: closeRoomMutation, isPending: isClosingRoom } =
    useCloseRoom();

  const room = data;
  const questionId = room?.questionId;

  const [userWhoClosedRoom, setUserWhoClosedRoom] = useState<
    string | undefined
  >(undefined);

  const auth = useAuth();
  const { activeParticipants, isConnected, disconnect } =
    useParticipantWebsocket({
      roomId,
      userId: auth?.user?.userId?.toString(),
      onEnteredRoom: useCallback(
        (userId: string) => {
          if (!room) {
            return;
          }
          const username = room?.participants.find(
            (participant) => participant.userId === userId
          )?.username;
          toast(`User ${username} entered the room`);
        },
        [room]
      ),
      onExitRoom: useCallback(
        (userId: string) => {
          if (!room) {
            return;
          }
          const username = room?.participants.find(
            (participant) => participant.userId === userId
          )?.username;
          toast(`User ${username} exited the room`);
        },
        [room]
      ),
      onReconnected: useCallback(
        (userId: string) => {
          if (!room) {
            return;
          }
          const username = room?.participants.find(
            (participant) => participant.userId === userId
          )?.username;
          toast(`User ${username} reconnected`);
        },
        [room]
      ),
      onDisconnected: useCallback(() => {
        if (!room) {
          return;
        }

        toast('You have been disconnected from the room');
      }, [room]),
      onRoomClosed: useCallback(
        (userIdWhoClosedRoom: string) => {
          const username = room?.participants.find(
            (participant) => participant.userId === userIdWhoClosedRoom
          )?.username;
          setUserWhoClosedRoom(username);
          setTimeout(() => {
            navigate('/');
          }, 5000);
        },
        [room, navigate]
      ),
    });

  const [codeExecutionResponse, setCodeExecutionResponse] = useState<
    CodeExecutionResponse | undefined
  >(undefined);
  const { mutateAsync: executeCodeMutation, isPending: isExecutingCode } =
    useExecuteCode({
      onSuccess: (data) => {
        if (data.error?.includes('Script execution timed out')) {
          toast.error('Your code execution timed out');
        } else {
          toast.success('Your code has been executed successfully');
        }
      },
      onError: (error) => {
        toast.error('Failed to execute your code', {
          description: error.message || 'Please try again',
        });
      },
    });

  const handleExecuteCode = async () => {
    const result = await executeCodeMutation({
      code: editorCode,
      language: 'typescript',
    });
    setCodeExecutionResponse(result);
  };

  const [isVideoCall, setIsVideoCall] = useState(true);

  const [isCloseRoomDialogOpen, setIsCloseRoomDialogOpen] = useState(false);

  if (!roomId) {
    return <div>No room ID</div>;
  }

  if (isLoading) {
    return (
      <div className='w-full h-full px-4 py-2'>
        <Skeleton className='w-full h-full' />
      </div>
    );
  }

  if (error) {
    console.error(error);
    return <RoomUnavailableView />;
  }

  if (!room || !questionId) {
    return <div>No room or question ID</div>;
  }

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

  if (room.status !== 'OPEN') {
    return <RoomUnavailableView />;
  }

  return (
    <div className='border rounded-lg overflow-hidden h-full w-full'>
      <RoomClosedDialog
        username={userWhoClosedRoom ?? ''}
        open={userWhoClosedRoom !== undefined}
      />

      <ResizablePanelGroup direction='horizontal'>
        {/* Tabs Panel */}
        <ResizablePanel defaultSize={30} className='' minSize={30}>
          <Tabs defaultValue='participants'>
            <TabsList className='w-full'>
              <TabsTrigger value='participants' className='flex-1'>
                Participants
              </TabsTrigger>
              <TabsTrigger value='question' className='flex-1'>
                Question
              </TabsTrigger>
              <TabsTrigger value='submissions' className='flex-1'>
                Submissions
              </TabsTrigger>
              <TabsTrigger value='execution' className='flex-1'>
                Execution
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
            <TabsContent value='submissions'>
              <SubmissionView questionId={questionId} />
            </TabsContent>
            <TabsContent value='execution'>
              <CodeExecutionView response={codeExecutionResponse} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />
        {/* Collaborative Editor Panel */}
        <ResizablePanel defaultSize={70}>
          {isConnected ? (
            <CollaborativeEditor
              initialValue={editorCode}
              roomName={roomId}
              websocketUrl={`${BACKEND_WEBSOCKET_COLLABORATIVE_EDITOR}`}
              userName={auth.user.userName}
              onChange={(value: string | undefined) =>
                setEditorCode(value ?? '')
              }
            />
          ) : (
            <MonacoEditor
              questionId={questionId}
              value={editorCode}
              language='typescript'
              onChange={(value: string | undefined) =>
                setEditorCode(value ?? '')
              }
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30 shadow-md px-4 py-2 rounded-lg border bg-white'>
        <Button
          onClick={handleExecuteCode}
          variant={'ghost'}
          disabled={isExecutingCode}
        >
          {isExecutingCode ? (
            <Loader2 className='w-4 h-4 animate-spin mr-2' />
          ) : (
            <PlayIcon className='w-4 h-4 mr-2' />
          )}
          Run
        </Button>
        <SubmitButton questionId={questionId} code={editorCode} />

        {isConnected && (
          <Button variant={'ghost'} onClick={disconnect}>
            <Unplug className='w-4 h-4 mr-2' />
            Disconnect
          </Button>
        )}

        {room.status === 'OPEN' && isConnected && (
          <CloseRoomDialog
            isClosingRoom={isClosingRoom}
            isOpen={isCloseRoomDialogOpen}
            onOpenChange={setIsCloseRoomDialogOpen}
            onConfirm={() => {
              closeRoomMutation(roomId);
              setIsCloseRoomDialogOpen(false);
            }}
          />
        )}

        {!isConnected && (
          <Button
            variant={'ghost'}
            onClick={() => {
              window.location.reload();
            }}
          >
            <Plug className='w-4 h-4 mr-2' />
            Connect
          </Button>
        )}

        {isConnected && (
          <div className='flex items-center gap-2'>
            <Switch checked={isVideoCall} onCheckedChange={setIsVideoCall} />
            <VideoIcon className='h-4 w-4' />
          </div>
        )}
      </div>

      {isConnected && (
        <div className='absolute bottom-4 left-4'>
          <VideoCall showVideo={isVideoCall} />
        </div>
      )}
    </div>
  );
}
