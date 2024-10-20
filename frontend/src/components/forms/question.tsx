import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CATEGORY_ENUM,
  CreateQuestionData,
  createQuestionSchema,
} from '@/types/question';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Trash } from 'lucide-react';
import {
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';

type QuestionFormProps = {
  onSubmit: SubmitHandler<CreateQuestionData>;
  defaultValues?: CreateQuestionData;
  action: 'create' | 'edit';
};

const formDefaultValues: CreateQuestionData = {
  title: '',
  description: '',
  examples: [{ input: '', output: '' }],
  constraints: [],
  categories: [],
  difficulty: 'Easy',
  link: '',
};

export function QuestionForm({
  onSubmit,
  defaultValues = formDefaultValues,
  action = 'create',
}: QuestionFormProps) {
  const form = useForm<CreateQuestionData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: structuredClone(defaultValues),
  });

  const examplesControl = useFieldArray({
    control: form.control,
    name: 'examples',
  });

  const constraintsControl = useFieldArray({
    control: form.control,
    name: 'constraints',
  });

  const categoriesControl = useFieldArray({
    control: form.control,
    name: 'categories',
  });

  const onErrors = (errors: FieldErrors<CreateQuestionData>) => {
    console.error(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onErrors)}
        className='space-y-4'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='E.g. Two Sum'
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe the problem...'
                  rows={6}
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {examplesControl.fields.map((field, index) => (
          <div key={field.id} className='flex flex-col gap-2'>
            <div className='text-sm font-medium'>Example {index + 1}</div>
            <div className='flex gap-2'>
              <FormField
                control={form.control}
                name={`examples.${index}.input`}
                render={({ field }) => (
                  <FormItem className='flex-grow'>
                    <FormControl>
                      <Input
                        placeholder='Input'
                        className='w-full'
                        disabled={
                          form.formState.isSubmitting || action === 'edit'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {examplesControl.fields.length > 1 && (
                <Button
                  variant='secondary'
                  size='icon'
                  type='button'
                  onClick={() => examplesControl.remove(index)}
                  className='flex-shrink-0'
                  disabled={form.formState.isSubmitting || action === 'edit'}
                >
                  <Trash className='w-4 h-4' />
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name={`examples.${index}.output`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Output'
                      {...field}
                      disabled={
                        form.formState.isSubmitting || action === 'edit'
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          variant='secondary'
          size='sm'
          type='button'
          onClick={() => examplesControl.append({ input: '', output: '' })}
          disabled={form.formState.isSubmitting || action === 'edit'}
        >
          Add Example
        </Button>

        {/* Constraints */}
        {constraintsControl.fields.length == 0 && (
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-medium'>Constraints</p>
            <p className='text-sm text-gray-500'>No constraints added</p>
          </div>
        )}

        {constraintsControl.fields.map((field, index) => (
          <FormItem key={field.id}>
            <FormLabel>Constraint {index + 1}</FormLabel>
            <div className='flex gap-2'>
              <FormField
                control={form.control}
                name={`constraints.${index}.constraint`}
                render={({ field }) => (
                  <FormItem className='flex-grow'>
                    <FormControl>
                      <Input
                        placeholder='Input'
                        className='w-full'
                        disabled={
                          form.formState.isSubmitting || action === 'edit'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant='secondary'
                size='icon'
                type='button'
                className='flex-shrink-0'
                onClick={() => constraintsControl.remove(index)}
                disabled={form.formState.isSubmitting || action === 'edit'}
              >
                <Trash className='w-4 h-4' />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        ))}
        <Button
          variant='secondary'
          size='sm'
          type='button'
          onClick={() => constraintsControl.append({ constraint: '' })}
          disabled={form.formState.isSubmitting || action === 'edit'}
        >
          Add Constraint
        </Button>

        {/* Categories */}
        {categoriesControl.fields.length == 0 && (
          <div className='flex flex-col gap-2'>
            <p className='text-sm font-medium'>Categories</p>
            <p className='text-sm text-gray-500'>No categories added</p>
          </div>
        )}

        {categoriesControl.fields.map((field, index) => (
          <FormItem className='flex-grow'>
            <FormLabel>Category {index + 1}</FormLabel>
            <div key={field.id} className='flex gap-2'>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    categoriesControl.update(index, {
                      category: value,
                    });
                  }}
                  value={field.category}
                  disabled={form.formState.isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_ENUM.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <Button
                variant='secondary'
                size='icon'
                type='button'
                className='flex-shrink-0'
                onClick={() => categoriesControl.remove(index)}
                disabled={form.formState.isSubmitting}
              >
                <Trash className='w-4 h-4' />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        ))}
        <Button
          variant='secondary'
          size='sm'
          type='button'
          onClick={() => categoriesControl.append({ category: '' })}
          disabled={form.formState.isSubmitting}
        >
          Add Category
        </Button>

        <FormField
          control={form.control}
          name='difficulty'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  disabled={form.formState.isSubmitting}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a difficulty' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Easy'>Easy</SelectItem>
                    <SelectItem value='Medium'>Medium</SelectItem>
                    <SelectItem value='Hard'>Hard</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='link'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link to Leetcode</FormLabel>
              <FormControl>
                <Input
                  disabled={form.formState.isSubmitting}
                  type='url'
                  placeholder='E.g. https://leetcode.com/problems/two-sum/'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={
            form.formState.isSubmitting ||
            !form.formState.isValid ||
            !form.formState.dirtyFields
          }
        >
          {form.formState.isSubmitting && (
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
          )}
          {form.formState.isSubmitting
            ? 'Submitting...'
            : action === 'create'
            ? 'Create'
            : 'Update'}
        </Button>
      </form>
    </Form>
  );
}

type QuestionDialogProps = {
  open: boolean;
  onClose: () => void;
} & QuestionFormProps;

export function QuestionDialog({
  open,
  onClose,
  onSubmit,
  action,
  defaultValues,
}: QuestionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {action === 'create' ? 'Create Question' : 'Edit Question'}
          </DialogTitle>
          <DialogDescription>
            {action === 'create'
              ? 'Create a new question'
              : 'Edit the existing question'}
          </DialogDescription>
        </DialogHeader>
        <QuestionForm
          action={action}
          defaultValues={defaultValues}
          onSubmit={async (data) => {
            await onSubmit(data);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
