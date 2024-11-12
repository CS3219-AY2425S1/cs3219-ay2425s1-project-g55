import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, LogOutIcon } from 'lucide-react';

interface CloseRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isClosingRoom: boolean;
}

/**
 * Confirmation dialog to close a room.
 */
export function CloseRoomDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isClosingRoom,
}: CloseRoomDialogProps) {
  return (
    <>
      <Button
        variant='outline'
        onClick={() => onOpenChange(true)}
        disabled={isClosingRoom}
      >
        {isClosingRoom ? (
          <Loader2 className='w-4 h-4 animate-spin mr-2' />
        ) : (
          <LogOutIcon className='w-4 h-4 mr-2' />
        )}
        Close Room
      </Button>

      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will close the room for all participants. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              Close Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
