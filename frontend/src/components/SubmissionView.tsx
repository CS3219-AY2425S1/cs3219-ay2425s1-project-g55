import { useAuth } from '@/hooks/auth/useAuth';
import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';
import { SubmissionsTable } from '@/components/submissions/SubmissionsTable';

export default function SubmissionView({ questionId }: { questionId: number }) {
  const auth = useAuth();
  const userId = auth?.user?.userId;

  if (!userId) {
    return (
      <LoginPromptView
        featureName="submission"
        featureUsage="view your submissions"
      />
    );
  }

  return (
    <SubmissionsTable
      userId={userId}
      questionId={questionId}
      visibleColumns={{
        id: true,
        attemptedAt: true,
        actions: true,
      }}
    />
  );
}
