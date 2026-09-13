import axios, { isAxiosError } from 'axios';

import type { GetToken } from '@clerk/react/types';
import type { ImageKitAuthResponse, ImageKitUploadResponse } from '../types';

import { apiFetch } from './api';

const UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';

type UploadImageOptions = {
  folder?: string;
  fileName?: string;
};

export const uploadImageToImageKit = async (
  file: File,
  getToken: GetToken,
  opts: UploadImageOptions = {},
) => {
  const { folder = 'products', fileName } = opts;

  const auth = await apiFetch<ImageKitAuthResponse>(
    '/api/admin/imagekit/auth',
    { getToken },
  );

  // replace unsafe characters with _.
  // example: "my photo @ home.png" becomes "my_photo___home.png"
  const safeName =
    fileName ??
    (file.name.replace(/[^\w.-]/g, '_').slice(0, 200) ||
      `upload-${Date.now()}.jpg`);

  const form = new FormData();
  form.append('file', file);
  form.append('fileName', safeName);
  form.append('publicKey', auth.publicKey);
  form.append('signature', auth.signature);
  form.append('token', auth.token);
  form.append('expire', String(auth.expire));
  form.append('folder', folder);

  try {
    const { data } = await axios.post<ImageKitUploadResponse>(UPLOAD_URL, form);

    if (!data.url) {
      console.error('[ImageKit upload] Missing URL in response', data);
      throw new Error('ImageKit upload response does not contain a URL');
    }

    return {
      url: data.url,
      fileId: data.fileId ?? null,
    };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        '[ImageKit upload]',
        error.response?.status,
        error.response?.data,
      );
    }

    throw new Error('ImageKit upload failed', {
      cause: error,
    });
  }
};
