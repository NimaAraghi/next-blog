"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Post } from "@prisma/client";
import { formatter } from "@/lib/utils";
import { Eye, Pencil, Trash, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const published = row.getValue("status") as Post["published"];
      return (
        <span
          className={
            published
              ? "text-green-600 font-medium"
              : "text-yellow-600 font-medium"
          }
        >
          {published ? "Published" : "Draft"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      const date = new Date(value);
      return <span>{formatter.format(date)}</span>;
    },
  },
  {
    id: "actions",
    header: () => <span className='sr-only'>Actions</span>,
    cell: ({ row }) => {
      const post = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem asChild>
              <Link
                href={`/posts/${post.slug}`}
                className='flex items-center gap-2'
              >
                <Eye className='w-4 h-4' />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/profile/posts/edit/${post.id}`}
                className='flex items-center gap-2'
              >
                <Pencil className='w-4 h-4' />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => async () => {
                const confirmDelete = confirm(
                  `Are you sure you want to delete the post "${post.title}"? This action cannot be undone.`
                );
                if (!confirmDelete) return;

                try {
                  const res = await fetch(`/api/posts/delete/${post.id}`, {
                    method: "DELETE",
                  });

                  if (!res.ok) {
                    const { error } = await res.json();
                    toast.error(error || "Failed to delete the post");
                    return;
                  }

                  window.location.reload();
                } catch (error) {
                  console.log("Delete Failed", error);
                  toast.error("An error has occurred while deleting the post");
                }
              }}
              className='text-red-600 hover:text-red-700 flex items-center gap-2'
            >
              <Trash className='w-4 h-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
