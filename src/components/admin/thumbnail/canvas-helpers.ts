import { CANVAS_W, CANVAS_H } from "./constants";
import type { DrawThumbnailOptions } from "./types";

export function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function applyGrain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  intensity: number
) {
  const variance = (intensity / 100) * 40;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 2 * variance;
    data[i]     = Math.min(255, Math.max(0, data[i]     + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
}

function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
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

async function drawIconFromUrl(
  ctx: CanvasRenderingContext2D,
  url: string,
  w: number,
  h: number
) {
  const size = Math.min(w, h) * 0.32;
  const img = await loadImageFromUrl(url);
  ctx.drawImage(img, w / 2 - size / 2, h / 2 - size / 2, size, size);
}

async function drawImageAsDecoration(
  ctx: CanvasRenderingContext2D,
  url: string,
  w: number,
  h: number
) {
  const img = await loadImageFromUrl(url);
  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.drawImage(img, 0, 0, w, h);
  ctx.restore();
}

export async function drawThumbnail(
  canvas: HTMLCanvasElement,
  opts: DrawThumbnailOptions
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = CANVAS_W, h = CANVAS_H;
  const { r, g, b } = hexToRgb(opts.color);

  // 1. Background
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, w, h);

  // 2. Decoration
  if (opts.deco !== null) {
    opts.deco.draw(ctx, w, h);
  }
  if (opts.customDecorationUrl !== null) {
    await drawImageAsDecoration(ctx, opts.customDecorationUrl, w, h);
  }

  // 3. Icon
  if (opts.iconSource.type === "svg") {
    await drawIconFromSvgEl(ctx, opts.iconSource.el, w, h);
  } else {
    await drawIconFromUrl(ctx, opts.iconSource.url, w, h);
  }

  // 4. Noise (always on top)
  if (opts.noiseEnabled) {
    applyGrain(ctx, w, h, opts.noiseIntensity);
  }
}
