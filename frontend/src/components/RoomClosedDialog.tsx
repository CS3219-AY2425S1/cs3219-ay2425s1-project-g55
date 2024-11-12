import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

interface RoomClosedDialogProps {
  username: string;
  open: boolean;
}

/**
 * Dialog that is shown when a room is closed.
 */
export const RoomClosedDialog: React.FC<RoomClosedDialogProps> = ({
  username,
  open,
}) => (
  <Dialog open={open}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Room Closed</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Room Permanently Closed</AlertTitle>
          <AlertDescription>
            <span className="font-bold">{username}</span> has permanently closed this room.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground text-center">
          You can no longer collaborate in this room. Please return to the home
          page to find another match.
          You will be redirected to the home page shortly.
        </p>
        <Button asChild className="w-full group">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Return Home 
          </Link>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
); 