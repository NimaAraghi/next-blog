"use client";

import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import { NotebookText, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <ScrollArea className='flex flex-col sm:flex-row gap-4 pt-10'>
      <div className='px-4 md:px-0'>
        <Button
          className='mb-2 mr-2'
          asChild
          variant={pathname === "/profile/account" ? "outline" : "ghost"}
        >
          <Link className='text-base' href='/profile/account'>
            <User className='size-5' />
            User Account
          </Link>
        </Button>
        <Button
          className='mb-2 mr-2'
          asChild
          variant={pathname === "/profile/posts" ? "outline" : "ghost"}
        >
          <Link href='/profile/posts'>
            <NotebookText className='size-5' />
            My Posts
          </Link>
        </Button>
      </div>
    </ScrollArea>
  );
}
