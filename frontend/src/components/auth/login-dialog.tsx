import { AuthLoginForm } from '@/components/forms/auth-login';
import { AuthRegisterForm } from '@/components/forms/auth-register';
import AuthVerifyRegisterForm from '@/components/forms/auth-verify-register';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnverifiedAccountError, useLogin } from '@/hooks/auth/useLogin';
import {
  RegisterEmailAlreadyExistsError,
  RegisterUsernameAlreadyTakenError,
  useRegister,
} from '@/hooks/auth/useRegister';
import {
  useResendVerificationCode,
  useVerifySignup,
  VerificationCodeExpiredError,
  VerificationCodeInvalidError,
} from '@/hooks/auth/useVerify';
import { LoginUser, RegisterUser, VerifyUserCode } from '@/types/auth';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [isUserAwaitingEmailVerification, setIsUserAwaitingEmailVerification] =
    useState<LoginUser | null>(null);

  const verifySignupMutation = useVerifySignup();
  const resendVerificationCodeMutation = useResendVerificationCode();
  const [initialCodeSentAt, setInitialCodeSentAt] = useState<number | null>(
    null
  );

  const handleLogin = async (data: LoginUser) => {
    try {
      await loginMutation.mutateAsync(data);
      setIsOpen(false);
      toast.success('Login successful');
      // Refresh the page after successful login
      window.location.reload();
    } catch (error) {
      if (error instanceof UnverifiedAccountError) {
        setIsUserAwaitingEmailVerification({
          email: data.email,
          password: data.password,
        });
        setInitialCodeSentAt(Date.now());
      } else {
        console.error('Login failed:', error);
        toast.error('Login failed');
      }
    }
  };

  const handleSignup = async (data: RegisterUser) => {
    try {
      await registerMutation.mutateAsync(data);
      toast.success('Signup successful');
      setIsUserAwaitingEmailVerification({
        email: data.email,
        password: data.password,
      });
      setInitialCodeSentAt(Date.now());
    } catch (error) {
      if (error instanceof RegisterUsernameAlreadyTakenError) {
        toast.error('Username already taken');
      } else if (error instanceof RegisterEmailAlreadyExistsError) {
        toast.error('Email already exists');
      } else {
        console.error('Signup failed:', error);
        toast.error('Signup failed');
      }
    }
  };

  const handleVerifySignup = async (data: VerifyUserCode) => {
    if (!isUserAwaitingEmailVerification) return;

    try {
      await verifySignupMutation.mutateAsync({
        email: isUserAwaitingEmailVerification.email,
        verificationCode: data.verificationCode,
      });
      toast.success('Email verified.');
      handleLogin({
        email: isUserAwaitingEmailVerification.email,
        password: isUserAwaitingEmailVerification.password,
      });
    } catch (error) {
      if (error instanceof VerificationCodeInvalidError) {
        toast.error('Invalid verification code');
      } else if (error instanceof VerificationCodeExpiredError) {
        toast.info('Verification code expired');
      } else {
        console.error('Verify signup failed:', error);
        toast.error('Verify signup failed');
      }
    }
  };

  const handleResendVerificationCode = async () => {
    if (!isUserAwaitingEmailVerification) return;

    try {
      await resendVerificationCodeMutation.mutateAsync(
        isUserAwaitingEmailVerification.email
      );
      setInitialCodeSentAt(Date.now());
      toast.success('Verification code resent');
    } catch (error) {
      console.error('Resend verification code failed:', error);
      toast.error('Resend verification code failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Login / Sign Up</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] flex flex-col justify-start'>
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            {isUserAwaitingEmailVerification
              ? `Enter the verification code sent to your email.`
              : 'Login or create a new account to get started.'}
          </DialogDescription>
        </DialogHeader>
        {isUserAwaitingEmailVerification ? (
          <AuthVerifyRegisterForm
            onSubmit={handleVerifySignup}
            onResendVerificationCode={handleResendVerificationCode}
            initialCodeSentAt={initialCodeSentAt ?? 0}
          />
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='h-full'
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='signup'>Sign Up</TabsTrigger>
              <TabsTrigger value='login'>Login</TabsTrigger>
            </TabsList>
            <TabsContent value='signup'>
              <AuthRegisterForm onSubmit={handleSignup} />
            </TabsContent>
            <TabsContent value='login'>
              <AuthLoginForm onSubmit={handleLogin} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
