import { getServerSession } from "next-auth";
import Navbar from "./Navbar";
import UserIcon from "./UserIcon";

export default async function Header() {
  const session = await getServerSession();

  return (
    <header
      className='flex justify-between sticky top-0 left-0 right-0 border-b-2 border-b-foreground px-10 py-5
      bg-black/30 backdrop-blur-md shadow-lg z-50'
    >
      <h1 className='font-bold text-3xl'>Next Blog</h1>
      <Navbar />
      <UserIcon user={session?.user || null} />
    </header>
  );
}
