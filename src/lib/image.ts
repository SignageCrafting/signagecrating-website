// Shrinks a photo in the browser before it is uploaded, so phone pictures
// (often 5-10 MB) arrive small and fast.
export async function shrinkImage(file: File, maxSide = 2000, quality = 0.85): Promise<Blob> {
  const resizable = file.type === 'image/jpeg' || file.type === 'image/webp' || file.type === 'image/png';
  if (!resizable) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1_200_000) return file;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  // PNGs are usually logos or sketches: keep transparency, otherwise use JPEG.
  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  return blob && blob.size < file.size ? blob : file;
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.readAsDataURL(blob);
  });
}
