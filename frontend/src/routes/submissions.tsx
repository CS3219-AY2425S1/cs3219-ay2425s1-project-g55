import { useAuth } from '@/hooks/auth/useAuth';
import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';
import { SubmissionsTable } from '@/components/submissions/SubmissionsTable';

export default function SubmissionsRoute() {
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

  return <SubmissionsTable userId={userId} />;
}
