// Tag colors are stored on the `tags` table as a preset key (e.g. "blue").
// The actual Tailwind gradient classes live here as literals so the JIT
// compiler always generates them — dynamic class strings pulled from the DB
// would otherwise be purged and never produced.

export const TAG_COLOR_PRESETS = [
  { key: "blue", label: "Blue", gradient: "from-blue-950 via-indigo-900 to-blue-900" },
  { key: "emerald", label: "Emerald", gradient: "from-emerald-950 via-teal-900 to-emerald-900" },
  { key: "violet", label: "Violet", gradient: "from-violet-950 via-purple-900 to-violet-900" },
  { key: "amber", label: "Amber", gradient: "from-amber-950 via-orange-900 to-amber-900" },
  { key: "rose", label: "Rose", gradient: "from-rose-950 via-pink-900 to-rose-900" },
  { key: "slate", label: "Slate", gradient: "from-zinc-900 via-zinc-800 to-zinc-900" },
] as const;

export type TagColorKey = (typeof TAG_COLOR_PRESETS)[number]["key"];

export const DEFAULT_TAG_GRADIENT = "from-zinc-900 via-zinc-800 to-zinc-900";

export function gradientForColor(color?: string | null) {
  return TAG_COLOR_PRESETS.find((preset) => preset.key === color)?.gradient ?? DEFAULT_TAG_GRADIENT;
}
