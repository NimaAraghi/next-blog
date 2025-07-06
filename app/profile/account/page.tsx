import AccountInfo from "@/components/AccountInfo";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  return (
    <div className='flex flex-col w-full'>
      <AccountInfo user={session?.user} />
    </div>
  );
}
