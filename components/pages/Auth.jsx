"use client";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from "@/store/user";

export default function AuthForm() {
  const { login, register, loading, error, forgotPassword } = useUserStore();
  const [type, setType] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (type === "signup") {
        await register(data);
        setType("login");
      } else if (type === "login") {
        await login(data);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    const email = emailRef.current?.value;
    if (!email) {
      toast.error("Please enter your email to reset password.");
    } else {
      forgotPassword(email);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleForgotPassword();
    }
  };

  const toggleFormType = () => {
    setType(type === "login" ? "signup" : "login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Left graphic section */}
        <div
          className="h-28 md:h-auto md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dwl2op3oh/image/upload/v1744561701/uploads/ucmn9iwmvv9yz12efing.svg')",
          }}
        />
        {/* Form section */}
        <Card className="w-full md:w-1/2 border-0 shadow-none rounded-none px-4">
          <CardHeader className="px-0 pt-3 pb-4">
            <a
              href="/"
              className="text-sm font-semibold text-primary hover:underline"
            >
              &larr; Back to website
            </a>
            <CardTitle className="text-4xl mt-2">
              {type === "login" ? "Welcome back!" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {type === "login"
                ? "Log in to your account to continue."
                : "Sign up for free and get started!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-3">
            <form onSubmit={handleSubmit} className="space-y-2">
              {type === "signup" && (
                <>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="rounded-full"
                  />
                  <Select name="gender">
                    <SelectTrigger className="w-full rounded-full">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
              <Input
                type="email"
                name="email"
                placeholder="Email"
                ref={emailRef}
                className="rounded-full"
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="rounded-full pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IconEyeClosed size={18} />
                  ) : (
                    <IconEye size={18} />
                  )}
                </button>
              </div>
              {type === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    onKeyDown={handleKeyDown}
                    className="text-sm text-muted-foreground hover:text-primary transition cursor-pointer underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full"
                size="lg"
              >
                {loading ? (
                  <motion.div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : type === "login" ? (
                  "Log in"
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
            {/* Error messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-4"
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="link"
                onClick={toggleFormType}
                className="text-sm"
              >
                {type === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Log in"}
              </Button>
            </div>
            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-muted-foreground">
              <a
                href="https://www.iamabhi.tech/term"
                className="hover:text-foreground hover:underline transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
              <a
                href="https://www.iamabhi.tech/privacy-policy"
                className="hover:text-foreground hover:underline transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href="https://www.iamabhi.tech/contact"
                className="hover:text-foreground hover:underline transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Support
              </a>
              <span className="text-primary">Social logins coming soon 🚀</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
