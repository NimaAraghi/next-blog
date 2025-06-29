"use client";

import { AuthUser } from "@/types/UserAuth";
import React from "react";
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
import { signOut } from "next-auth/react";
import { UserCircle } from "lucide-react";

export default function UserIcon({ user }: { user: AuthUser | null }) {
  if (!user) {
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
          {user.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href='/profile/account'>Profile</Link>
        </DropdownMenuItem>
        {user.role === "ADMIN" && (
          <DropdownMenuItem>
            <Link href='/admin/dashboard'>Dashboard</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button onClick={() => signOut()}>Sign out</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
