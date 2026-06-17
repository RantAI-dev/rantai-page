export const THUMBNAIL_DESIGN_VERSION = 1;

export type ThumbnailDecorationKey =
  | "circles"
  | "squares"
  | "hexagons"
  | "grid"
  | "diagonals"
  | "crosshatch"
  | "waves"
  | "triangles"
  | "chevrons"
  | "rings"
  | "plus"
  | "starburst"
  | "none";

export interface ThumbnailDesignConfig {
  version: typeof THUMBNAIL_DESIGN_VERSION;
  color: string;
  decorationType: "builtin" | "custom";
  deco: ThumbnailDecorationKey;
  customDecoUrl: string | null;
  customDecoSize: number;
  customDecoOpacity: number;
  noiseEnabled: boolean;
  noiseIntensity: number;
  assetUrl: string;
  assetSize: number;
}

export interface ThumbnailDesignInput {
  name: string;
  previewUrl: string | null;
  design: ThumbnailDesignConfig;
}

const DECORATION_KEYS = new Set<ThumbnailDecorationKey>([
  "circles",
  "squares",
  "hexagons",
  "grid",
  "diagonals",
  "crosshatch",
  "waves",
  "triangles",
  "chevrons",
  "rings",
  "plus",
  "starburst",
  "none",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function isUrlLike(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") return false;
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/")
  );
}

function isNullableUrlLike(value: unknown): value is string | null {
  return value === null || isUrlLike(value);
}

function isNumberInRange(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

export function isThumbnailDesignConfig(
  value: unknown,
): value is ThumbnailDesignConfig {
  if (!isRecord(value)) return false;

  if (value.version !== THUMBNAIL_DESIGN_VERSION) return false;
  if (!isHexColor(value.color)) return false;
  if (value.decorationType !== "builtin" && value.decorationType !== "custom") {
    return false;
  }
  if (typeof value.deco !== "string" || !DECORATION_KEYS.has(value.deco as ThumbnailDecorationKey)) {
    return false;
  }
  if (!isNullableUrlLike(value.customDecoUrl)) return false;
  if (!isNumberInRange(value.customDecoSize, 40, 500)) return false;
  if (!isNumberInRange(value.customDecoOpacity, 0, 100)) return false;
  if (typeof value.noiseEnabled !== "boolean") return false;
  if (!isNumberInRange(value.noiseIntensity, 0, 100)) return false;
  if (!isUrlLike(value.assetUrl)) return false;
  if (!isNumberInRange(value.assetSize, 10, 500)) return false;

  if (value.decorationType === "custom" && value.customDecoUrl === null) {
    return false;
  }

  return true;
}

export function normalizeThumbnailDesignInput(
  body: unknown,
): ThumbnailDesignInput | { error: string } {
  if (!isRecord(body)) return { error: "Invalid payload" };

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return { error: "Name is required" };
  if (name.length > 120) return { error: "Name must be 120 characters or fewer" };

  const previewUrl = body.previewUrl;
  if (!isNullableUrlLike(previewUrl)) return { error: "Preview URL is invalid" };

  if (!isThumbnailDesignConfig(body.design)) {
    return { error: "Design payload is invalid" };
  }

  return {
    name,
    previewUrl,
    design: body.design,
  };
}
