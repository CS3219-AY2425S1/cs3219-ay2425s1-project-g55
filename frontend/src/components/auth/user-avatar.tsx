import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/auth/useAuth';
import { LogOut, User } from 'lucide-react';

export function UserMenuAvatar({
  onProfileClick,
}: {
  onProfileClick: () => void;
}) {
  const auth = useAuth();

  if (!auth?.user) {
    return null;
  }

  const { email, userName, role } = auth.user;
  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>{firstLetter}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 py-4'>
          <DropdownMenuLabel className='text-base'>
            <div className='flex flex-col gap-2 pb-4'>
              <Badge variant='outline' className='w-min rounded-md'>
                {role.toUpperCase()}
              </Badge>
              <div className='flex flex-col gap-1 pl-1'>
                <div className='text-md'>{userName}</div>
                <div className='text-sm text-muted-foreground font-normal'>
                  {email}
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onProfileClick}>
            <User className='w-4 h-4 mr-2' />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={auth?.logout}>
            <LogOut className='w-4 h-4 mr-2' />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
