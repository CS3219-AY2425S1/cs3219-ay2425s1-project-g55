import { QuestionDialog } from '@/components/forms/question';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCreateQuestion } from '@/hooks/useQuestion';
import { useQuestions } from '@/hooks/useQuestions';
import { CreateQuestionData, Question } from '@/types/question';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function ProblemsRoute() {
  const { data: questions, isLoading } = useQuestions();
  const [open, setOpen] = useState(false);

  const { mutateAsync: createQuestion } = useCreateQuestion();

  const onSubmit = async (data: CreateQuestionData) => {
    try {
      await createQuestion(data);
      toast.success('Question created successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error creating question');
    }
  };

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <Loader2 className='w-8 h-8 animate-spin' />
        <p className='mt-2'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Problem Set</h1>
        <Button onClick={() => setOpen(true)}>Create Question</Button>
        <QuestionDialog
          action='create'
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={onSubmit}
        />
      </div>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <div className='max-h-[70vh] overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[30%]'>Title</TableHead>
                <TableHead className='w-[30%]'>Categories</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className='w-[40%]'>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions &&
                questions.map((question: Question) => (
                  <TableRow key={question.id}>
                    <TableCell className='font-medium'>
                      <Link
                        to={`/problems/${question.id}`}
                        className='text-blue-600 hover:underline'
                      >
                        {question.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {question.categories.map((category, index) => (
                        <Badge key={index} variant='outline' className='mr-1'>
                          {category}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className='font-medium'
                        difficulty={
                          question.difficulty.toLowerCase() as
                            | 'easy'
                            | 'medium'
                            | 'hard'
                        }
                      >
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{`${question.description.substring(
                      0,
                      100
                    )}...`}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
