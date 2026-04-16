"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Globe, Mail, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      toast.error("Cloud access error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-bold text-foreground tracking-tighter">Welcome Back</CardTitle>
        <CardDescription className="text-foreground/50">Enter your credentials to access your health portal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="email" className="flex items-center gap-2 text-foreground/70 font-semibold">
              <Mail size={16} className="text-primary" /> Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
              {...register("email")} 
              className="glass-input h-12" 
            />
            {errors.email && <p className="text-xs text-destructive font-semibold mt-1">{errors.email.message}</p>}
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="flex items-center gap-2 text-foreground/70 font-semibold">
                <Lock size={16} className="text-primary" /> Password
              </Label>
              <Link href="#" className="text-xs text-primary font-bold hover:underline">Reset Keys?</Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              {...register("password")} 
              className="glass-input h-12" 
            />
            {errors.password && <p className="text-xs text-destructive font-semibold mt-1">{errors.password.message}</p>}
          </motion.div>

          <Button type="submit" className="glass-button w-full h-12 text-lg font-bold" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Access Portal"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-foreground/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold text-foreground/30 tracking-widest">
            <span className="bg-transparent px-4">Neural Auth</span>
          </div>
        </div>

        <Button 
          variant="secondary" 
          type="button" 
          className="w-full h-12 bg-white/20 hover:bg-white/40 border-white/20 text-foreground transition-all duration-300 backdrop-blur-md" 
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Globe className="mr-2 h-5 w-5 text-primary" />}
          Continue with Google
        </Button>
      </CardContent>
      <CardFooter className="pb-8">
        <div className="text-sm text-center w-full text-foreground/50 font-medium">
          New to SmartMed?{" "}
          <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-bold border-b-2 border-transparent hover:border-primary">
            Create Neural Account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
