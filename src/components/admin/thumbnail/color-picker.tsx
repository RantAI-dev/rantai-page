"use client"

import { Label } from "@/components/ui/label"
import { COLOR_PRESETS } from "./constants"

interface ColorPickerProps {
  color: string
  onColorChange: (color: string) => void
}

export function ColorPicker({ color, onColorChange }: ColorPickerProps) {
  return (
    <div className="mb-5">
      <p className="mb-3 text-sm font-semibold">Background Color</p>
      <div className="grid grid-cols-4 gap-2">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.value}
            title={preset.label}
            onClick={() => onColorChange(preset.value)}
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
        <Label className="text-xs text-muted-foreground">Custom:</Label>
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-8 w-16 cursor-pointer rounded border border-border bg-transparent p-0.5"
        />
        <span className="font-mono text-xs text-muted-foreground">{color}</span>
      </div>
    </div>
  )
}
