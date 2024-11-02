import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import CodeEditor from '@/components/code-editor';
import QuestionView from '@/components/QuestionView';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubmissionView from '@/components/SubmissionView';

export default function QuestionRoute() {
  const { questionId: questionIdString } = useParams<{ questionId: string }>();
  const questionId = Number(questionIdString);

  if (isNaN(questionId)) {
    return <div>Invalid question ID</div>;
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
              <SubmissionView id={questionId} />
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
