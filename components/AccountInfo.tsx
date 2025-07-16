"use client";

import { formatter } from "@/lib/utils";
import { ImagePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { ProfileData, profileSchema } from "@/schema/userForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { toast } from "sonner";
import Spinner from "./Spinner";

export default function AccountInfo() {
  const { data: session, status, update } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onChange",
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name || "");
      setValue("email", session.user.email || "");
      setPreviewImage(session.user.image || "");
    }
  }, [session]);

  console.log(session);

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "unauthenticated" || !session?.user) {
    return <h1>User Info Not Found!</h1>;
  }

  async function handleFormSubmit(data: ProfileData) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    if (data.avatar instanceof File && data.avatar.size > 0) {
      formData.append("avatar", data.avatar);
    }

    if (data.password && data.newPassword) {
      formData.append("password", data.password);
      formData.append("newPassword", data.newPassword);
    }

    console.log(data);

    const res = await fetch(`/api/users/${session?.user.id}`, {
      method: "PUT",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      toast.error(result.error || "Update failed");
    } else {
      toast.success("Profile updated successfully");
      update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
          image:
            data.avatar instanceof File
              ? URL.createObjectURL(data.avatar)
              : session?.user.image,
        },
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className='flex flex-col p-10 gap-4'
    >
      <div className='flex flex-col lg:flex-row w-full gap-4'>
        <Card className='py-6'>
          <CardContent className='flex flex-col items-center gap-4 px-6 py-3.5'>
            <label className='flex justify-center items-center cursor-pointer bg-gray-900 border-4 border-white size-16 sm:size-24 rounded-full'>
              {previewImage ? (
                <Image
                  width={300}
                  height={300}
                  src={previewImage}
                  alt='User Avatar'
                  className='rounded-full w-full h-full object-cover'
                />
              ) : (
                <ImagePlus className='size-5 sm:size-6 text-white' />
              )}
              <input
                type='file'
                className='hidden'
                {...register("avatar")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreviewImage(URL.createObjectURL(file));
                    setValue("avatar", file, { shouldValidate: true });
                  }
                }}
              />
            </label>
            <div className='text-center'>
              <p>{session.user.name}</p>
              <p>
                You joined at{" "}
                {formatter.format(new Date(session.user.createdAt))}
              </p>
            </div>
            <Button
              className='w-full'
              variant='destructive'
              type='button'
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
        <Card className='flex-1'>
          <CardContent>
            <div className='flex flex-col justify-center items-center md:items-start gap-4 p-3.5'>
              <h2 className='text-xl font-bold'>Change Email</h2>
              <div className='flex flex-col xl:flex-row justify-between w-full gap-4'>
                <div className='flex flex-col gap-4 w-full xl:w-1/2'>
                  <label>Email</label>
                  <Input type='text' {...register("email")} />
                </div>
                <div className='flex items-end w-full xl:w-1/2'>
                  <p className='text-red-600'>{errors.email?.message}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className='flex flex-col justify-center items-center md:items-start gap-4 p-3.5'>
              <h2 className='text-xl font-bold'>Change Name</h2>
              <div className='flex flex-col xl:flex-row justify-between w-full gap-4'>
                <div className='flex flex-col gap-4 w-full xl:w-1/2'>
                  <label>Name</label>
                  <Input type='text' {...register("name")} />
                </div>
                <div className='flex items-end w-full xl:w-1/2'>
                  <p className='text-red-600'>{errors.name?.message}</p>
                </div>
              </div>
            </div>
            <Separator />

            <div className='flex flex-col justify-center items-center md:items-start gap-4 p-3.5'>
              <h2 className='text-xl font-bold'>Change Password</h2>
              <div className='flex flex-col xl:flex-row justify-between w-full gap-4'>
                <div className='flex gap-4 flex-col w-full xl:w-1/2'>
                  <label>Password</label>
                  <Input type='password' {...register("password")} />
                </div>
                <div className='flex items-end w-full xl:w-1/2'>
                  <p className='text-red-600'>{errors.password?.message}</p>
                </div>
              </div>
              <div className='flex flex-col lg:flex-row justify-between w-full gap-4'>
                <div className='flex flex-col gap-4 w-full lg:w-1/2'>
                  <label>New Password</label>
                  <Input type='password' {...register("newPassword")} />
                  <p className='text-red-600'>{errors.newPassword?.message}</p>
                </div>
                <div className='flex flex-col gap-4 w-full lg:w-1/2'>
                  <label>Confirm Password</label>
                  <Input type='password' {...register("confirmPassword")} />
                  <p className='text-red-600'>
                    {errors.confirmPassword?.message}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Button type='submit' variant='default' disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
