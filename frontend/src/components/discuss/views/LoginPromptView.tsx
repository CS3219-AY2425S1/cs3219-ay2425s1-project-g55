import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import LoginDialog from "@/components/auth/login-dialog";

interface LoginPromptProps {
  featureName: string;
  featureUsage: string;
}

export const LoginPromptView: React.FC<LoginPromptProps> = ({
  featureName,
  featureUsage,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login Required</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please log in to access the {featureName} feature.
            </AlertDescription>
          </Alert>
          <p className="text-center text-sm text-muted-foreground">
            You need to be logged in to {featureUsage}.
          </p>
          <Button onClick={() => setOpenDialog(true)} className="w-full">
            Go to Login
          </Button>
          {openDialog && (
            <LoginDialog
              isControlled
              isOpen={openDialog}
              setIsOpen={setOpenDialog}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
