import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm, FieldErrors, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ChangePasswordData, ChangePasswordSchema } from "@/types/auth";
import { useChangePassword } from "@/hooks/auth/useChangePassword";

type ChangePasswordDialogProps = {
  open: boolean;
  onClose: () => void;
  userId: number;
};

export function ChangePasswordDialog({
  open,
  onClose,
  userId,
}: ChangePasswordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const { mutateAsync: changePassword } = useChangePassword();

  const onSubmit: SubmitHandler<ChangePasswordData> = async (data) => {
    setIsSubmitting(true);
    try {
      const oldPassword = data.oldPassword;
      const newPassword = data.newPassword;
      await changePassword({ userId, oldPassword, newPassword });
      toast.success("Password change successfully");
      onClose();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error("Failed to change password: " + error.message);
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onErrors = (errors: FieldErrors<ChangePasswordData>) => {
    console.error(errors);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter a new password for your account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onErrors)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter old password"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isSubmitting ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
