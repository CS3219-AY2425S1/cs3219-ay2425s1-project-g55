import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/auth/useAuth';
import { useUpdateUserRole, useUsers } from '@/hooks/useUsers';
import { User } from '@/types/user';
import { Loader2 } from 'lucide-react';

const AdminUserManagementPage: React.FC = () => {
    const { data: users, isLoading, isError } = useUsers();
    const { mutateAsync: updateRole } = useUpdateUserRole();

    const auth = useAuth();
    const role = auth?.user?.role || '';

    console.log(users); // Debugging line to check the users data

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
                                        <select
                                            value={user.isAdmin ? 'admin' : 'user'}
                                            onChange={(e) => updateRole({ id: user.id.toString(), isAdmin: e.target.value == 'admin' })}
                                            className="px-2 py-1 border border-gray-300 rounded"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
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
