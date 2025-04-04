// src/pages/ApprovalConfirmation.tsx
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

const ApprovalConfirmation = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();

  const isApproved = status === "approved";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className={isApproved ? "bg-green-50" : "bg-red-50"}>
          <CardTitle className="text-2xl flex items-center gap-2">
            {isApproved ? (
              <>
                <CheckCircle className="text-green-600" />
                <span>Approval Submitted</span>
              </>
            ) : (
              <>
                <CheckCircle className="text-green-600" />
                <span>Feedback Submitted</span>
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <p className="text-center text-lg mb-4">
            {isApproved
              ? "Thank you for approving this translation. The document has been marked as approved."
              : "Thank you for your feedback. The translation will be revised based on your comments."}
          </p>

          <p className="text-center text-muted-foreground">
            {isApproved
              ? "The document is now ready for use."
              : "The translator will make the necessary changes and resubmit for approval."}
          </p>
        </CardContent>

        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button onClick={() => window.close()} className="w-full max-w-xs">
            Close Window
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApprovalConfirmation;
