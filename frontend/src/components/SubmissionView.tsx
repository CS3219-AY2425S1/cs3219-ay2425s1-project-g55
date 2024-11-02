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
import { LoginPromptView } from './discuss/views/LoginPromptView';
import { useSubmissions } from '@/hooks/useSubmissions';

interface SubmissionViewProps {
  id: number;
}

export default function SubmissionView({ id: questionId }: SubmissionViewProps) {
  const auth = useAuth();
  const userId = auth?.user?.userId;

  if (!userId) {
    return <LoginPromptView />;
  }

  return <SubmissionTable userId={userId} questionId={questionId} />;
}

function SubmissionTable({ userId, questionId }: { userId: number, questionId: number }) {
  const { data: submissions, isLoading } = useSubmissions(userId, questionId);

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <Loader2 className='w-8 h-8 animate-spin' />
        <p className='mt-2'>Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className='p-4'>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <div className='max-h-[70vh] overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission ID</TableHead>
                <TableHead>Attempted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions && submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className='text-center text-gray-500'>
                    No submissions yet
                  </TableCell>
                </TableRow>
              ) : (
                submissions?.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.id}</TableCell>
                    <TableCell>
                      {new Date(submission.attemptedDateTime).toLocaleString()}
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
