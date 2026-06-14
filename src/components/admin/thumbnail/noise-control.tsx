"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

interface NoiseControlProps {
  enabled: boolean
  intensity: number
  onEnabledChange: (v: boolean) => void
  onIntensityChange: (v: number) => void
}

export function NoiseControl({
  enabled,
  intensity,
  onEnabledChange,
  onIntensityChange,
}: NoiseControlProps) {
  return (
    <div className="mb-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Label
          htmlFor="noise-enabled"
          className="cursor-pointer text-sm font-semibold"
        >
          Noise
        </Label>
        <Switch
          id="noise-enabled"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />
      </div>
      <div
        className={`transition-opacity ${enabled ? "opacity-100" : "pointer-events-none opacity-40"}`}
      >
        <div className="flex items-center gap-3">
          <Slider
            min={0}
            max={100}
            step={1}
            value={[intensity]}
            onValueChange={([v]) => onIntensityChange(v)}
            className="flex-1"
          />
          <span className="w-7 text-right font-mono text-xs text-muted-foreground">
            {intensity}
          </span>
        </div>
      </div>
    </div>
  )
}
