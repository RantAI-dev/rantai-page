"use client"

import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { DECO_OPTIONS, type DecoKey } from "./decorations"

interface DecorationPickerProps {
  deco: DecoKey
  decorationType: "builtin" | "custom"
  customDecoUrl: string | null
  customDecoSize: number
  customDecoOpacity: number
  inputRef: React.RefObject<HTMLInputElement | null>
  onSelect: (key: DecoKey) => void
  onCustomDecoSizeChange: (size: number) => void
  onCustomDecoOpacityChange: (opacity: number) => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}

export function DecorationPicker({
  deco,
  decorationType,
  customDecoUrl,
  customDecoSize,
  customDecoOpacity,
  inputRef,
  onSelect,
  onCustomDecoSizeChange,
  onCustomDecoOpacityChange,
  onUpload,
  onClear,
}: DecorationPickerProps) {
  return (
    <div className="mb-5">
      <p className="mb-3 text-sm font-semibold">Decoration</p>
      <div className="grid grid-cols-3 gap-2">
        {DECO_OPTIONS.map((opt) => {
          const isSelected = decorationType === "builtin" && deco === opt.key
          return (
            <button
              key={opt.key}
              onClick={() => onSelect(opt.key)}
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
                  background: isSelected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                  borderRadius: 3,
                }}
                dangerouslySetInnerHTML={{ __html: opt.preview }}
              />
              <span className="text-[10px] leading-none">{opt.label}</span>
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
        {customDecoUrl && decorationType === "custom" ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-md border border-foreground bg-accent px-3 py-2">
              <img
                src={customDecoUrl}
                alt="Custom decoration"
                className="h-6 w-10 rounded object-cover opacity-80"
              />
              <span className="flex-1 truncate text-[10px] text-foreground">Custom</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClear}>
                <X />
              </Button>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium">Decoration size</span>
                <span className="font-mono text-xs text-muted-foreground">{customDecoSize}%</span>
              </div>
              <Slider
                min={40}
                max={500}
                step={1}
                value={[customDecoSize]}
                onValueChange={([value]) => onCustomDecoSizeChange(value)}
              />
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium">Decoration opacity</span>
                <span className="font-mono text-xs text-muted-foreground">{customDecoOpacity}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[customDecoOpacity]}
                onValueChange={([value]) => onCustomDecoOpacityChange(value)}
              />
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => inputRef.current?.click()}>
            <Upload />
            Upload decoration
          </Button>
        )}
      </div>
    </div>
  )
}
