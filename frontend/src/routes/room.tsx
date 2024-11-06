import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useParticipantWebsocket from '@/hooks/useParticipantWebsocket';
import { useCallback, useState } from 'react';

import CodeExecutionView from '@/components/CodeExecutionView';
import ParticipantView from '@/components/ParticipantView';
import QuestionView from '@/components/QuestionView';
import SubmissionView from '@/components/SubmissionView';
import VideoCall from '@/components/VideoCall';
import MonacoEditor, {
  SubmitButton,
} from '@/components/code-editor/MonacoEditor';
import CollaborativeEditor from '@/components/code-editor/collaborative-code-editor';
import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/auth/useAuth';
import useExecuteCode, { CodeExecutionResponse } from '@/hooks/useExecuteCode';
import { useRoom } from '@/hooks/useRoom';
import { BACKEND_WEBSOCKET_COLLABORATIVE_EDITOR } from '@/lib/common';
import {
  Loader2,
  LogInIcon,
  LogOutIcon,
  PlayIcon,
  VideoIcon,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function RoomRoute() {
  const [editorCode, setEditorCode] = useState<string>(
    '// Write your code here\n'
  );
  const { roomId } = useParams<{ roomId: string }>();
  const { isLoading, data, error } = useRoom(roomId);
  const auth = useAuth();
  const { activeParticipants, isConnected, disconnect } =
    useParticipantWebsocket({
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

        {/* Video Call Panel */}

        {isConnected && (
          <div className='absolute bottom-4 left-4'>
            <VideoCall showVideo={isVideoCall} />
          </div>
        )}
        <ResizableHandle withHandle />

        {/* Collaborative Editor Panel */}
        <ResizablePanel>
          {isConnected ? (
            <CollaborativeEditor
              initialValue={editorCode}
              roomName={roomId}
              websocketUrl={BACKEND_WEBSOCKET_COLLABORATIVE_EDITOR}
              userName={auth.user.userName}
              onChange={(value: string | undefined) =>
                setEditorCode(value ?? '')
              }
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

      <div className='absolute top-2 left-1/2 -translate-x-1/2 flex gap-2'>
        <Button
          onClick={handleExecuteCode}
          variant={'outline'}
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
          <Button variant={'outline'} onClick={disconnect}>
            <LogOutIcon className='w-4 h-4 mr-2' />
            Disconnect
          </Button>
        )}

        {!isConnected && (
          <Button
            variant={'outline'}
            onClick={() => {
              window.location.reload();
            }}
          >
            <LogInIcon className='w-4 h-4 mr-2' />
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
    </div>
  );
}
