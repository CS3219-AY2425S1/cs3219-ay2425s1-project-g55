import { QuestionDialog } from '@/components/forms/question';

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
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  useDeleteQuestion,
  useQuestion,
  useUpdateQuestion,
} from '@/hooks/useQuestion';
import { CreateQuestionData, UpdateQuestionData } from '@/types/question';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type QuestionActionsProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  dataForForm: CreateQuestionData | undefined;
  onEdit: SubmitHandler<CreateQuestionData>;
  onDelete: () => void;
};

function QuestionActions({
  open,
  setOpen,
  dataForForm,
  onEdit,
  onDelete,
}: QuestionActionsProps) {
  return (
    <div className='absolute top-1 right-6'>
      <QuestionDialog
        action='edit'
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onEdit}
        defaultValues={dataForForm}
      />

      <div className='flex gap-4'>
        <Button size='icon' variant='secondary' onClick={() => setOpen(true)}>
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
                This action cannot be undone. This will permanently delete the
                question.
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
  );
}

type QuestionProps = {
  id: number;
};

export default function Question({ id }: QuestionProps) {
  const { data: question, isLoading } = useQuestion(id);
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
            example,
          })),
          constraints:
            question.constraints?.map((constraint) => ({
              constraint,
            })) || [],
        }
      : undefined
  ) satisfies CreateQuestionData | undefined;

  const onDelete = async () => {
    try {
      await deleteQuestion(id);
      toast.success('Question deleted successfully.');
      navigate('/problems');
    } catch (error) {
      console.error(error);
      toast.error('Error deleting question');
    }
  };

  const onEdit: SubmitHandler<CreateQuestionData> = async (data) => {
    const dataForUpdate = {
      id,
      title: data.title,
      description: data.description,
      categories: data.categories.map((category) => category.category),
      difficulty: data.difficulty,
      examples: data.examples.map((example) => example.example),
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
    <div className='relative w-full max-w-3xl p-4 space-y-4 h-full overflow-y-auto'>
      <div className='mb-2 text-2xl font-bold'>
        <span className='mr-2'>{question.id + 1}.</span>
        <span>{question.title}</span>
      </div>
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

      <br />

      <p>{question.description}</p>

      <br />

      <section className='space-y-6'>
        {question.examples.map((example, index) => (
          <div key={index} className='mb-2'>
            <p className='font-bold'>Example {index + 1}</p>
            <blockquote className='mt-2 border-l-2 pl-6'>
              <p className='font-mono text-sm whitespace-pre'>{example}</p>
            </blockquote>
          </div>
        ))}
      </section>

      <br />

      {question.constraints && question.constraints.length > 0 && (
        <>
          <div className='text font-bold mt-4 mb-2'>Constraints:</div>
          <ul className='list-disc pl-5'>
            {question.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </>
      )}

      <div className='w-full text-right'>
        <a
          href={question.link}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-block text-blue-600 hover:underline'
        >
          View on LeetCode
        </a>
      </div>

      <QuestionActions
        open={open}
        setOpen={setOpen}
        dataForForm={dataForForm}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
