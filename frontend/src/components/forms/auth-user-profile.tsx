import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserUpdateData, UserUpdateDataSchema } from "@/types/user";
import { useAuth } from "@/hooks/auth/useAuth";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateUser } from "@/hooks/useUsers";
import { useEffect, useState } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { ChangePasswordDialog } from "./auth-change-password";

type EditProfileDialogProps = {
  open: boolean;
  onClose: () => void;
  defaultValues?: UserUpdateData;
  action: "edit";
};

export function EditProfileDialog({
  open,
  onClose,
  action,
  defaultValues,
}: EditProfileDialogProps) {
  const auth = useAuth();
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);

  useEffect(() => {
    if (auth?.user?.userId) {
      setUserId(auth.user.userId);
    }
  }, [auth?.user?.userId]);

  const {
    data: user,
    isLoading,
    isError,
  } = useUser(userId as number, {
    enabled: !!userId,
  });

  const { mutateAsync: updateUser } = useUpdateUser();

  const onSubmit = async (data: UserUpdateData) => {
    try {
      await updateUser(data);
      toast.success("User Profile updated successfully for " + data.name);
      onClose();
      // refresh the user data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`${errorMessage}`, {
        style: { backgroundColor: "#FFCCCB", color: "black" },
      });
    }
  };

  if (isChangeDialogOpen) {
    return (
      <ChangePasswordDialog
        open={isChangeDialogOpen}
        onClose={() => {
          setIsChangeDialogOpen(false);
          onClose();
        }}
        userId={userId as number}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Edit your profile information</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="mt-2">Loading...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="mt-2 text-red-500">
              Failed to load profile information. Please try again later.
            </p>
          </div>
        ) : (
          <UserForm
            user={{
              ...user,
              id: user?.id || "",
              name: user?.name || "",
              isAdmin: user?.isAdmin || false,
              role: user?.isAdmin ? "Admin" : "User",
              email: user?.email || "",
            }}
            action={action}
            defaultValues={defaultValues}
            onSubmit={async (data) => {
              await onSubmit(data);
              onClose();
            }}
            onChangePassword={() => setIsChangeDialogOpen(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type UserFormProps = {
  onSubmit: SubmitHandler<UserUpdateData>;
  defaultValues?: UserUpdateData;
  action: "edit";
  user?: UserUpdateData & { email: string };
  onChangePassword: () => void;
};

function UserForm({ user, onSubmit, onChangePassword }: UserFormProps) {
  const form = useForm<UserUpdateData & { email: string }>({
    resolver: zodResolver(UserUpdateDataSchema),
    defaultValues: {
      id: user?.id,
      name: user?.name || "",
      isAdmin: user?.isAdmin,
      role: user?.isAdmin ? "Admin" : "User",
    },
  });
  console.log("User:" + JSON.stringify(user));
  const onErrors = (errors: FieldErrors<UserUpdateData>) => {
    console.error(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          onSubmit({ ...data, id: user?.id || "" });
        }, onErrors)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter name"
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
          name="email"
          render={() => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input value={user?.email || ""} disabled />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={() => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select disabled value={user?.isAdmin ? "Admin" : "User"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 items-center">
          <Button
            type="button"
            variant="outline"
            onClick={onChangePassword}
            disabled={form.formState.isSubmitting}
          >
            Change Password
          </Button>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {form.formState.isSubmitting ? "Submitting..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
