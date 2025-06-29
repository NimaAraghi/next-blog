"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className='flex justify-between items-center gap-10'>
      <ul className='flex gap-7'>
        <li
          className={`text-lg ${
            pathname === "/"
              ? "text-blue-500"
              : "text-gray-400 hover:text-white transition-colors duration-200"
          }`}
        >
          <Link className='' href='/'>
            Home
          </Link>
        </li>
        <li
          className={`text-lg ${
            pathname === "/posts"
              ? "text-blue-500"
              : "text-gray-400 hover:text-white transition-colors duration-200"
          }`}
        >
          <Link href='/posts'>Posts</Link>
        </li>
      </ul>
    </nav>
  );
}
