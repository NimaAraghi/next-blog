"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { UserCircle } from "lucide-react";

export default function UserIcon() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <div className='flex itmes-center gap-3.5'>
        <Button asChild variant='outline'>
          <Link href='/register'>Register</Link>
        </Button>
        <Button asChild>
          <Link href='/login'>Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserCircle />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' sideOffset={5}>
        <DropdownMenuLabel className='text-center font-bold text-lg'>
          {session.user.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' asChild>
          <Link href='/profile/account'>Profile</Link>
        </DropdownMenuItem>
        {session.user.role === "ADMIN" && (
          <DropdownMenuItem className='cursor-pointer' asChild>
            <Link href='/admin/dashboard'>Dashboard</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' asChild>
          <button className='w-full' onClick={() => signOut()}>
            Sign out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
