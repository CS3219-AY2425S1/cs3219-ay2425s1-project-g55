import { UserDialog } from '@/components/forms/admin-update-user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/auth/useAuth';
import { useUpdateUser, useUsers } from '@/hooks/useUsers';
import { User, UserUpdateData } from '@/types/user';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const AdminUserManagementPage: React.FC = () => {
    const { data: users, isLoading, isError } = useUsers();
    const { mutateAsync: updateUser } = useUpdateUser();
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const auth = useAuth();
    const role = auth?.user?.role || '';

    const onSubmit = async (data: UserUpdateData) => {
        try {
            await updateUser(data);
            toast.success("User Profile updated successfully for " + data.name);
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error(`${errorMessage}`, {
                style: { backgroundColor: '#FFCCCB', color: 'black' },
            });
        }
    };

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
            <p className="mt-2 text-red-500">Failed to load users. Please try again later.</p>
          </div>
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
                    <TableHead className="w-[40%]">Username</TableHead>
                    <TableHead className="w-[40%]">Email</TableHead>
                    <TableHead className="w-[20%]">Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users && users.map((user: User) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell className="font-medium">
                        <button
                            onClick={() => {
                                setSelectedUser(user);
                                setOpen(true);
                            }}
                            className="px-2 py-1 border border-gray-300 rounded bg-blue-500 text-white"
                        >
                            Edit
                        </button>
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
