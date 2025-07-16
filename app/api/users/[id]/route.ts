// app/api/user/[id]/route.ts
import { withAuth } from "@/lib/api/utils";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/schema/userForm";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";

export const GET = withAuth(async (req, { id }) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user)
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});

export const PUT = withAuth(async (req, { id }) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user)
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });

    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const avatar = formData.get("avatar");
    const password = formData.get("password")?.toString() || "";
    const newPassword = formData.get("newPassword")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    const parsed = profileSchema.safeParse({
      name,
      email,
      avatar,
      password,
      newPassword,
      confirmPassword,
    });

    if (!parsed.success) {
      console.log(fromZodError(parsed.error));

      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const updates: Partial<User> = { name, email };

    if (newPassword) {
      if (!password)
        return NextResponse.json(
          { error: "New password is required to change password" },
          { status: 400 }
        );

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return NextResponse.json(
          { error: "Incorrect current password" },
          { status: 400 }
        );

      updates.password = await bcrypt.hash(newPassword, 10);
    }

    let avatarUrl = typeof avatar === "string" ? avatar : "";

    // ✅ Upload to Cloudinary
    if (avatar instanceof File) {
      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadImageToCloudinary(
        buffer,
        avatar.name,
        "avatars"
      );
      avatarUrl = uploadResult.secure_url;
      updates.avatar = avatarUrl;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});

export const DELETE = withAuth(async (req, { id }) => {
  const deletedUser = await prisma.user.delete({ where: { id } });

  return NextResponse.json({ deletedUser }, { status: 200 });
});
