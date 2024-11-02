import { useAuth } from '@/hooks/auth/useAuth';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LoginPromptView } from './discuss/views/LoginPromptView';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useState } from 'react';

interface SubmissionViewProps {
  id: number;
  onViewSubmission: (code: string) => void;
}

export default function SubmissionView({
  id: questionId,
  onViewSubmission,
}: SubmissionViewProps) {
  const auth = useAuth();
  const userId = auth?.user?.userId;

  if (!userId) {
    return <LoginPromptView />;
  }

  return (
    <SubmissionTable
      userId={userId}
      questionId={questionId}
      onViewSubmission={onViewSubmission}
    />
  );
}
function SubmissionTable({
  userId,
  questionId,
  onViewSubmission,
}: {
  userId: number;
  questionId: number;
  onViewSubmission: (code: string) => void;
}) {
  const { data: submissions, isLoading } = useSubmissions(userId, questionId);
  const [activeSubmissionId, setActiveSubmissionId] = useState<number | null>(
    null
  );

  const handleViewSubmission = (code: string, submissionId: number) => {
    onViewSubmission(code);
    setActiveSubmissionId(submissionId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-2">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="max-h-[70vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission ID</TableHead>
                <TableHead>Attempted Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions && submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500">
                    No submissions yet
                  </TableCell>
                </TableRow>
              ) : (
                submissions?.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className={`${
                      activeSubmissionId === submission.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <TableCell>{submission.id}</TableCell>
                    <TableCell>{submission.attemptedAt}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleViewSubmission(submission.code, submission.id)
                        }
                        variant="link"
                        size="sm"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
