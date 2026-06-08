import { CANVAS_W, CANVAS_H } from "./constants";
import type { DecoOption } from "./decorations";

export function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function applyGrain(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 40;
    data[i]     = Math.min(255, Math.max(0, data[i]     + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
}

export async function drawIconFromSvgEl(
  ctx: CanvasRenderingContext2D,
  svgEl: SVGSVGElement,
  w: number,
  h: number
) {
  const size = Math.min(w, h) * 0.32;
  const svgString = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  return new Promise<void>((resolve, reject) => {
    const img   = new Image();
    img.onload  = () => {
      ctx.drawImage(img, w / 2 - size / 2, h / 2 - size / 2, size, size);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(); };
    img.src = url;
  });
}

export async function drawThumbnail(
  canvas: HTMLCanvasElement,
  color: string,
  deco: DecoOption,
  svgEl: SVGSVGElement
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = CANVAS_W, h = CANVAS_H;
  const { r, g, b } = hexToRgb(color);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, w, h);
  applyGrain(ctx, w, h);
  deco.draw(ctx, w, h);
  await drawIconFromSvgEl(ctx, svgEl, w, h);
}
