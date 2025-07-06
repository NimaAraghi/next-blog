"use client";

import dynamic from "next/dynamic";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function MarkdownEditor({
  content,
  setContent,
}: {
  content: string;
  setContent: (value: string) => void;
}) {
  return (
    <div className='w-full' data-color-mode='dark'>
      <MDEditor value={content} onChange={(val) => setContent(val || "")} />
    </div>
  );
}
