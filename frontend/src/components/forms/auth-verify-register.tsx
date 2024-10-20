import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { VerifyUser, VerifyUserCode, VerifyUserCodeSchema } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const formDefaultValues: VerifyUser = {
  email: '',
  verificationCode: '',
};

type AuthVerifyRegisterFormProps = {
  onSubmit: SubmitHandler<VerifyUserCode>;
  onResendVerificationCode: () => Promise<void>;
  /**
   * The timestamp when the verification code was sent.
   */
  initialCodeSentAt: number;
};

const DEFAULT_RESEND_COOLDOWN_SECONDS = 5;

export default function AuthVerifyRegisterForm({
  onSubmit,
  onResendVerificationCode,
  initialCodeSentAt,
}: AuthVerifyRegisterFormProps) {
  const form = useForm({
    resolver: zodResolver(VerifyUserCodeSchema),
    defaultValues: formDefaultValues,
  });

  const [resendCooldown, setResendCooldown] = useState(
    DEFAULT_RESEND_COOLDOWN_SECONDS
  );
  const [isResending, setIsResending] = useState(false);
  const canResend = resendCooldown <= 0;

  useEffect(() => {
    const elapsedTime = Math.floor((Date.now() - initialCodeSentAt) / 1000);
    if (elapsedTime >= DEFAULT_RESEND_COOLDOWN_SECONDS) {
      setResendCooldown(0);
    } else {
      setResendCooldown(DEFAULT_RESEND_COOLDOWN_SECONDS - elapsedTime);
    }

    const cooldownTimer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - initialCodeSentAt) / 1000);
      if (elapsedTime >= DEFAULT_RESEND_COOLDOWN_SECONDS) {
        setResendCooldown(0);
        clearInterval(cooldownTimer);
      } else {
        setResendCooldown(DEFAULT_RESEND_COOLDOWN_SECONDS - elapsedTime);
      }
    }, 1000);

    return () => clearInterval(cooldownTimer);
  }, [initialCodeSentAt]);

  const handleResendCode = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsResending(true);
    await onResendVerificationCode();
    setIsResending(false);
    setResendCooldown(DEFAULT_RESEND_COOLDOWN_SECONDS);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='verificationCode'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base'>Verification Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the verification code sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            variant='outline'
            type='button'
            onClick={handleResendCode}
            disabled={!canResend || isResending}
          >
            {isResending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Resending...
              </>
            ) : canResend ? (
              'Resend Code'
            ) : (
              `Resend Code in ${resendCooldown}s`
            )}
          </Button>

          <Button type='submit'>
            {form.formState.isSubmitting ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              'Submit'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
