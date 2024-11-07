import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/useAuth';
import { useCreateSubmission } from '@/hooks/useSubmissions';
import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function SubmitButton({
  questionId,
  code,
}: {
  questionId: number;
  code: string;
}) {
  const auth = useAuth();
  const userId = auth?.user?.userId;

  const createSubmission = useCreateSubmission({
    onSuccess: () => {
      toast.success('Your code has been submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit your code', {
        description: error.message || 'Please try again',
      });
    },
  });

  if (!userId) {
    return (
      <LoginPromptView
        featureName={'submit code'}
        featureUsage={'submit your code to the question'}
      />
    );
  }

  const handleSubmit = () => {
    createSubmission.mutate({
      userId: userId,
      questionId: questionId,
      code: code,
      attemptedAt: new Date().toISOString(),
    });
  };

  return (
    <Button
      variant={'outline'}
      disabled={createSubmission.isPending}
      onClick={handleSubmit}
    >
      {createSubmission.isPending ? (
        <Loader2 className='w-4 h-4 animate-spin mr-2' />
      ) : (
        'Submit'
      )}
    </Button>
  );
}

const MonacoEditor = ({
  language,
  value = '// Write your code here\n',
  onChange,
  questionId,
}: {
  language: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  questionId: number;
}) => {
  return (
    <div className='flex flex-col h-full gap-4'>
      <div className='flex-grow'>
        <Editor
          language={language}
          value={value}
          onChange={onChange}
          options={{ 
            formatOnType: true,
            formatOnPaste: true,
            automaticLayout: true }}
        />
      </div>
      <div className='flex justify-end m-4'>
        <SubmitButton questionId={questionId} code={value} />
      </div>
    </div>
  );
};

export default MonacoEditor;
