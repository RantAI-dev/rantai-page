"use client"

import { Suspense } from "react"
import { Download } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { useThumbnail } from "./use-thumbnail"
import { ColorPicker } from "./color-picker"
import { DecorationPicker } from "./decoration-picker"
import { NoiseControl } from "./noise-control"
import { IconPicker } from "./icon-picker"

export function ThumbnailGenerator() {
  const {
    canvasRef,
    hiddenIconRef,
    customIconInputRef,
    customDecoInputRef,
    CANVAS_W,
    CANVAS_H,
    color, setColor,
    deco, setDeco,
    decorationType, setDecorationType,
    customDecoUrl,
    noiseEnabled, setNoiseEnabled,
    noiseIntensity, setNoiseIntensity,
    iconName, setIconName,
    iconType, setIconType,
    customIconUrl,
    search, setSearch,
    filteredIcons,
    handleCustomIconUpload, clearCustomIcon,
    handleCustomDecoUpload, clearCustomDeco,
    handleDownload,
  } = useThumbnail()

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      {/* Hidden icon renderer for canvas */}
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

      {/* Controls card */}
      <Card className="max-h-[calc(100vh-120px)] overflow-y-auto">
        <CardContent>
          <ColorPicker color={color} onColorChange={setColor} />

          <Separator className="mb-5" />

          <DecorationPicker
            deco={deco}
            decorationType={decorationType}
            customDecoUrl={customDecoUrl}
            inputRef={customDecoInputRef}
            onSelect={(key) => { setDeco(key); setDecorationType("builtin") }}
            onUpload={handleCustomDecoUpload}
            onClear={clearCustomDeco}
          />

          <Separator className="mb-5" />

          <NoiseControl
            enabled={noiseEnabled}
            intensity={noiseIntensity}
            onEnabledChange={setNoiseEnabled}
            onIntensityChange={setNoiseIntensity}
          />

          <Separator className="mb-5" />

          <IconPicker
            iconName={iconName}
            iconType={iconType}
            customIconUrl={customIconUrl}
            inputRef={customIconInputRef}
            search={search}
            filteredIcons={filteredIcons}
            onIconSelect={(name) => { setIconName(name); setIconType("lucide") }}
            onSearchChange={setSearch}
            onUpload={handleCustomIconUpload}
            onClear={clearCustomIcon}
          />

          <Separator className="mb-5" />

          <Button className="w-full" size="lg" onClick={handleDownload}>
            <Download />
            Download PNG
          </Button>
        </CardContent>
      </Card>

      {/* Canvas preview */}
      <div className="flex items-start">
        <div className="w-full overflow-hidden rounded-lg border border-border">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="block h-auto w-full"
          />
        </div>
      </div>
    </div>
  )
}
