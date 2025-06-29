import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
}
