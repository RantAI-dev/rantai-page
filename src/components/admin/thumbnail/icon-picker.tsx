"use client"

import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { DEFAULT_ASSETS } from "./default-assets"

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
  const isCustom = !isDefaultAssetUrl(customIconUrl)

  return (
    <div className="mb-5">
      <p className="mb-3 text-sm font-semibold">Assets</p>

      <div className="grid grid-cols-5 gap-2">
        {DEFAULT_ASSETS.map((asset) => {
          const isSelected = !isCustom && customIconUrl === asset.url
          return (
            <button
              key={asset.key}
              onClick={() => onAssetSelect(asset.url)}
              className={`flex flex-col items-center gap-1.5 overflow-hidden rounded-md border px-2 py-2.5 transition-colors ${
                isSelected
                  ? "border-foreground bg-accent text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
              }`}
            >
              <img
                src={asset.url}
                alt={asset.label}
                className="h-5 w-5 object-contain"
              />
              <span className="text-[10px] leading-none">{asset.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-3">
        <input
          ref={inputRef}
          type="file"
          accept=".svg,.png,image/svg+xml,image/png"
          className="hidden"
          onChange={onUpload}
        />

        {isCustom ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-md border border-foreground bg-accent px-3 py-2">
              <img
                src={customIconUrl}
                alt="Uploaded asset"
                className="h-4 w-4 shrink-0 object-contain"
              />
              <span className="flex-1 truncate text-[10px] text-foreground">Custom</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onAssetSelect(DEFAULT_ASSETS[0].url)}
              >
                <X />
              </Button>
            </div>
            <div className="rounded-md border border-border p-3">
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
        ) : (
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full" onClick={() => inputRef.current?.click()}>
              <Upload />
              Upload asset
            </Button>
            <div className="rounded-md border border-border p-3">
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
        )}
      </div>
    </div>
  )
}
