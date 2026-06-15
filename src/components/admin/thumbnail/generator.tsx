"use client"

import { useState } from "react"
import { Check, Download, Grid3x3 } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"

import { useThumbnail } from "./use-thumbnail"
import { CanvasGrid } from "./canvas-grid"
import { ColorPicker } from "./color-picker"
import { DecorationPicker } from "./decoration-picker"
import { NoiseControl } from "./noise-control"
import { IconPicker } from "./icon-picker"
import { CopyToPromptDialog, CopyToPromptPopover } from "./copy-to-prompt"

interface ThumbnailGeneratorProps {
  /** When provided, shows a primary button that uploads the current canvas and
   *  passes back the hosted URL. */
  onUse?: (url: string) => void
  /** Label for the primary button. Defaults to "Use this thumbnail". */
  useLabel?: string
}

export function ThumbnailGenerator({
  onUse,
  useLabel = "Use this thumbnail",
}: ThumbnailGeneratorProps) {
  const {
    canvasRef,
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
    customDecoOpacity,
    setCustomDecoOpacity,
    noiseEnabled,
    setNoiseEnabled,
    noiseIntensity,
    setNoiseIntensity,
    customIconUrl,
    customIconSize,
    setCustomIconSize,
    handleCustomIconUpload,
    handleDefaultAssetSelect,
    handleCustomDecoUpload,
    clearCustomDeco,
    handleDownload,
  } = useThumbnail()

  const [showGrid, setShowGrid] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Mirror canvas-helpers.ts: size = min(W,H) * 0.32 * (scale/100)
  const iconSizePx =
    Math.min(CANVAS_W, CANVAS_H) * 0.32 * (customIconSize / 100)

  async function handleUse() {
    const canvas = canvasRef.current
    if (!canvas || !onUse) return

    setUploading(true)
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      )
      if (!blob) throw new Error("Could not render the thumbnail")

      const formData = new FormData()
      formData.append(
        "file",
        new File([blob], `thumbnail-${Date.now()}.png`, { type: "image/png" })
      )

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Upload failed")
      }

      const { url } = await res.json()
      onUse(url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative h-full">
      <ResizablePanelGroup>
        {/* Controls panel */}
        <ResizablePanel defaultSize={30} minSize={30}>
          <Card className="h-full overflow-y-scroll">
            <CardContent>
              <ColorPicker color={color} onColorChange={setColor} />

              <Separator className="mb-5" />

              <CopyToPromptDialog initialSubject="asset" />

              <Separator className="my-5" />

              <DecorationPicker
                deco={deco}
                decorationType={decorationType}
                customDecoUrl={customDecoUrl}
                customDecoSize={customDecoSize}
                customDecoOpacity={customDecoOpacity}
                inputRef={customDecoInputRef}
                onSelect={(key) => {
                  setDeco(key)
                  setDecorationType("builtin")
                }}
                onCustomDecoSizeChange={setCustomDecoSize}
                onCustomDecoOpacityChange={setCustomDecoOpacity}
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
                customIconUrl={customIconUrl}
                customIconSize={customIconSize}
                inputRef={customIconInputRef}
                onAssetSelect={handleDefaultAssetSelect}
                onCustomIconSizeChange={setCustomIconSize}
                onUpload={handleCustomIconUpload}
              />
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right panel: canvas preview + AI prompt */}
        <ResizablePanel
          defaultSize={70}
          minSize={30}
          className="flex flex-col justify-center gap-2 p-6"
        >
          <div className="relative rounded-lg border border-border">
            {showGrid && (
              <Alert className="absolute -top-22 w-full">
                <Grid3x3 className="h-4 w-4" />
                <AlertDescription>
                  Use the grid to keep your asset the same visual size across
                  all thumbnails. Adjust <strong>Asset size</strong> until the
                  dashed asset zone fits snugly inside the grid square. The grid
                  is a visual aid only and won't appear in the downloaded PNG.
                </AlertDescription>
              </Alert>
            )}
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="block h-auto w-full"
            />

            <CanvasGrid
              canvasW={CANVAS_W}
              canvasH={CANVAS_H}
              iconSizePx={iconSizePx}
              showGrid={showGrid}
              onToggle={() => setShowGrid((v) => !v)}
            />
          </div>

          <div className="flex w-full gap-2">
            {onUse && (
              <Button
                className="flex-1"
                size="lg"
                onClick={handleUse}
                disabled={uploading}
              >
                <Check />
                {uploading ? "Uploading…" : useLabel}
              </Button>
            )}
            <Button
              className={onUse ? undefined : "w-full"}
              variant={onUse ? "outline" : "default"}
              size="lg"
              onClick={handleDownload}
            >
              <Download />
              {onUse ? "Download" : "Download PNG"}
            </Button>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
