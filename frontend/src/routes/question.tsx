import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import MonacoEditor from '@/components/code-editor/MonacoEditor';
import CodeExecutionView from '@/components/CodeExecutionView';
import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';
import QuestionView from '@/components/QuestionView';
import SubmissionView from '@/components/SubmissionView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/auth/useAuth';
import useExecuteCode, { CodeExecutionResponse } from '@/hooks/useExecuteCode';
import { Loader2, PlayIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import LanguageSelector from '@/components/code-editor/language-selector';
import { CODE_SNIPPETS } from '@/lib/consts';

export default function QuestionRoute() {
  const { questionId: questionIdString } = useParams<{ questionId: string }>();
  const questionId = Number(questionIdString);

  const auth = useAuth();
  const userId = auth?.user?.userId;

  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof CODE_SNIPPETS>("typescript");
  const [editorCode, setEditorCode] = useState<string>(
    CODE_SNIPPETS[selectedLanguage] || ''
  );

  useEffect(() => {
    setEditorCode(CODE_SNIPPETS[selectedLanguage] || '');
  }, [selectedLanguage]);

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
      language: selectedLanguage,
    });
    setCodeExecutionResponse(result);
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
    <div className='mx-4 border rounded-lg overflow-hidden w-full h-full'>
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
              <TabsTrigger value='execution' className='flex-1'>
                Execution
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
            <TabsContent value='execution'>
              <CodeExecutionView response={codeExecutionResponse} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel>
          <MonacoEditor
            language={selectedLanguage}
            questionId={questionId}
            value={editorCode}
            onChange={(value: string | undefined) => setEditorCode(value ?? '')}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
      <div className='absolute top-2 left-1/2 -translate-x-1/2 flex space-x-2'>
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
        <LanguageSelector language={selectedLanguage} onSelect={(language: string) => setSelectedLanguage(language as keyof typeof CODE_SNIPPETS)} />
      </div>
    </div>
  );
}
