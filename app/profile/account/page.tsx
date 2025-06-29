import AccountInfo from "@/components/AccountInfo";
import ProfileSidebar from "@/components/ProfileSidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className='flex flex-col w-full'>
      <AccountInfo user={session.user} />
    </div>
  );
}
