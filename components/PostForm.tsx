// components/PostForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostFormData, postSchema } from "@/lib/validations/post";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/MarkdownEditor";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PostForm({
  isEditMode = false,
  defaultValues = {
    title: "",
    slug: "",
    content: "",
    coverImage: "",
  },
  postId,
}: {
  isEditMode?: boolean;
  defaultValues?: PostFormData;
  postId?: string;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues,
  });

  const router = useRouter();

  const [previewImage, setPreviewImage] = useState(
    defaultValues.coverImage || ""
  );

  const slug = watch("slug");
  const content = watch("content");

  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  const handleFormSubmit = (published: boolean) =>
    handleSubmit(async (data) => {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("slug", data.slug);
        formData.append("coverImage", data.coverImage); // File object
        formData.append("published", String(published)); // or false based on context

        const endpoint = isEditMode
          ? `/api/posts/update/${postId}`
          : "/api/posts";
        const method = isEditMode ? "PUT" : "POST";

        const res = await fetch(endpoint, {
          method,
          body: formData,
        });

        const result = await res.json();

        if (!res.ok) {
          toast.error(result.error || "Something went wrong");
          return;
        }

        toast.success(isEditMode ? "Post updated" : "Post created");
        if (!isEditMode) router.push("/profile/posts");
      } catch (err) {
        toast.error("Unexpected error occurred");
        console.error(err);
      }
    });

  useEffect(() => {
    if (!slug || isEditMode) return;

    const debounce = setTimeout(async () => {
      setCheckingSlug(true);
      try {
        const res = await fetch(`/api/posts/check-slug?slug=${slug}`);
        const data = await res.json();
        setSlugAvailable(data.available);
      } catch {
        setSlugAvailable(null);
      } finally {
        setCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [slug, isEditMode]);

  return (
    <form className='w-full h-full p-10'>
      {/* Cover Image */}
      <div className='flex items-center flex-col sm:flex-row gap-4 mb-4'>
        {previewImage && (
          <Image
            src={previewImage as string}
            width={200}
            height={200}
            alt='Preview'
            className='object-contain'
          />
        )}
        <div className='flex items-center sm:flex-col gap-4'>
          <Button asChild variant='secondary'>
            <label className='w-fit px-2 py-4 rounded-md bg-secondary cursor-pointer'>
              {previewImage ? "Change" : "Add Cover Image"}
              <input
                type='file'
                className='hidden'
                {...register("coverImage")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreviewImage(URL.createObjectURL(file));
                    setValue("coverImage", file, { shouldValidate: true });
                  }
                }}
              />
            </label>
          </Button>
          {previewImage && (
            <Button
              variant='destructive'
              onClick={() => {
                setPreviewImage("");
                setValue("coverImage", "", { shouldValidate: true });
              }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
      {errors.coverImage && (
        <p className='text-red-500'>{errors.coverImage.message}</p>
      )}

      <div className='flex flex-col'>
        {/* Title */}
        <input
          type='text'
          placeholder='Post title...'
          className='font-bold text-3xl outline-none'
          {...register("title")}
        />
        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}

        {/* Slug */}
        <input
          type='text'
          placeholder='slug'
          className='font-bold text-xl outline-none'
          {...register("slug")}
          disabled={isEditMode}
        />
      </div>
      {!isEditMode && slug && (
        <p className='text-sm'>
          {checkingSlug ? (
            <span className='text-gray-500'>Checking slug...</span>
          ) : slugAvailable ? (
            <span className='text-green-600'>✅ Available</span>
          ) : (
            <span className='text-red-600'>❌ Taken</span>
          )}
        </p>
      )}

      {/* Markdown Content */}
      <MarkdownEditor
        content={content}
        setContent={(val: string) => setValue("content", val)}
      />
      {errors.content && (
        <p className='text-red-500 mt-2'>{errors.content.message}</p>
      )}

      {/* Submit */}
      <div className='flex gap-2 mt-6'>
        <Button type='button' onClick={() => handleFormSubmit(true)()}>
          {isEditMode ? "Update & Publish" : "Publish"}
        </Button>

        <Button
          type='button'
          variant='secondary'
          onClick={() => handleFormSubmit(false)()}
        >
          {isEditMode ? "Update Draft" : "Save Draft"}
        </Button>
      </div>
    </form>
  );
}
