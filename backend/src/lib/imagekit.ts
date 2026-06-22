import ImageKit, { NotFoundError } from "@imagekit/nodejs";
import { type Env } from "./env.js";

export const deleteImageKitAsset = async (
  env: Env,
  storedFileId: string | null,
) => {
  if (!storedFileId) return;

  const client = new ImageKit({ privateKey: env.IMAGEKIT_PRIVATE_KEY });

  try {
    await client.files.delete(storedFileId);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) return;
    throw error;
  }
};
