import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import React from "react";

interface LoginPromptProps {
  featureName: string;
  featureUsage: string;
}

export const LoginPromptView: React.FC<LoginPromptProps> = ({
  featureName,
  featureUsage,
}) => {
  const navigate = useNavigate();

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
          <Button onClick={() => navigate("/login")} className="w-full">
            Go to Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
