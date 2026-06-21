import cloudinary from "../config/cloudinary.js";

export async function uploadEvidence(
  image: Buffer | string
): Promise<string> {
  let uploadSource: string;

  if (Buffer.isBuffer(image)) {
    uploadSource =
      `data:image/jpeg;base64,${image.toString(
        "base64"
      )}`;
  } else {
    uploadSource =
      `data:image/jpeg;base64,${image}`;
  }

  const result =
    await cloudinary.uploader.upload(
      uploadSource,
      {
        folder:
          "freeflow/evidence",
      }
    );

  return result.secure_url;
}