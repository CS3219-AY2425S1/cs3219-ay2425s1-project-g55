import { Form } from '@/components/ui/form';
import { LoginUser, LoginUserSchema } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const formDefaultValues: LoginUser = {
  email: '',
  password: '',
};

type AuthLoginFormProps = {
  onSubmit: SubmitHandler<LoginUser>;
};

export function AuthLoginForm({ onSubmit }: AuthLoginFormProps) {
  const form = useForm<LoginUser>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: formDefaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-4 py-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
