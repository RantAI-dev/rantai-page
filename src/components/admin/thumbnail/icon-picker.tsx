"use client"

import { useState } from "react"
import { Sparkles, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { DEFAULT_ASSETS } from "./default-assets"
import { CopyToPromptDialog } from "./copy-to-prompt"
import { OptionPopover, OptionTile } from "./option-popover"

interface IconPickerProps {
  customIconUrl: string
  customIconSize: number
  inputRef: React.RefObject<HTMLInputElement | null>
  onAssetSelect: (url: string) => void
  onCustomIconSizeChange: (size: number) => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const isDefaultAssetUrl = (url: string) =>
  DEFAULT_ASSETS.some((asset) => asset.url === url)

export function IconPicker({
  customIconUrl,
  customIconSize,
  inputRef,
  onAssetSelect,
  onCustomIconSizeChange,
  onUpload,
}: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const isCustom = !isDefaultAssetUrl(customIconUrl)
  const selected = DEFAULT_ASSETS.find((asset) => asset.url === customIconUrl)

  const triggerPreview = (
    <img
      src={customIconUrl}
      alt={isCustom ? "Custom asset" : (selected?.label ?? "Asset")}
      className="h-5 w-5 object-contain"
    />
  )

  return (
    <div className="mb-5">
      <OptionPopover
        label="Assets"
        preview={triggerPreview}
        value={isCustom ? "Custom" : (selected?.label ?? "Asset")}
        searchPlaceholder="Search assets…"
        open={open}
        onOpenChange={setOpen}
        actions={
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isCustom ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setOpen(false)
                  inputRef.current?.click()
                }}
              >
                <Upload />
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false)
                  setAiOpen(true)
                }}
              >
                <Sparkles />
                Generate
              </Button>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Upload SVG/PNG — grab free icons from{" "}
              <a
                href="https://lucide.dev/icons/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-2"
              >
                lucide.dev/icons
              </a>{" "}
              (Download SVG).
            </p>
          </div>
        }
      >
        {({ query, view }) => {
          const matches = DEFAULT_ASSETS.filter((asset) =>
            asset.label.toLowerCase().includes(query)
          )
          return (
            <div className={view === "grid" ? "grid grid-cols-5 gap-2" : "flex flex-col gap-1"}>
              {matches.map((asset) => (
                <OptionTile
                  key={asset.key}
                  view={view}
                  selected={!isCustom && customIconUrl === asset.url}
                  onClick={() => onAssetSelect(asset.url)}
                  label={asset.label}
                  preview={
                    <img src={asset.url} alt={asset.label} className="h-5 w-5 object-contain" />
                  }
                />
              ))}
              {matches.length === 0 && (
                <p className="col-span-full py-6 text-center text-xs text-muted-foreground">
                  No assets found
                </p>
              )}
            </div>
          )
        }}
      </OptionPopover>

      <CopyToPromptDialog
        initialSubject="asset"
        open={aiOpen}
        onOpenChange={setAiOpen}
        showTrigger={false}
      />

      <input
        ref={inputRef}
        type="file"
        accept=".svg,.png,image/svg+xml,image/png"
        className="hidden"
        onChange={onUpload}
      />

      <div className="mt-3 rounded-md border border-border p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-medium">Asset size</span>
          <span className="font-mono text-xs text-muted-foreground">{customIconSize}%</span>
        </div>
        <Slider
          min={10}
          max={500}
          step={1}
          value={[customIconSize]}
          onValueChange={([value]) => onCustomIconSizeChange(value)}
        />
      </div>
    </div>
  )
}
