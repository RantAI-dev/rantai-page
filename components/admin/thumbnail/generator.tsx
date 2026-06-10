"use client"

import { useRef, useEffect, useState, Suspense } from "react"
import { Download, Search, Upload, X } from "lucide-react"
import { iconNames, DynamicIcon } from "lucide-react/dynamic"

import {
  CANVAS_W,
  CANVAS_H,
  COLOR_PRESETS,
  MAX_ICONS_NO_SEARCH,
  MAX_ICONS_WITH_SEARCH,
} from "./constants"
import { DECO_OPTIONS, type DecoKey } from "./decorations"
import { drawThumbnail } from "./canvas-helpers"

// ── Component ─────────────────────────────────────────────────────────────────

export function ThumbnailGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hiddenIconRef = useRef<HTMLDivElement>(null)

  // Appearance
  const [color, setColor] = useState<string>(COLOR_PRESETS[0].value)

  // Decoration
  const [deco, setDeco] = useState<DecoKey>("circles")
  const [decorationType, setDecorationType] = useState<"builtin" | "custom">(
    "builtin"
  )
  const [customDecoUrl, setCustomDecoUrl] = useState<string | null>(null)
  const prevCustomDecoUrl = useRef<string | null>(null)
  const customDecoInputRef = useRef<HTMLInputElement>(null)

  // Noise
  const [noiseEnabled, setNoiseEnabled] = useState(true)
  const [noiseIntensity, setNoiseIntensity] = useState(30)

  // Icon
  const [iconName, setIconName] = useState("brain")
  const [iconType, setIconType] = useState<"lucide" | "custom">("lucide")
  const [customIconUrl, setCustomIconUrl] = useState<string | null>(null)
  const prevCustomIconUrl = useRef<string | null>(null)
  const customIconInputRef = useRef<HTMLInputElement>(null)

  // Search
  const [search, setSearch] = useState("")

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (prevCustomIconUrl.current)
        URL.revokeObjectURL(prevCustomIconUrl.current)
      if (prevCustomDecoUrl.current)
        URL.revokeObjectURL(prevCustomDecoUrl.current)
    }
  }, [])

  const selectedDeco = DECO_OPTIONS.find((d) => d.key === deco)!

  const filteredIcons = (() => {
    const q = search.trim().toLowerCase()
    if (!q) return iconNames.slice(0, MAX_ICONS_NO_SEARCH)
    return iconNames
      .filter((n) => n.includes(q))
      .slice(0, MAX_ICONS_WITH_SEARCH)
  })()

  const totalMatches = (() => {
    const q = search.trim().toLowerCase()
    return q ? iconNames.filter((n) => n.includes(q)).length : iconNames.length
  })()

  // ── Canvas draw effect ──────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    const div = hiddenIconRef.current
    if (!canvas || !div) return

    let observer: MutationObserver | null = null

    const buildOpts = (svgEl?: SVGSVGElement) => ({
      color,
      deco: decorationType === "builtin" ? selectedDeco : null,
      customDecorationUrl: decorationType === "custom" ? customDecoUrl : null,
      iconSource:
        iconType === "custom" && customIconUrl
          ? { type: "url" as const, url: customIconUrl }
          : { type: "svg" as const, el: svgEl! },
      noiseEnabled,
      noiseIntensity,
    })

    const draw = async () => {
      if (iconType === "custom") {
        if (!customIconUrl) return false
        await drawThumbnail(canvas, buildOpts())
        return true
      }
      const svgEl = div.querySelector("svg") as SVGSVGElement | null
      if (!svgEl) return false
      await drawThumbnail(canvas, buildOpts(svgEl))
      return true
    }

    draw().then((done) => {
      if (!done) {
        observer = new MutationObserver(async () => {
          if (await draw()) observer?.disconnect()
        })
        observer.observe(div, { childList: true, subtree: true })
      }
    })

    return () => observer?.disconnect()
  }, [
    iconName,
    iconType,
    customIconUrl,
    color,
    deco,
    decorationType,
    customDecoUrl,
    noiseEnabled,
    noiseIntensity,
  ]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Upload handlers ─────────────────────────────────────────────────────────

  function handleCustomIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (prevCustomIconUrl.current)
      URL.revokeObjectURL(prevCustomIconUrl.current)
    const url = URL.createObjectURL(file)
    prevCustomIconUrl.current = url
    setCustomIconUrl(url)
    setIconType("custom")
    e.target.value = ""
  }

  function clearCustomIcon() {
    if (prevCustomIconUrl.current)
      URL.revokeObjectURL(prevCustomIconUrl.current)
    prevCustomIconUrl.current = null
    setCustomIconUrl(null)
    setIconType("lucide")
  }

  function handleCustomDecoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (prevCustomDecoUrl.current)
      URL.revokeObjectURL(prevCustomDecoUrl.current)
    const url = URL.createObjectURL(file)
    prevCustomDecoUrl.current = url
    setCustomDecoUrl(url)
    setDecorationType("custom")
    e.target.value = ""
  }

  function clearCustomDeco() {
    if (prevCustomDecoUrl.current)
      URL.revokeObjectURL(prevCustomDecoUrl.current)
    prevCustomDecoUrl.current = null
    setCustomDecoUrl(null)
    setDecorationType("builtin")
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `thumbnail-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[35%_1fr]">
      {/* Hidden icon renderer */}
      <div
        ref={hiddenIconRef}
        className="pointer-events-none invisible absolute"
        aria-hidden="true"
      >
        <Suspense key={iconName} fallback={null}>
          <DynamicIcon
            name={iconName as Parameters<typeof DynamicIcon>[0]["name"]}
            size={400}
            color="white"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Suspense>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={customIconInputRef}
        type="file"
        accept=".svg,.png,image/svg+xml,image/png"
        className="hidden"
        onChange={handleCustomIconUpload}
      />
      <input
        ref={customDecoInputRef}
        type="file"
        accept=".svg,.png,image/svg+xml,image/png"
        className="hidden"
        onChange={handleCustomDecoUpload}
      />

      {/* ── Controls sidebar ── */}
      <div className="max-h-[calc(100vh-120px)] space-y-0 overflow-y-auto pr-1">
        {/* APPEARANCE section */}
        <p className="mb-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Appearance
        </p>

        {/* Background Color */}
        <div className="mb-5">
          <p className="mb-3 text-sm font-medium">Background Color</p>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                title={preset.label}
                onClick={() => setColor(preset.value)}
                className="h-10 w-full rounded-md border-2 transition-all"
                style={{
                  backgroundColor: preset.value,
                  borderColor: color === preset.value ? "white" : "transparent",
                  boxShadow: color === preset.value ? "0 0 0 1px #666" : "none",
                }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Custom:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-16 cursor-pointer rounded border border-border bg-transparent p-0.5"
            />
            <span className="font-mono text-xs text-muted-foreground">
              {color}
            </span>
          </div>
        </div>

        {/* Decoration */}
        <div className="mb-5">
          <p className="mb-3 text-sm font-medium">Decoration</p>
          <div className="grid grid-cols-2 gap-2">
            {DECO_OPTIONS.map((opt) => {
              const isSelected =
                decorationType === "builtin" && deco === opt.key
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    setDeco(opt.key)
                    setDecorationType("builtin")
                  }}
                  className={`flex flex-col items-center gap-1.5 overflow-hidden rounded-md border px-2 py-2.5 transition-colors ${
                    isSelected
                      ? "border-foreground bg-accent text-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                  }`}
                >
                  <svg
                    viewBox="0 0 40 24"
                    className="h-6 w-full"
                    style={{
                      background: isSelected
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.03)",
                      borderRadius: 3,
                    }}
                    dangerouslySetInnerHTML={{ __html: opt.preview }}
                  />
                  <span className="text-[10px] leading-none">{opt.label}</span>
                </button>
              )
            })}
          </div>

          {/* Custom decoration upload */}
          <div className="mt-3">
            {customDecoUrl && decorationType === "custom" ? (
              <div
                className={`flex items-center gap-2 rounded-md border border-foreground bg-accent px-3 py-2`}
              >
                <img
                  src={customDecoUrl}
                  alt="Custom decoration"
                  className="h-6 w-10 rounded object-cover opacity-80"
                />
                <span className="flex-1 truncate text-[10px] text-foreground">
                  Custom
                </span>
                <button
                  onClick={clearCustomDeco}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => customDecoInputRef.current?.click()}
                className="flex w-full items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
              >
                <Upload className="h-3.5 w-3.5 shrink-0" />
                Upload Decoration
                <span className="ml-auto text-[10px] opacity-60">
                  .svg .png
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Noise */}
        <div className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <input
              id="noise-enabled"
              type="checkbox"
              checked={noiseEnabled}
              onChange={(e) => setNoiseEnabled(e.target.checked)}
              className="h-3.5 w-3.5 cursor-pointer accent-foreground"
            />
            <label
              htmlFor="noise-enabled"
              className="cursor-pointer text-sm font-medium select-none"
            >
              Enable Noise
            </label>
          </div>
          <div
            className={`transition-opacity ${noiseEnabled ? "opacity-100" : "pointer-events-none opacity-40"}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={noiseIntensity}
                onChange={(e) => setNoiseIntensity(Number(e.target.value))}
                className="flex-1 cursor-pointer accent-foreground"
              />
              <span className="w-6 text-right font-mono text-xs text-muted-foreground">
                {noiseIntensity}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Noise Intensity
            </p>
          </div>
        </div>

        <hr className="mb-5 border-border" />

        {/* ASSETS section */}
        <p className="mb-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Assets
        </p>

        {/* Icon search + grid */}
        <div className="mb-5">
          <p className="mb-3 text-sm font-medium">Icon</p>

          <div className="relative mb-2">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search icons…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-border bg-transparent py-1.5 pr-3 pl-8 text-xs placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Current selection chip */}
          <div className="mb-2 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5">
            {iconType === "custom" && customIconUrl ? (
              <img
                src={customIconUrl}
                alt="Custom icon"
                className="h-4 w-4 shrink-0 object-contain"
              />
            ) : (
              <Suspense fallback={<span className="block h-4 w-4" />}>
                <DynamicIcon
                  name={iconName as Parameters<typeof DynamicIcon>[0]["name"]}
                  className="h-4 w-4 shrink-0"
                />
              </Suspense>
            )}
            <span className="truncate font-mono text-xs text-muted-foreground">
              {iconType === "custom" ? "custom" : iconName}
            </span>
            {iconType === "custom" && (
              <button
                onClick={clearCustomIcon}
                className="ml-auto text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Custom icon upload */}
          <div className="mb-2">
            <button
              onClick={() => customIconInputRef.current?.click()}
              className="flex w-full items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5 shrink-0" />
              Upload Icon
              <span className="ml-auto text-[10px] opacity-60">.svg .png</span>
            </button>
          </div>

          {/* Built-in icon grid */}
          <div className="max-h-56 overflow-y-auto rounded-md border border-border p-1.5">
            <div className="grid grid-cols-6 gap-1">
              {filteredIcons.map((name) => (
                <button
                  key={name}
                  title={name}
                  onClick={() => {
                    setIconName(name)
                    setIconType("lucide")
                  }}
                  className={`flex items-center justify-center rounded border p-1.5 transition-colors ${
                    iconType === "lucide" && iconName === name
                      ? "border-foreground bg-accent text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <Suspense fallback={<span className="block h-4 w-4" />}>
                    <DynamicIcon
                      name={name as Parameters<typeof DynamicIcon>[0]["name"]}
                      className="h-4 w-4"
                    />
                  </Suspense>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-1.5 text-[10px] text-muted-foreground">
            Showing {filteredIcons.length} of {totalMatches}
            {search ? " results" : " icons"}
          </p>
        </div>
      </div>

      {/* ── Preview + download ── */}
      <div className="space-y-4">
        <div className="w-full overflow-hidden rounded-lg border border-border">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="block h-auto w-full"
          />
        </div>
        <div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            Download PNG
          </button>
          <p className="mt-1.5 text-xs text-muted-foreground">1920 × 1080 px</p>
        </div>
      </div>
    </div>
  )
}
