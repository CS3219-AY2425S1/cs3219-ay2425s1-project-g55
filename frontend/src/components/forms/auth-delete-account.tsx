import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/auth/useAuth';
import { useDeleteAccount } from '@/hooks/auth/useDeleteAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const DeleteAccountSchema = z.object({
  confirmation: z.string().refine((val) => val === 'DELETE', {
    message: 'Please type "DELETE" to confirm',
  }),
});

type DeleteAccountData = z.infer<typeof DeleteAccountSchema>;

type DeleteAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  userId: number;
};

export function DeleteAccountDialog({
  open,
  onClose,
  userId,
}: DeleteAccountDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();

  const form = useForm<DeleteAccountData>({
    resolver: zodResolver(DeleteAccountSchema),
  });

  const { mutateAsync: deleteAccount } = useDeleteAccount();

  if (!auth) {
    return null;
  }

  const onSubmit: SubmitHandler<DeleteAccountData> = async () => {
    setIsSubmitting(true);
    try {
      await deleteAccount({ userId });
      toast.success('Account deleted successfully');
      onClose();
      auth.logout();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error('Failed to delete account: ' + error.message);
      } else {
        toast.error('Failed to delete account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onErrors = (errors: FieldErrors<DeleteAccountData>) => {
    console.error(errors);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please type DELETE to confirm.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='confirmation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Type "DELETE" to confirm'
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
              <Button
                type='submit'
                disabled={isSubmitting}
                variant='destructive'
              >
                {isSubmitting && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                {isSubmitting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
