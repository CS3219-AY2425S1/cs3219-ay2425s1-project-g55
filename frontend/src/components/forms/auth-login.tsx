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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

const formDefaultValues: LoginUser = {
  email: '',
  password: '',
};

type AuthLoginFormProps = {
  onSubmit: SubmitHandler<LoginUser>;
};

export function AuthLoginForm({ onSubmit }: AuthLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

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
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className='h-5 w-5 text-gray-400' />
                        ) : (
                          <Eye className='h-5 w-5 text-gray-400' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
