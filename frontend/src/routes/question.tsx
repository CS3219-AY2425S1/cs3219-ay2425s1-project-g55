import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import CodeEditor from "@/components/code-editor";
import Question from "@/components/question";
import { useParams } from "react-router-dom";
import { LoginPromptView } from "@/components/discuss/views/LoginPromptView";
import { useAuth } from "@/hooks/auth/useAuth";

export default function QuestionRoute() {
  const { questionId: questionIdString } = useParams<{ questionId: string }>();
  const questionId = Number(questionIdString);

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
