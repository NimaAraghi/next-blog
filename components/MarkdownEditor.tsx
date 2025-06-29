"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function MarkdownEditor() {
  const [value, setValue] = useState<string>("## Hello Markdown");

  return (
    <div className='w-full' data-color-mode='light'>
      <MDEditor value={value} onChange={(val) => setValue(val || "")} />
    </div>
  );
}
