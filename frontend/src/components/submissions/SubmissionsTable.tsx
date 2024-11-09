import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuestion } from '@/hooks/useQuestion';
import { useAllSubmissions, useSubmissions } from '@/hooks/useSubmissions';
import { Submission } from '@/types/submission';
import { Copy, FileX2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type VisibleColumns = {
  id?: boolean;
  title?: boolean;
  categories?: boolean;
  difficulty?: boolean;
  attemptedAt?: boolean;
  actions?: boolean;
};

function SubmissionRow({
  submission,
  visibleColumns,
}: {
  submission: Submission;
  visibleColumns: VisibleColumns;
}) {
  const { data: question } = useQuestion(submission.questionId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(submission.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <TableRow>
        {visibleColumns.id && (
          <TableCell className="font-medium">{submission.id}</TableCell>
        )}
        {visibleColumns.title && (
          <TableCell className="font-medium">
            <Link
              to={`/problems/${question?.id}`}
              className="text-blue-600 hover:underline"
            >
              {question?.title}
            </Link>
          </TableCell>
        )}
        {visibleColumns.categories && (
          <TableCell>
            {question?.categories.map((category: string, index: number) => (
              <Badge key={index} variant="outline" className="mr-1">
                {category}
              </Badge>
            ))}
          </TableCell>
        )}
        {visibleColumns.difficulty && (
          <TableCell>
            {question && (
              <Badge
                variant="outline"
                className="font-medium"
                difficulty={
                  question.difficulty.toLowerCase() as
                    | 'easy'
                    | 'medium'
                    | 'hard'
                }
              >
                {question.difficulty}
              </Badge>
            )}
          </TableCell>
        )}
        {visibleColumns.attemptedAt && (
          <TableCell>{submission.attemptedAt}</TableCell>
        )}
        {visibleColumns.actions && (
          <TableCell>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="link"
              size="sm"
            >
              View Code
            </Button>
          </TableCell>
        )}
      </TableRow>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{question?.title || 'Loading...'}</DialogTitle>
            <DialogDescription>
              Submitted on {submission.attemptedAt}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto relative">
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <pre className="bg-gray-100 p-4 rounded-lg">
              <code>{submission.code}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SubmissionsTable({
  userId,
  questionId,
  visibleColumns = {
    id: true,
    title: true,
    categories: true,
    difficulty: true,
    attemptedAt: true,
    actions: true,
  },
}: {
  userId: number;
  questionId?: number;
  visibleColumns?: VisibleColumns;
}) {
  const { data: submissions, isLoading } = questionId
    ? useSubmissions(userId, questionId)
    : useAllSubmissions(userId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-2">
        <Skeleton className="mt-2 w-full h-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Submissions</h1>
      </div>
      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <div className="max-h-[70vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.id && (
                  <TableHead className="w-[10%]">ID</TableHead>
                )}
                {visibleColumns.title && (
                  <TableHead className="w-[20%]">Title</TableHead>
                )}
                {visibleColumns.categories && (
                  <TableHead className="w-[25%]">Categories</TableHead>
                )}
                {visibleColumns.difficulty && (
                  <TableHead className="w-[15%]">Difficulty</TableHead>
                )}
                {visibleColumns.attemptedAt && (
                  <TableHead className="w-[20%]">Attempted At</TableHead>
                )}
                {visibleColumns.actions && (
                  <TableHead className="w-[10%]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={Object.keys(visibleColumns).length}
                    className="text-center text-muted-foreground h-80"
                  >
                    <FileX2 className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    No submissions found. <br /> Submit your code to see your results.
                  </TableCell>
                </TableRow>
              )}

              {submissions?.map((submission) => (
                <SubmissionRow
                  key={submission.id}
                  submission={submission}
                  visibleColumns={visibleColumns}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}