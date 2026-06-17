"use client"

import { useState } from "react"
import { Sparkles, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { DECO_OPTIONS, type DecoKey } from "./decorations"
import { CopyToPromptDialog } from "./copy-to-prompt"
import { OptionPopover, OptionTile } from "./option-popover"

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
  const [open, setOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const isCustom = decorationType === "custom" && !!customDecoUrl
  const selected = DECO_OPTIONS.find((opt) => opt.key === deco) ?? DECO_OPTIONS[0]

  const triggerPreview = isCustom ? (
    <img
      src={customDecoUrl!}
      alt="Custom decoration"
      className="h-6 w-10 rounded object-cover opacity-80"
    />
  ) : (
    <svg
      viewBox="0 0 40 24"
      className="h-5 w-10"
      dangerouslySetInnerHTML={{ __html: selected.preview }}
    />
  )

  return (
    <div className="mb-5">
      <OptionPopover
        label="Decoration"
        preview={triggerPreview}
        value={isCustom ? "Custom" : selected.label}
        searchPlaceholder="Search decorations…"
        open={open}
        onOpenChange={setOpen}
        actions={
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
        }
      >
        {({ query, view }) => {
          const matches = DECO_OPTIONS.filter((opt) =>
            opt.label.toLowerCase().includes(query)
          )
          return (
            <div className={view === "grid" ? "grid grid-cols-3 gap-2" : "flex flex-col gap-1"}>
              {matches.map((opt) => (
                <OptionTile
                  key={opt.key}
                  view={view}
                  selected={!isCustom && deco === opt.key}
                  onClick={() => onSelect(opt.key)}
                  label={opt.label}
                  preview={
                    <svg
                      viewBox="0 0 40 24"
                      className="h-6 w-full"
                      style={{ background: "rgba(255,255,255,0.04)", borderRadius: 3 }}
                      dangerouslySetInnerHTML={{ __html: opt.preview }}
                    />
                  }
                />
              ))}
              {matches.length === 0 && (
                <p className="col-span-full py-6 text-center text-xs text-muted-foreground">
                  No decorations found
                </p>
              )}
            </div>
          )
        }}
      </OptionPopover>

      <CopyToPromptDialog
        initialSubject="decoration"
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

      {isCustom && (
        <div className="mt-3 flex flex-col gap-3">
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
          <Button variant="outline" size="sm" onClick={onClear}>
            Remove custom decoration
          </Button>
        </div>
      )}
    </div>
  )
}
