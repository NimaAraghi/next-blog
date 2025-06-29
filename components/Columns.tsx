"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Post } from "@prisma/client";
import { formatter } from "@/lib/utils";

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
];
