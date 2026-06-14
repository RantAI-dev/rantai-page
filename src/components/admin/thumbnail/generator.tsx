"use client"

import { Suspense } from "react"
import { Download } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"

import { useThumbnail } from "./use-thumbnail"
import { ColorPicker } from "./color-picker"
import { DecorationPicker } from "./decoration-picker"
import { NoiseControl } from "./noise-control"
import { IconPicker } from "./icon-picker"
import { CopyToPrompt } from "./copy-to-prompt"

export function ThumbnailGenerator() {
  const {
    canvasRef,
    hiddenIconRef,
    customIconInputRef,
    customDecoInputRef,
    CANVAS_W,
    CANVAS_H,
    color,
    setColor,
    deco,
    setDeco,
    decorationType,
    setDecorationType,
    customDecoUrl,
    customDecoSize,
    setCustomDecoSize,
    noiseEnabled,
    setNoiseEnabled,
    noiseIntensity,
    setNoiseIntensity,
    iconName,
    setIconName,
    iconType,
    setIconType,
    customIconUrl,
    customIconSize,
    setCustomIconSize,
    search,
    setSearch,
    filteredIcons,
    handleCustomIconUpload,
    clearCustomIcon,
    handleCustomDecoUpload,
    clearCustomDeco,
    handleDownload,
  } = useThumbnail()

  return (
    <div className="relative">
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

      <ResizablePanelGroup
        // direction="horizontal"
        className="min-h-[calc(100vh-120px)] w-full border border-border"
      >
        {/* Controls panel */}
        <ResizablePanel defaultSize={30} minSize={30}>
          <Card>
            <CardContent>
              <ColorPicker color={color} onColorChange={setColor} />

              <Separator className="mb-5" />

              <DecorationPicker
                deco={deco}
                decorationType={decorationType}
                customDecoUrl={customDecoUrl}
                customDecoSize={customDecoSize}
                inputRef={customDecoInputRef}
                onSelect={(key) => {
                  setDeco(key)
                  setDecorationType("builtin")
                }}
                onCustomDecoSizeChange={setCustomDecoSize}
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
                customIconSize={customIconSize}
                inputRef={customIconInputRef}
                search={search}
                filteredIcons={filteredIcons}
                onIconSelect={(name) => {
                  setIconName(name)
                  setIconType("lucide")
                }}
                onCustomIconSizeChange={setCustomIconSize}
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
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right panel: canvas preview + AI prompt */}
        <ResizablePanel defaultSize={70} minSize={30}>
          <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
            <div className="overflow-hidden rounded-lg border border-border">
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className="block h-auto w-full"
              />
            </div>

            <Card>
              <CardContent>
                <CopyToPrompt iconName={iconName} iconType={iconType} />
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
