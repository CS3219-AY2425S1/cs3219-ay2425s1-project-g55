import { UserDialog } from "@/components/forms/admin-update-user";
import { DeleteAccountDialog } from "@/components/forms/auth-delete-account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAuth } from "@/hooks/auth/useAuth";
import { useUpdateUser, useUsers } from "@/hooks/useUsers";
import { User, UserUpdateData } from "@/types/user";
import { Edit, Loader2, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const AdminUserManagementPage: React.FC = () => {
  const auth = useAuth();
  const role = auth?.user?.role || "";

  const { data: users, isLoading, isError } = useUsers();
  const { mutateAsync: updateUser } = useUpdateUser();
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<User | null>(
    null
  );
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    (User & { role: string }) | null
  >(null);

  const onSubmit = async (data: UserUpdateData) => {
    try {
      if (
        auth &&
        data.id.toString() === auth.user?.userId.toString() &&
        data.isAdmin == false
      ) {
        toast.error("You cannot change your own admin status.", {
          style: { backgroundColor: "#FFCCCB", color: "black" },
        });
        return;
      }
      await updateUser(data);
      toast.success("User Profile updated successfully for " + data.name);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`${errorMessage}`, {
        style: { backgroundColor: "#FFCCCB", color: "black" },
      });
    }
  };

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-lg">Page Not Found</p>
        <Link to="/" className="mt-4 text-blue-500 underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="mt-2 text-red-500">
          Failed to load users. Please try again later.
        </p>
      </div>
    );
  }

  if (isDeleteAccountDialogOpen) {
    return (
      <DeleteAccountDialog
        open={isDeleteAccountDialogOpen}
        onClose={() => setIsDeleteAccountDialogOpen(false)}
        userId={selectedDeleteUser?.id as unknown as number}
        userName={selectedDeleteUser?.name || ""}
        email={selectedDeleteUser?.email || ""}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <UserDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        action="edit"
        user={selectedUser || undefined}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin User Management</h1>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="max-h-[70vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Username</TableHead>
                <TableHead className="w-[30%]">Email</TableHead>
                <TableHead className="w-[20%]">Role</TableHead>
                <TableHead className="w-[20%]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users &&
                users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="font-medium">
                      <Badge
                        variant="outline"
                        className={`font-medium ${
                          user.isAdmin
                            ? "bg-green-200 text-black"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedUser({
                            ...user,
                            role: user.isAdmin ? "Admin" : "User",
                          });
                          setOpen(true);
                        }}
                        size="icon"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedDeleteUser(user);
                          setIsDeleteAccountDialogOpen(true);
                        }}
                        size="icon"
                        variant="destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
