import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordRecoveryForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Send Recovery Email
              </Button>
            </div>

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
  )
}
