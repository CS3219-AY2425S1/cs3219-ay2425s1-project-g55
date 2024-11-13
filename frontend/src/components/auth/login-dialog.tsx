import { AuthLoginForm } from "@/components/forms/auth-login";
import { AuthRegisterForm } from "@/components/forms/auth-register";
import AuthVerifyRegisterForm from "@/components/forms/auth-verify-register";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { UnverifiedAccountError, useLogin } from "@/hooks/auth/useLogin";
import {
  RegisterEmailAlreadyExistsError,
  RegisterUsernameAlreadyTakenError,
  useRegister,
} from "@/hooks/auth/useRegister";
import {
  useResetPassword,
  InvalidResetCodeError,
} from "@/hooks/auth/useResetPassword";
import {
  useResendVerificationCode,
  useVerifySignup,
  VerificationCodeExpiredError,
  VerificationCodeInvalidError,
} from "@/hooks/auth/useVerify";
import {
  ForgotPasswordData,
  LoginUser,
  RegisterUser,
  ResetPasswordData,
  VerifyUserCode,
} from "@/types/auth";
import { useState } from "react";
import { toast } from "sonner";
import { AuthResetPasswordForm } from "../forms/auth-reset-password";
import { AuthForgotPasswordForm } from "../forms/auth-forgot-password";

interface LoginDialogProps {
  isControlled?: boolean;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginDialog({
  isControlled = false,
  isOpen,
  setIsOpen,
}: LoginDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeView, setActiveView] = useState<
    "login" | "signup" | "verify" | "forgotPassword" | "resetPassword"
  >("signup");
  const [emailForPasswordReset, setEmailForPasswordReset] = useState<
    string | null
  >(null);
  const [isUserAwaitingEmailVerification, setIsUserAwaitingEmailVerification] =
    useState<LoginUser | null>(null);
  const [initialCodeSentAt, setInitialCodeSentAt] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("signup");

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const verifySignupMutation = useVerifySignup();
  const resendVerificationCodeMutation = useResendVerificationCode();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const handleOpenChange = (open: boolean) => {
    if (isControlled && setIsOpen) {
      setIsOpen(open);
    } else {
      setInternalOpen(open);
    }
  };

  const handleLogin = async (data: LoginUser) => {
    try {
      await loginMutation.mutateAsync(data);
      setInternalOpen(false);
      toast.success("Login successful");
      // Refresh the page after successful login
      window.location.reload();
    } catch (error) {
      if (error instanceof UnverifiedAccountError) {
        setIsUserAwaitingEmailVerification({
          email: data.email,
          password: data.password,
        });
        setInitialCodeSentAt(Date.now());
        setActiveView("verify");
      } else {
        console.error("Login failed:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error("Login failed: " + errorMessage);
      }
    }
  };

  const handleSignup = async (data: RegisterUser) => {
    try {
      await registerMutation.mutateAsync(data);
      toast.success("Signup successful");
      setIsUserAwaitingEmailVerification({
        email: data.email,
        password: data.password,
      });
      setInitialCodeSentAt(Date.now());
      setActiveView("verify");
    } catch (error) {
      if (error instanceof RegisterUsernameAlreadyTakenError) {
        toast.error("Username already taken");
      } else if (error instanceof RegisterEmailAlreadyExistsError) {
        toast.error("Email already exists");
      } else {
        console.error("Signup failed:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error("Signup failed: " + errorMessage);
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
      toast.success("Email verified.");
      handleLogin({
        email: isUserAwaitingEmailVerification.email,
        password: isUserAwaitingEmailVerification.password,
      });
    } catch (error) {
      if (error instanceof VerificationCodeInvalidError) {
        toast.error("Invalid verification code");
      } else if (error instanceof VerificationCodeExpiredError) {
        toast.info("Verification code expired");
      } else {
        console.error("Verify signup failed:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error("Verify signup failed: " + errorMessage);
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
      toast.success("Verification code resent");
    } catch (error) {
      console.error("Resend verification code failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Resend verification code failed: " + errorMessage);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setEmailForPasswordReset(data.email);
      toast.success("Password reset code sent to your email");
      setActiveView("resetPassword");
    } catch (error) {
      console.error("Forgot password failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to send password reset code: " + errorMessage);
    }
  };

  const handleResetPassword = async (data: ResetPasswordData) => {
    if (!emailForPasswordReset) return;

    try {
      await resetPasswordMutation.mutateAsync({
        email: emailForPasswordReset,
        resetCode: data.resetCode,
        newPassword: data.newPassword,
      });
      toast.success(
        "Password reset successfully. Please log in with your new password."
      );
      setActiveView("login");
    } catch (error) {
      if (error instanceof InvalidResetCodeError) {
        toast.error("Invalid or Expired reset code");
      } else {
        console.error("Reset password failed:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error("Reset password failed: " + errorMessage);
      }
    }
  };

  return (
    <Dialog
      open={isControlled ? isOpen : internalOpen}
      onOpenChange={handleOpenChange}
    >
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="outline">Login / Sign Up</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            {activeView === "verify"
              ? `Enter the verification code sent to your email.`
              : activeView === "forgotPassword"
              ? "Enter your email to reset your password."
              : activeView === "resetPassword"
              ? "Enter your reset code and new password."
              : "Login or create a new account to get started."}
          </DialogDescription>
        </DialogHeader>
        {activeView === "verify" ? (
          <AuthVerifyRegisterForm
            onSubmit={handleVerifySignup}
            onResendVerificationCode={handleResendVerificationCode}
            initialCodeSentAt={initialCodeSentAt ?? 0}
          />
        ) : activeView === "forgotPassword" ? (
          <AuthForgotPasswordForm
            onSubmit={handleForgotPassword}
            onBack={() => setActiveView("login")}
          />
        ) : activeView === "resetPassword" ? (
          <AuthResetPasswordForm
            email={emailForPasswordReset || ""}
            onSubmit={handleResetPassword}
            onBack={() => setActiveView("login")}
          />
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
              <AuthRegisterForm onSubmit={handleSignup} />
            </TabsContent>
            <TabsContent value="login">
              <AuthLoginForm
                onSubmit={handleLogin}
                onForgotPassword={() => setActiveView("forgotPassword")}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
