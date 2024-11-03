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
import { UserUpdateData, UserUpdateDataSchema } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';

type UserFormProps = {
    onSubmit: SubmitHandler<UserUpdateData>;
    defaultValues?: UserUpdateData;
    action: 'edit';
    user?: Partial<UserUpdateData>;
};

export function UserForm({
    user,
    onSubmit,
}: UserFormProps) {
    const form = useForm<UserUpdateData>({
        resolver: zodResolver(UserUpdateDataSchema),
        defaultValues: {
            id: user?.id,
            name: user?.name || '',
            role: user?.isAdmin ? "Admin" : "User"
        },
    });
    console.log("User:" + JSON.stringify(user))
    const onErrors = (errors: FieldErrors<UserUpdateData>) => {
        console.error(errors);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    onSubmit({ ...data, id: user?.id || '' });
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
