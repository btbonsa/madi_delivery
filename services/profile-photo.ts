import { File, UploadType } from "expo-file-system";
import type { ImagePickerAsset } from "expo-image-picker";

const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

type CloudinaryUploadResult = {
  secure_url?: string;
  error?: { message?: string };
};

export async function uploadProfilePhoto(
  asset: ImagePickerAsset,
  onProgress?: (fraction: number) => void,
): Promise<{ secureUrl: string | null; error: string | null }> {
  if (!cloudName || !uploadPreset) {
    return {
      secureUrl: null,
      error:
        "Cloudinary is not configured. Add EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET, then restart Expo.",
    };
  }

  try {
    const file = new File(asset.uri);
    const task = file.createUploadTask(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      {
        uploadType: UploadType.MULTIPART,
        fieldName: "file",
        mimeType: asset.mimeType || "image/jpeg",
        parameters: { upload_preset: uploadPreset },
        onProgress: ({ bytesSent, totalBytes }) => {
          if (totalBytes > 0) onProgress?.(Math.min(bytesSent / totalBytes, 1));
        },
      },
    );
    const response = await task.uploadAsync();
    let result: CloudinaryUploadResult;

    try {
      result = JSON.parse(response.body) as CloudinaryUploadResult;
    } catch {
      return {
        secureUrl: null,
        error: "Cloudinary returned an unreadable response. Please try again.",
      };
    }

    if (response.status < 200 || response.status >= 300 || !result.secure_url) {
      return {
        secureUrl: null,
        error:
          result.error?.message ||
          "Cloudinary could not upload this image. Check the unsigned preset and try again.",
      };
    }

    return { secureUrl: result.secure_url, error: null };
  } catch {
    return {
      secureUrl: null,
      error:
        "The photo upload failed. Check your internet connection and try again.",
    };
  }
}
