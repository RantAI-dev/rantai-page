"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import {
  Check,
  Download,
  FileCode2,
  Grid3x3,
  MoreHorizontal,
  Save,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import type { ThumbnailDesignConfig } from "@/lib/thumbnail-design"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

interface ThumbnailGeneratorProps {
  /** When provided, shows a primary button that uploads the current canvas and
   *  passes back the hosted URL. */
  onUse?: (url: string) => void
  /** Label for the primary button. Defaults to "Use this thumbnail". */
  useLabel?: string
  /** Design state to load into the editor. */
  initialDesign?: ThumbnailDesignConfig
  /** Saves the editable design recipe plus a rendered preview URL. */
  onSaveDesign?: (payload: {
    design: ThumbnailDesignConfig
    previewUrl: string
  }) => Promise<void>
  /** Label for the save button. Defaults to "Save design". */
  saveLabel?: string
  /** Optional external container for the action buttons. */
  actionsContainer?: HTMLElement | null
  /** Optional destructive action shown inside the overflow menu. */
  onDelete?: () => void
  /**
   * Render the controls/preview split as drag-resizable panels. Disable when
   * mounting inside a portal (e.g. a Dialog) that already lives within another
   * resizable group — react-resizable-panels shares global pointer state across
   * all mounted groups and a second nested group throws on resize.
   */
  resizable?: boolean
}

export function ThumbnailGenerator({
  onUse,
  useLabel = "Use this thumbnail",
  initialDesign,
  onSaveDesign,
  saveLabel = "Save design",
  actionsContainer,
  onDelete,
  resizable = true,
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
    customIconFile,
    customDecoFile,
    handleCustomIconUpload,
    handleDefaultAssetSelect,
    handleCustomDecoUpload,
    clearCustomDeco,
    handleDownload,
    handleDownloadSvg,
    getDesign,
    markDesignSaved,
  } = useThumbnail(initialDesign)

  const [showGrid, setShowGrid] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Mirror canvas-helpers.ts: size = min(W,H) * 0.32 * (scale/100)
  const iconSizePx =
    Math.min(CANVAS_W, CANVAS_H) * 0.32 * (customIconSize / 100)

  async function uploadFile(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error ?? "Upload failed")
    }

    const data = (await res.json()) as { url?: string }
    if (!data.url) throw new Error("Upload failed")
    return data.url
  }

  async function uploadCanvasPng(prefix: string) {
    const canvas = canvasRef.current
    if (!canvas) throw new Error("Could not render the thumbnail")

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    )
    if (!blob) throw new Error("Could not render the thumbnail")

    return uploadFile(
      new File([blob], `${prefix}-${Date.now()}.png`, { type: "image/png" })
    )
  }

  async function handleUse() {
    if (!onUse) return

    setUploading(true)
    try {
      const url = onSaveDesign
        ? await saveCurrentDesign("thumbnail")
        : await uploadCanvasPng("thumbnail")
      onUse(url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function saveCurrentDesign(previewPrefix: string): Promise<string> {
    if (!onSaveDesign) throw new Error("Save is not available")

    const [assetUrl, savedCustomDecoUrl, previewUrl] = await Promise.all([
      customIconFile
        ? uploadFile(customIconFile)
        : Promise.resolve(customIconUrl),
      customDecoFile
        ? uploadFile(customDecoFile)
        : Promise.resolve(customDecoUrl),
      uploadCanvasPng(previewPrefix),
    ])
    const design = getDesign({
      assetUrl,
      customDecoUrl: savedCustomDecoUrl,
    })

    await onSaveDesign({ design, previewUrl })
    markDesignSaved(design)
    toast.success("Thumbnail design saved")
    return previewUrl
  }

  async function handleSaveDesign() {
    if (!onSaveDesign) return

    setSaving(true)
    try {
      await saveCurrentDesign("thumbnail-preview")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save design")
    } finally {
      setSaving(false)
    }
  }

  const isUsingExternalActions = actionsContainer !== undefined
  const actions = (
    <div
      className={
        isUsingExternalActions
          ? "flex flex-wrap items-center justify-end gap-2"
          : "flex w-full flex-wrap gap-2"
      }
    >
      {onSaveDesign && (
        <Button
          className={isUsingExternalActions ? undefined : "flex-1"}
          variant={onUse ? "outline" : "default"}
          size={isUsingExternalActions ? "default" : "lg"}
          onClick={handleSaveDesign}
          disabled={saving || uploading}
        >
          <Save />
          {saving ? "Saving…" : saveLabel}
        </Button>
      )}
      {onUse && (
        <Button
          className={isUsingExternalActions ? undefined : "flex-1"}
          size={isUsingExternalActions ? "default" : "lg"}
          onClick={handleUse}
          disabled={uploading || saving}
        >
          <Check />
          {uploading ? "Uploading…" : useLabel}
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={
              !isUsingExternalActions && !onUse && !onSaveDesign ? "w-full" : undefined
            }
            variant="outline"
            size={isUsingExternalActions ? "icon" : "icon-lg"}
            aria-label="Thumbnail actions"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={handleDownload}>
            <Download />
            Download PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadSvg}>
            <FileCode2 />
            Download SVG
          </DropdownMenuItem>
          {onDelete ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  const controlsPanel = (
    <Card className="h-full overflow-y-scroll">
      <CardContent>
              <ColorPicker color={color} onColorChange={setColor} />

              <Separator className="mb-5" />

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
  )

  const previewPanel = (
    <>
      <div className="relative rounded-lg border border-border">
        {showGrid && (
          <Alert className="absolute -top-22 w-full">
            <Grid3x3 className="h-4 w-4" />
            <AlertDescription>
              Use the grid to keep your asset the same visual size across all
              thumbnails. Adjust <strong>Asset size</strong> until the dashed
              asset zone fits snugly inside the grid square. The grid is a
              visual aid only and won&apos;t appear in the downloaded PNG.
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

      {actionsContainer === undefined ? actions : null}
    </>
  )

  return (
    <div className="relative h-full">
      {actionsContainer ? createPortal(actions, actionsContainer) : null}
      {resizable ? (
        <ResizablePanelGroup>
          <ResizablePanel defaultSize={30} minSize={30}>
            {controlsPanel}
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            defaultSize={70}
            minSize={30}
            className="flex flex-col justify-center gap-2 p-6"
          >
            {previewPanel}
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex h-full w-full flex-col gap-4 lg:flex-row">
          <div className="lg:w-[34%] lg:min-w-[300px]">{controlsPanel}</div>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-2 p-6">
            {previewPanel}
          </div>
        </div>
      )}
    </div>
  )
}
