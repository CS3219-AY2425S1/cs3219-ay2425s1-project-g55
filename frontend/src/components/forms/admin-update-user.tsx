import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

// Define the schema for user data
const updateUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    // password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['Admin', 'User']),
});

type UpdateUserData = z.infer<typeof updateUserSchema>;

type UserFormProps = {
    onSubmit: SubmitHandler<UpdateUserData>;
    defaultValues?: UpdateUserData;
    action: 'edit';
    user?: Partial<UpdateUserData>;
};

const formDefaultValues: UpdateUserData = {
    name: '',
    // password: '',
    role: 'User',
};

export function UserForm({
    user,
    onSubmit,
    defaultValues = formDefaultValues,
}: UserFormProps) {
    const form = useForm<UpdateUserData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: user?.name || '',
            // password: user?.password || '',
            role: user?.isAdmin ? 'Admin' : 'User',
        },
    });

    const onErrors = (errors: FieldErrors<UpdateUserData>) => {
        console.error(errors);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    onSubmit({ ...data, id: user?.id });
                }, onErrors)}
                className='space-y-4'
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Enter name'
                                    disabled={form.formState.isSubmitting}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type='password'
                                    placeholder='Enter password'
                                    disabled={form.formState.isSubmitting}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    disabled={form.formState.isSubmitting}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select a role' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Admin'>Admin</SelectItem>
                                        <SelectItem value='User'>User</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    className='w-full'
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting && (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    )}
                    {form.formState.isSubmitting
                        ? 'Submitting...'
                        : 'Update'}
                </Button>
            </form>
        </Form>
    );
}

type UserDialogProps = {
    open: boolean;
    onClose: () => void;
} & UserFormProps;

export function UserDialog({
    open,
    onClose,
    onSubmit,
    action,
    defaultValues,
    user
}: UserDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        Edit User
                    </DialogTitle>
                    <DialogDescription>
                        Edit the existing user
                    </DialogDescription>
                </DialogHeader>
                <UserForm
                    user={user}
                    action={action}
                    defaultValues={defaultValues}
                    onSubmit={async (data) => {
                        await onSubmit(data);
                        onClose();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
