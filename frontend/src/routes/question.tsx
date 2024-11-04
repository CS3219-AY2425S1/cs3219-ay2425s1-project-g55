import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import MonacoEditor from '@/components/code-editor/MonacoEditor';
import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';
import QuestionView from '@/components/QuestionView';
import SubmissionView from '@/components/SubmissionView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/auth/useAuth';
import useExecuteCode from '@/hooks/useExecuteCode';
import { Loader2, PlayIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function QuestionRoute() {
  const { questionId: questionIdString } = useParams<{ questionId: string }>();
  const questionId = Number(questionIdString);

  const auth = useAuth();
  const userId = auth?.user?.userId;

  const [editorCode, setEditorCode] = useState<string>(
    '// Write your code here\n'
  );

  const { mutateAsync: executeCodeMutation, isPending: isExecutingCode } =
    useExecuteCode({
      onSuccess: () => {
        toast.success('Your code has been executed successfully');
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
      language: 'javascript',
    });
    console.log(result.stdout);
    console.log(result.stderr);
  };

  if (isNaN(questionId)) {
    return <div>Invalid question ID</div>;
  }

  // If user is not logged in, show the login prompt
  if (!userId) {
    return (
      <div className='container mx-auto p-4'>
        <LoginPromptView
          featureName='code editor'
          featureUsage='view and solve each question in detail'
        />
      </div>
    );
  }

  return (
    <div className='mx-4 mb-4 border rounded-lg overflow-hidden w-full h-full'>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={40}>
          <Tabs defaultValue='question'>
            <TabsList className='w-full'>
              <TabsTrigger value='question' className='flex-1'>
                Question
              </TabsTrigger>
              <TabsTrigger value='submissions' className='flex-1'>
                Submissions
              </TabsTrigger>
            </TabsList>
            <TabsContent value='question'>
              <QuestionView id={questionId} />
            </TabsContent>
            <TabsContent value='submissions'>
              <SubmissionView
                id={questionId}
                onViewSubmission={setEditorCode}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <MonacoEditor
            questionId={questionId}
            value={editorCode}
            onChange={(value: string | undefined) => setEditorCode(value ?? '')}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <Button
        onClick={handleExecuteCode}
        variant={'outline'}
        className='absolute top-2 left-1/2 -translate-x-1/2'
      >
        {isExecutingCode ? (
          <Loader2 className='w-4 h-4 animate-spin mr-2' />
        ) : (
          <PlayIcon className='w-4 h-4 mr-2' />
        )}
        Run
      </Button>
    </div>
  );
}
