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
import { LoginPromptView } from '@/components/discuss/views/LoginPromptView';
import { useAllSubmissions } from '@/hooks/useSubmissions';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubmissionsRoute() {
  const auth = useAuth();
  const userId = auth?.user?.userId;

  if (!userId) {
    return <LoginPromptView featureName="submission" featureUsage="view your submissions" />;
  }

  return <AllSubmissionsTable userId={userId} />;
}

function AllSubmissionsTable({ userId }: { userId: number }) {
  const { data: submissions, isLoading } = useAllSubmissions(userId);
  const navigate = useNavigate();
  const [activeSubmissionId, setActiveSubmissionId] = useState<number | null>(null);

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
      <h1 className="text-2xl font-bold mb-4">Your Submissions</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="max-h-[70vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission ID</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Attempted Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions && submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
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
                    <TableCell>{submission.questionTitle}</TableCell>
                    <TableCell>{submission.attemptedAt}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => navigate(`/problems/${submission.questionId}`)}
                        variant="link"
                        size="sm"
                      >
                        View Question
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