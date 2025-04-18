"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function PasswordRecoveryForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/recovery/request`, { email });
      setMessage("Recovery email sent! Check your inbox.");
      // Можно через пару секунд редиректить на страницу подтверждения
      setTimeout(() => {
        router.push("/recovery/confirm"); // допустим, отдельная страница для кода
      }, 2000);
    } catch (error: any) {
      setMessage("Failed to send recovery email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Password Recovery</CardTitle>
          <CardDescription>
            Enter your email and we’ll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Recovery Email"}
              </Button>
            </div>

            {message && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {message}
              </p>
            )}

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Remembered your password?{" "}
              <a href="/login" className="underline underline-offset-4">
                Go back to login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
