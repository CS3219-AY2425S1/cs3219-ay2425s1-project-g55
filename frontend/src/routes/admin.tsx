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
import { Loader2 } from "lucide-react";
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
                    <TableCell className="font-medium">
                      <Button
                        onClick={() => {
                          setSelectedUser({
                            ...user,
                            role: user.isAdmin ? "Admin" : "User",
                          });
                          setOpen(true);
                        }}
                        className="p-2 border border-gray-300 rounded text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM4 12v4h4l10-10-4-4L4 12z" />
                        </svg>
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedDeleteUser(user);
                          setIsDeleteAccountDialogOpen(true);
                        }}
                        className="p-2 m-2 border border-red-500 text-red-500 rounded"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-1 1v1H5a2 2 0 00-2 2v1h14V6a2 2 0 00-2-2h-3V3a1 1 0 00-1-1H9zm6 5H5v9a2 2 0 002 2h6a2 2 0 002-2V7zm-7 3a1 1 0 112 0v5a1 1 0 11-2 0v-5zm4 0a1 1 0 112 0v5a1 1 0 11-2 0v-5z"
                            clipRule="evenodd"
                          />
                        </svg>
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
