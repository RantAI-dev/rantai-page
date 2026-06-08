"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Download, Search } from "lucide-react";
import { iconNames, DynamicIcon } from "lucide-react/dynamic";

import { CANVAS_W, CANVAS_H, COLOR_PRESETS, MAX_ICONS_NO_SEARCH, MAX_ICONS_WITH_SEARCH } from "./constants";
import { DECO_OPTIONS, type DecoKey } from "./decorations";
import { drawThumbnail } from "./canvas-helpers";

export function ThumbnailGenerator() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const hiddenIconRef = useRef<HTMLDivElement>(null);

  const [color,    setColor]    = useState<string>(COLOR_PRESETS[0].value);
  const [iconName, setIconName] = useState("brain");
  const [deco,     setDeco]     = useState<DecoKey>("circles");
  const [search,   setSearch]   = useState("");

  const selectedDeco = DECO_OPTIONS.find((d) => d.key === deco)!;

  const filteredIcons = (() => {
    const q = search.trim().toLowerCase();
    if (!q) return iconNames.slice(0, MAX_ICONS_NO_SEARCH);
    return iconNames.filter((n) => n.includes(q)).slice(0, MAX_ICONS_WITH_SEARCH);
  })();

  const totalMatches = (() => {
    const q = search.trim().toLowerCase();
    return q ? iconNames.filter((n) => n.includes(q)).length : iconNames.length;
  })();

  // DynamicIcon is async — watch the hidden div with MutationObserver and draw
  // as soon as the SVG appears. key={iconName} on Suspense clears the old SVG first.
  useEffect(() => {
    const canvas = canvasRef.current;
    const div    = hiddenIconRef.current;
    if (!canvas || !div) return;

    let observer: MutationObserver | null = null;

    const draw = () => {
      const svgEl = div.querySelector("svg") as SVGSVGElement | null;
      if (!svgEl) return false;
      drawThumbnail(canvas, color, selectedDeco, svgEl);
      return true;
    };

    if (!draw()) {
      observer = new MutationObserver(() => {
        if (draw()) observer?.disconnect();
      });
      observer.observe(div, { childList: true, subtree: true });
    }

    return () => observer?.disconnect();
  }, [iconName, color, deco]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link    = document.createElement("a");
    link.download = `thumbnail-${Date.now()}.png`;
    link.href     = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      {/* Hidden icon renderer — DynamicIcon renders SVG here for canvas extraction */}
      <div ref={hiddenIconRef} className="absolute invisible pointer-events-none" aria-hidden="true">
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

      {/* Controls */}
      <div className="space-y-6">

        {/* Color */}
        <div>
          <p className="text-sm font-medium mb-3">Background Color</p>
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
                  boxShadow:   color === preset.value ? "0 0 0 1px #666" : "none",
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
            <span className="text-xs font-mono text-muted-foreground">{color}</span>
          </div>
        </div>

        {/* Decoration */}
        <div>
          <p className="text-sm font-medium mb-3">Decoration</p>
          <div className="grid grid-cols-2 gap-2">
            {DECO_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setDeco(opt.key)}
                className={`flex flex-col items-center gap-1.5 rounded-md px-2 py-2.5 border transition-colors overflow-hidden ${
                  deco === opt.key
                    ? "border-foreground bg-accent text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                }`}
              >
                <svg
                  viewBox="0 0 40 24"
                  className="w-full h-6"
                  style={{
                    background: deco === opt.key ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                    borderRadius: 3,
                  }}
                  dangerouslySetInnerHTML={{ __html: opt.preview }}
                />
                <span className="text-[10px] leading-none">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Icon search + grid */}
        <div>
          <p className="text-sm font-medium mb-3">Icon</p>

          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search icons…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-border bg-transparent pl-8 pr-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="mb-2 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5">
            <Suspense fallback={<span className="h-4 w-4 block" />}>
              <DynamicIcon
                name={iconName as Parameters<typeof DynamicIcon>[0]["name"]}
                className="h-4 w-4 shrink-0"
              />
            </Suspense>
            <span className="text-xs font-mono text-muted-foreground truncate">{iconName}</span>
          </div>

          <div className="overflow-y-auto max-h-56 rounded-md border border-border p-1.5">
            <div className="grid grid-cols-6 gap-1">
              {filteredIcons.map((name) => (
                <button
                  key={name}
                  title={name}
                  onClick={() => setIconName(name)}
                  className={`flex items-center justify-center rounded p-1.5 border transition-colors ${
                    iconName === name
                      ? "border-foreground bg-accent text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <Suspense fallback={<span className="h-4 w-4 block" />}>
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
            Showing {filteredIcons.length} of {totalMatches}{search ? " results" : " icons"}
          </p>
        </div>

      </div>

      {/* Preview + actions */}
      <div className="space-y-4">
        <div className="w-full overflow-hidden rounded-lg border border-border">
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="w-full h-auto block" />
        </div>
        <div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-4 py-2 text-sm hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" />
            Download PNG
          </button>
          <p className="mt-1.5 text-xs text-muted-foreground">1920 × 1080 px</p>
        </div>
      </div>
    </div>
  );
}
