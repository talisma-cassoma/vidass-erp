"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Icons } from "@/components/ui/icons";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MailIcon, LockIcon } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type Step = "email" | "otp";

export function LoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Connexion Google (Better Auth)
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Something went wrong with Google sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion Email + Mot de passe (Better Auth)
  const loginWithPassword = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Login successful.");
    } catch (error) {
      toast.error("Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Envoi du code OTP (Better Auth)
  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      if (error) {
        toast.error(error.message || "Failed to send verification code.");
        return;
      }
      setStep("otp");
      toast.success("Verification code sent to your email.");
    } catch (error) {
      toast.error("Failed to send verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Vérification du code OTP (Better Auth)
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp,
      });
      if (error) {
        toast.error(error.message || "Invalid or expired code.");
        return;
      }
      toast.success("Login successful.");
      window.location.href = "/";
    } catch (error) {
      toast.error("Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg my-5 max-w-md mx-auto">
      <CardHeader className="gap-6">
        <CardTitle>Login</CardTitle>
        <CardDescription>Choose your preferred sign-in method</CardDescription>
        <Button
          variant="outline"
          onClick={loginWithGoogle}
          disabled={isLoading}
          className="w-full"
        >
          <Icons.google className="mr-2 h-4 w-4" /> Continue with Google
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="w-100 h-70" >
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password" disabled={isLoading}>
              Password
            </TabsTrigger>
            <TabsTrigger value="otp" disabled={isLoading}>
              Email OTP
            </TabsTrigger>
          </TabsList>

          {/* ONGLETS MOT DE PASSE */}
          <TabsContent value="password">
            <div className="grid gap-3 mt-4">
              <div className="grid gap-1.5">
                <Label htmlFor="pass-email">Email</Label>
                <Input
                  id="pass-email"
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === "Enter" && loginWithPassword()}
                />
              </div>
              <Button
                onClick={loginWithPassword}
                disabled={isLoading || !email || !password}
              >
                <LockIcon className="mr-2 h-4 w-4" /> Sign in
              </Button>
            </div>
          </TabsContent>

          {/* ONGLETS OTP */}
          <TabsContent value="otp">
            <div className="mt-4">
              {step === "email" ? (
                <div className="grid gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="otp-email">Email</Label>
                    <Input
                      id="otp-email"
                      type="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    />
                  </div>
                  <Button onClick={sendOtp} disabled={isLoading || !email}>
                    <MailIcon className="mr-2 h-4 w-4" /> Send code
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the 6-digit code sent to <strong>{email}</strong>
                  </p>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      disabled={isLoading}
                    >
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button onClick={verifyOtp} disabled={isLoading || otp.length !== 6}>
                    Verify and sign in
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                    }}
                    disabled={isLoading}
                  >
                    Use a different email
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
