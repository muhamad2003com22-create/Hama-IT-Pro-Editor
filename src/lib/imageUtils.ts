/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    if (!url.startsWith('data:')) {
      image.setAttribute('crossOrigin', 'anonymous');
    }
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the cropped image as a Blob with 100% quality retention.
 * This version uses direct drawing for maximum HD fidelity.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  targetWidth: number,
  targetHeight: number,
  rotation = 0,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  withWatermark = false
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  
  // 1. Calculate bounding box of the rotated image to know how big the temp canvas needs to be
  const rotRad = getRadianAngle(rotation);
  const bBoxWidth = Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height);
  const bBoxHeight = Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height);

  // 2. Create a high-res temporary canvas for the rotation
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return null;

  tempCanvas.width = bBoxWidth;
  tempCanvas.height = bBoxHeight;
  
  // Draw the image rotated onto the temp canvas
  tempCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
  tempCtx.rotate(rotRad);
  tempCtx.drawImage(image, -image.width / 2, -image.height / 2);

  // 3. Create the final output canvas at target resolution
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill white background for JPEGs
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Draw the cropped portion from temp to final
  ctx.drawImage(
    tempCanvas,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, targetWidth, targetHeight
  );

  // 4. Add Watermark if enabled
  if (withWatermark) {
    const fontSize = Math.max(16, Math.floor(targetWidth * 0.03));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    
    const padding = fontSize;
    const text = 'Hama IT';
    
    // Draw shadow/outline for visibility
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillText(text, targetWidth - padding + 1, targetHeight - padding + 1);
    
    // Draw white text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(text, targetWidth - padding, targetHeight - padding);
  }

  const result = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), format, 1.0);
  });

  // Explicitly clear memory by resetting canvas dimensions
  tempCanvas.width = 0;
  tempCanvas.height = 0;
  canvas.width = 0;
  canvas.height = 0;

  return result;
}

