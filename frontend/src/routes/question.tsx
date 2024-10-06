import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useDeleteQuestion,
  useQuestion,
  useUpdateQuestion,
} from '@/hooks/useQuestion';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { QuestionDialog } from '@/components/forms/question';
import { useState } from 'react';
import { CreateQuestionData, UpdateQuestionData } from '@/types/question';
import { SubmitHandler } from 'react-hook-form';

export default function QuestionRoute() {
  const { questionId: questionIdString } = useParams<{ questionId: string }>();
  const questionId = Number(questionIdString);
  const { data: question, isLoading } = useQuestion(Number(questionId));
  const { mutateAsync: deleteQuestion } = useDeleteQuestion();
  const { mutateAsync: updateQuestion } = useUpdateQuestion();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const dataForForm = (
    question
      ? {
          title: question.title,
          description: question.description,
          categories: question.categories.map((category) => ({
            category,
          })),
          difficulty: question.difficulty,
          link: question.link,
          examples: question.examples.map((example) => ({
            input: example.input,
            output: example.output,
          })),
          constraints: question.constraints.map((constraint) => ({
            constraint,
          })),
        }
      : undefined
  ) satisfies CreateQuestionData | undefined;

  const onDelete = async () => {
    try {
      await deleteQuestion(questionId);
      toast.success('Question deleted successfully.');
      navigate('/problems');
    } catch (error) {
      console.error(error);
      toast.error('Error deleting question');
    }
  };

  const onEdit: SubmitHandler<CreateQuestionData> = async (data) => {
    const dataForUpdate = {
      id: questionId,
      title: data.title,
      description: data.description,
      categories: data.categories.map((category) => category.category),
      difficulty: data.difficulty,
    } satisfies UpdateQuestionData;

    try {
      await updateQuestion(dataForUpdate);
      toast.success('Question updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error updating question');
    }
  };

  if (isLoading || !question) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <Loader2 className='w-8 h-8 animate-spin' />
        <p className='mt-2'>Loading...</p>
      </div>
    );
  }

  return (
    <Card className='relative w-full max-w-3xl'>
      <CardHeader>
        <CardTitle className='mb-2'>{question.title}</CardTitle>
        <div className=''>
          <Badge
            difficulty={
              question.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'
            }
          >
            {question.difficulty}
          </Badge>
          {question.categories.map((category, index) => (
            <Badge key={index} variant='outline' className='ml-2'>
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className='text-lg font-semibold mb-2'>Description</h3>
        <p>{question.description}</p>

        <h3 className='text-lg font-semibold mt-4 mb-2'>Examples</h3>
        {question.examples.map((example, index) => (
          <div key={index} className='mb-2'>
            <p>
              <strong>Input:</strong> {example.input}
            </p>
            <p>
              <strong>Output:</strong> {example.output}
            </p>
          </div>
        ))}

        <h3 className='text-lg font-semibold mt-4 mb-2'>Constraints</h3>
        <ul className='list-disc pl-5'>
          {question.constraints.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>

        <a
          href={question.link}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-4 inline-block text-blue-600 hover:underline'
        >
          View on LeetCode
        </a>

        <div className='absolute bottom-4 right-4'>
          <QuestionDialog
            action='edit'
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={onEdit}
            defaultValues={dataForForm}
          />

          <div className='flex gap-4'>
            <Button
              size='icon'
              variant='secondary'
              onClick={() => setOpen(true)}
            >
              <Edit className='w-4 h-4' />
            </Button>

            {/* Delete question dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size='icon' variant='secondary'>
                  <Trash2 className='w-4 h-4' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the question.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: 'destructive' })}
                    onClick={onDelete}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
