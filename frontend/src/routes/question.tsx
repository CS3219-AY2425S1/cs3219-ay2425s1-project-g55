import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import CodeEditor from '@/components/code-editor';
import Question from '@/components/question';
import { useParams } from 'react-router-dom';

export default function QuestionRoute() {
  const { questionId: questionIdString } = useParams<{ questionId: string }>();
  const questionId = Number(questionIdString);

  if (isNaN(questionId)) {
    return <div>Invalid question ID</div>;
  }

  return (
    <div className='mx-4 mb-4 border rounded-lg overflow-hidden w-full h-full'>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={40}>
          <Question id={questionId} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
