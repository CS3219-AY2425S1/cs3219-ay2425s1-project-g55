import { useState } from 'react';
import { useQuestion } from '@/hooks/useQuestion';
import { useAllSubmissions, useSubmissions } from '@/hooks/useSubmissions';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Submission } from '@/types/submission';
import { Copy } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-2">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Submissions</h1>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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