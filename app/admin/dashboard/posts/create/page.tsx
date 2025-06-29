// app/editor/page.tsx

import MarkdownEditor from "@/components/MarkdownEditor";

export default function EditorPage() {
  return (
    <main className='w-full p-6'>
      <h1 className='text-2xl font-bold mb-4'>Create Post</h1>
      <MarkdownEditor />
    </main>
  );
}
