"use client";

import { formatter } from "@/lib/utils";
import { AuthUser } from "@/types/UserAuth";
import { ImagePlus } from "lucide-react";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { signOut } from "next-auth/react";

export default function AccountInfo({ user }: { user: AuthUser }) {
  return (
    <div className='flex flex-col lg:flex-row w-full gap-4 p-10'>
      <Card className='py-6'>
        <CardContent className='flex flex-col items-center gap-4 px-6 py-3.5'>
          <Link
            href='/profile/edit'
            className='flex justify-center items-center bg-gray-900 border-4 border-white size-16 sm:size-24 rounded-full'
          >
            {user.image ? (
              <img
                src={user.image}
                alt='User Avatar'
                className='rounded-full w-full h-full object-cover'
              />
            ) : (
              <ImagePlus className='size-5 sm:size-6 text-white' />
            )}
          </Link>
          <div className='text-center'>
            <p>{user.name}</p>
            <p>You joined at {formatter.format(new Date(user.createdAt))}</p>
          </div>
          <Button
            className='w-full'
            variant='destructive'
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
      <Card className='flex-1'>
        <CardContent>
          <div className='flex flex-col justify-center items-center sm:items-start gap-4 p-3.5'>
            <h2 className='text-xl font-bold'>Email</h2>
            <div className='flex flex-col w-full sm:flex-row items-center justify-between gap-4'>
              <p>{user.email}</p>
              <Button asChild variant='outline' className='w-full sm:w-auto'>
                <Link href='/profile/edit'>Edit Email</Link>
              </Button>
            </div>
          </div>
          <Separator />
          <div className='flex flex-col justify-center items-center sm:items-start gap-4 p-3.5'>
            <h2 className='text-xl font-bold'>Name</h2>
            <div className='flex flex-col sm:flex-row w-full items-center justify-between gap-4'>
              <p>{user.name}</p>
              <Button asChild variant='outline' className='w-full sm:w-auto'>
                <Link href='/profile/edit'>Edit Name</Link>
              </Button>
            </div>
          </div>
          <Separator />

          <div className='flex flex-col justify-center items-center sm:items-start gap-4 p-3.5'>
            <h2 className='text-xl font-bold'>Password</h2>
            <div className='flex flex-col sm:flex-row w-full items-center justify-between gap-4'>
              <p>••••••••••</p>
              <Button asChild variant='outline' className='w-full sm:w-auto'>
                <Link href='/profile/edit'>Edit Password</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
