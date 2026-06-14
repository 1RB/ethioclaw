"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EthioClawBrand } from "~/app/_components/ethioclaw-brand";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authClient } from "~/clients/auth/react";
import { showErrorToast } from "~/components/core/toast-notifications";
import { ArrowRight } from "lucide-react";

interface LoginPageProps {
  firstTime?: boolean;
}

export function LoginPage({ firstTime = false }: LoginPageProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regName, setRegName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      const username = loginUsername.trim();
      if (!username) {
        showErrorToast("Username is required");
        return;
      }
      const result = await authClient.signIn.username({
        username,
        password: loginPassword,
      });
      if (result.error) {
        showErrorToast(result.error.message ?? "Failed to sign in");
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      showErrorToast(err instanceof Error ? err.message : "Network error");
    } finally {
      setPending(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      const email = regEmail.trim().toLowerCase();
      const username = regUsername.trim();
      const name = regName.trim();

      if (!email || !username || !name) {
        showErrorToast("All fields are required");
        return;
      }
      if (username.length < 3) {
        showErrorToast("Username must be at least 3 characters");
        return;
      }
      if (username.includes(" ")) {
        showErrorToast("Username cannot contain spaces");
        return;
      }

      if (regPassword.length < 8) {
        showErrorToast("Password must be at least 8 characters");
        return;
      }

      const result = await authClient.signUp.email({
        email,
        password: regPassword,
        username,
        name,
      });
      if (result.error) {
        showErrorToast(result.error.message ?? "Failed to create account");
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      showErrorToast(err instanceof Error ? err.message : "Network error");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <EthioClawBrand size="lg" logoLink="/" />
        </div>

        <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
          <Tabs defaultValue={firstTime ? "register" : "login"}>
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Sign in
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Create account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-5">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-username" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Username
                  </Label>
                  <Input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={pending}
                >
                  {pending ? "Signing in..." : "Sign in"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-5">
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="space-y-2">
                  <Label htmlFor="reg-name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-username" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Username
                  </Label>
                  <Input
                    id="reg-username"
                    type="text"
                    autoComplete="username"
                    required
                    minLength={3}
                    maxLength={30}
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Password
                  </Label>
                  <Input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={pending}
                >
                  {pending ? "Creating account..." : "Create account"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Back to home
          </Link>
          <span className="text-border">&middot;</span>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <span className="text-border">&middot;</span>
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
