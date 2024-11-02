import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState, useEffect, ChangeEvent } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
}

const AdminUserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        // Mock data for users
        const mockUsers: User[] = [
            { id: 1, name: 'Alice', email: 'alice@example.com', isAdmin: false },
            { id: 2, name: 'Bob', email: 'bob@example.com', isAdmin: true },
            { id: 3, name: 'Charlie', email: 'charlie@example.com', isAdmin: false },
            { id: 4, name: 'David', email: 'david@example.com', isAdmin: true },
            { id: 5, name: 'Eve', email: 'eve@example.com', isAdmin: false },
            { id: 6, name: 'Frank', email: 'frank@example.com', isAdmin: true },
            { id: 7, name: 'Grace', email: 'grace@example.com', isAdmin: false },
            { id: 8, name: 'Hank', email: 'hank@example.com', isAdmin: true },
            { id: 9, name: 'Ivy', email: 'ivy@example.com', isAdmin: false },
            { id: 10, name: 'Jack', email: 'jack@example.com', isAdmin: true },
        ];
        setUsers(mockUsers);
    }, []);

    const handlePermissionChange = (userId: number, e: ChangeEvent<HTMLSelectElement>) => {
        const isAdmin = e.target.value === 'admin';
        const confirmChange = window.confirm(`Are you sure you want to change admin access for user ID ${userId}?`);
        if (confirmChange) {
            setUsers(users.map(user => user.id === userId ? { ...user, isAdmin } : user));
            // axios.put(`/api/users/${userId}`, { isAdmin })
            //     .then(response => {
            //         alert('User updated successfully');
            //         setUsers(users.map(user => user.id === userId ? response.data : user));
            //     })
            //     .catch(error => console.error('Error updating user:', error));
        }
    };

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
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="font-medium">{user.email}</TableCell>
                                    <TableCell className="font-medium">
                                        <select
                                            value={user.isAdmin ? 'admin' : 'user'}
                                            onChange={(e) => handlePermissionChange(user.id, e)}
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
