import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadImageToCloudinary(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename.split(".")[0] },
      (error, result) => {
        if (error || !result)
          return reject(error ?? new Error("No result from Cloudinary"));
        resolve({ secure_url: result.secure_url });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}
