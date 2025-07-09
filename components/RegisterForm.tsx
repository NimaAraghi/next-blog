"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { registerSchema } from "@/schema/userForm";
import { toast } from "sonner";

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });
  const router = useRouter();

  async function onSubmit(data: RegisterFormData) {
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Account Created, Loggin in...");

      const loginRes = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (loginRes?.ok) {
        router.push("/");
      } else {
        toast.error("Registerd but faild to login");
      }
    } else {
      const response = await res.json();
      toast.error(response.error || "Something went wrong");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 bg-card", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Register an account</CardTitle>
          <CardDescription>
            Enter your email and name below to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  {...register("email")}
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                />
                {errors.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='name'>Name</Label>
                <Input {...register("name")} id='name' type='text' />
                {errors.name && (
                  <p className='text-sm text-red-500'>{errors.name.message}</p>
                )}
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input
                  {...register("password")}
                  id='password'
                  type='password'
                />
                {errors.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className='flex flex-col gap-3'>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </div>
            </div>
            <div className='mt-4 text-center text-sm'>
              Don&apos;t have an account?{" "}
              <Link href='/login' className='underline underline-offset-4'>
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
