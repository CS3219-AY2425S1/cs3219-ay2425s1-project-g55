import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import CodeEditor from '@/components/code-editor';
import QuestionView from '@/components/QuestionView';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubmissionView from '@/components/SubmissionView';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCreateSubmission } from '@/hooks/useSubmissions';
import { useAuth } from '@/hooks/auth/useAuth';
import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';

function SubmitButton({ 
  questionId, 
  code 
}: { 
  questionId: number;
  code: string;
}) {
  const auth = useAuth();
  const userId = auth?.user?.userId;

  const createSubmission = useCreateSubmission();
  
    if (!userId) {
      return <LoginPromptView featureName={""} featureUsage={""} />;
    }

  const handleSubmit = () => {    
    createSubmission.mutate({
      id: 0,
      userId: userId.toString(),
      questionId: questionId.toString(),
      code: code,
      attemptedAt: new Date().toISOString(),
    });
  };

  return (
    <Button 
      className="absolute bottom-4 right-4 z-10"
      onClick={handleSubmit}
    >
      Submit
    </Button>
  );
}

export default function QuestionRoute() {
  const { questionId: questionIdString } = useParams<{ questionId: string }>();
  const questionId = Number(questionIdString);
  const [editorCode, setEditorCode] = useState<string>('// Write your code here\n');

  const auth = useAuth();
  const userId = auth?.user?.userId;

  if (isNaN(questionId)) {
    return <div>Invalid question ID</div>;
  }

  // If user is not logged in, show the login prompt
  if (!userId) {
    return (
      <div className="container mx-auto p-4">
        <LoginPromptView
          featureName="code editor"
          featureUsage="view and solve each question in detail"
        />
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 border rounded-lg overflow-hidden w-full h-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40}>
          <Tabs defaultValue="question">
            <TabsList className="w-full">
              <TabsTrigger value="question" className="flex-1">
                Question
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex-1">
                Submissions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="question">
              <QuestionView id={questionId} />
            </TabsContent>
            <TabsContent value="submissions">
              <SubmissionView 
                id={questionId} 
                onViewSubmission={setEditorCode}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="relative h-full">
            <CodeEditor
              value={editorCode}
              onChange={(value: string) => setEditorCode(value)}
            />
            <SubmitButton
              questionId={questionId}
              code={editorCode}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
