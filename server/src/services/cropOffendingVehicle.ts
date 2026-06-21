import sharp from "sharp";

import type { VehicleDetection } from "./detectVehicle.js";

export async function cropOffendingVehicle(
  imageBuffer: Buffer,
  vehicle: VehicleDetection
): Promise<Buffer> {
  const metadata =
    await sharp(imageBuffer)
      .metadata();

  const imageWidth =
    metadata.width ?? 0;

  const imageHeight =
    metadata.height ?? 0;

  if (
    !imageWidth ||
    !imageHeight
  ) {
    throw new Error(
      "Unable to determine image dimensions"
    );
  }

  const expandedWidth =
    vehicle.bbox.width * 1.3;

  const expandedHeight =
    vehicle.bbox.height * 1.8;

  const left = Math.max(
    0,
    Math.round(
      vehicle.bbox.x -
        expandedWidth / 2
    )
  );

  const top = Math.max(
    0,
    Math.round(
      vehicle.bbox.y -
        expandedHeight * 0.7
    )
  );

  const width =
    Math.min(
      Math.round(
        expandedWidth
      ),
      imageWidth - left
    );

  const height =
    Math.min(
      Math.round(
        expandedHeight
      ),
      imageHeight - top
    );

  const croppedBuffer =
    await sharp(imageBuffer)
      .extract({
        left,
        top,
        width,
        height,
      })
      .jpeg({
        quality: 95,
      })
      .toBuffer();

  return croppedBuffer;
}