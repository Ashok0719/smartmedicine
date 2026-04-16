"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, User, Mail, Lock } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    try {
      // 1. Create the account
      await axios.post("/api/auth/register", data);
      
      // 2. Automatically log in the user
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Account created, but automatic login failed. Please login manually.");
        router.push("/login");
      } else {
        toast.success("Account created! Accessing Vital Core...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed. Database may be locked.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Join Neural Net</CardTitle>
        <CardDescription className="text-foreground/50 font-bold uppercase text-[10px] tracking-widest mt-1">Initialize your biological profile</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-4">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="name" className="flex items-center gap-2 text-foreground/40 font-black text-[10px] uppercase tracking-widest">
              <User size={14} className="text-primary" /> Entity Name
            </Label>
            <Input 
              id="name" 
              placeholder="e.g. ASHOK KUMAR" 
              {...register("name")} 
              className="glass-input h-14 font-black text-lg placeholder:text-foreground/10" 
            />
            {errors.name && <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-1">{errors.name.message}</p>}
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="email" className="flex items-center gap-2 text-foreground/40 font-black text-[10px] uppercase tracking-widest">
              <Mail size={14} className="text-primary" /> Data Endpoint (Email)
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@nexus.com" 
              {...register("email")} 
              className="glass-input h-14 font-black text-lg placeholder:text-foreground/10" 
            />
            {errors.email && <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-1">{errors.email.message}</p>}
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="password" className="flex items-center gap-2 text-foreground/40 font-black text-[10px] uppercase tracking-widest">
              <Lock size={14} className="text-primary" /> Keyphrase (Password)
            </Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              {...register("password")} 
              className="glass-input h-14 font-black text-lg placeholder:text-foreground/10" 
            />
            {errors.password && <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-1">{errors.password.message}</p>}
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 pt-10 pb-10">
          <Button type="submit" className="glass-button w-full h-16 text-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" /> : "INITIALIZE PROTOCOL"}
          </Button>
          <div className="text-[10px] text-center text-foreground/30 font-black uppercase tracking-widest">
            Entity recorded?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 transition-colors border-b-2 border-transparent hover:border-primary pb-0.5">
              Access Nexus
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
