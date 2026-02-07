'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('confirmation_token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMsg("No confirmation token found.");
            return;
        }

        const confirmAccount = async () => {
            try {
                await api.get(`/confirmation?confirmation_token=${token}`);
                setStatus('success');
                toast.success("Account Confirmed", {
                    description: "Your email has been successfully verified.",
                });
            } catch (error: any) {
                console.error("Confirmation error:", error);
                
                if (error.response?.data?.errors?.email) {
                     setStatus('success'); 
                     toast.info("Already Confirmed", {
                        description: "This email was already confirmed. Please log in.",
                     });
                     return;
                }

                setStatus('error');
                setErrorMsg(error.response?.data?.error || "Failed to confirm account. The link may be invalid or expired.");
            }
        };

        confirmAccount();
    }, [token]);

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Verifying your email...</p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">Email Verified!</h1>
                <p className="text-muted-foreground max-w-[300px]">
                    Your account has been successfully confirmed. You can now log in to Laniakea.
                </p>
                <div className="flex gap-4">
                  <Button asChild>
                      <Link href="/login">Go to Login</Link>
                  </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Verification Failed</h1>
            <p className="text-muted-foreground max-w-[300px]">
                {errorMsg}
            </p>
            <Button variant="outline" asChild>
                <Link href="/login">Back to Login</Link>
            </Button>
        </div>
    );
}


export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
       <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-lg shadow-sm border">
          <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationContent />
          </Suspense>
       </div>
    </div>
  );
}
