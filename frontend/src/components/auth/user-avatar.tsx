import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

  const username = auth?.user?.userName;
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>{firstLetter}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem style={{ backgroundColor: 'lightgrey' }} disabled>
            {auth?.user?.email}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onProfileClick}>
            <User className='w-4 h-4 mr-2' />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={auth?.logout}>
            <LogOut className='w-4 h-4 mr-2' />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
