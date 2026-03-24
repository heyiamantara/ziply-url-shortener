import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="container flex w-full flex-col items-center justify-center -mt-16">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create an account.
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              Fill your details below to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="flex justify-center p-4">Loading form...</div>}>
              <RegisterForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
