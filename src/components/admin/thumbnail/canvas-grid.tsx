"use client"

import { Grid3x3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface CanvasGridProps {
  canvasW: number
  canvasH: number
  iconSizePx: number
  showGrid: boolean
  onToggle: () => void
}

export function CanvasGrid({ canvasW, canvasH, iconSizePx, showGrid, onToggle }: CanvasGridProps) {
  const [gridH1] = [22]
  const [gridH2] = [78]
  const [gridV1] = [34]
  const [gridV2] = [66]

  const iconX = canvasW / 2 - iconSizePx / 2
  const iconY = canvasH / 2 - iconSizePx / 2

  return (
    <>
      {showGrid && (
        <svg
          viewBox={`0 0 ${canvasW} ${canvasH}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Horizontal lines */}
          <line x1={0} y1={canvasH * (gridH1 / 100)} x2={canvasW} y2={canvasH * (gridH1 / 100)} stroke="white" strokeOpacity={0.25} strokeWidth={3} />
          <line x1={0} y1={canvasH * (gridH2 / 100)} x2={canvasW} y2={canvasH * (gridH2 / 100)} stroke="white" strokeOpacity={0.25} strokeWidth={3} />

          {/* Vertical lines */}
          <line x1={canvasW * (gridV1 / 100)} y1={0} x2={canvasW * (gridV1 / 100)} y2={canvasH} stroke="white" strokeOpacity={0.25} strokeWidth={3} />
          <line x1={canvasW * (gridV2 / 100)} y1={0} x2={canvasW * (gridV2 / 100)} y2={canvasH} stroke="white" strokeOpacity={0.25} strokeWidth={3} />

          {/* Center crosshair */}
          <line x1={canvasW / 2} y1={0} x2={canvasW / 2} y2={canvasH} stroke="white" strokeOpacity={0.12} strokeWidth={2} strokeDasharray="16 12" />
          <line x1={0} y1={canvasH / 2} x2={canvasW} y2={canvasH / 2} stroke="white" strokeOpacity={0.12} strokeWidth={2} strokeDasharray="16 12" />

          {/* Asset zone */}
          <rect x={iconX} y={iconY} width={iconSizePx} height={iconSizePx} fill="none" stroke="white" strokeOpacity={0.7} strokeWidth={4} strokeDasharray="18 10" />
          <text x={canvasW / 2} y={iconY - 20} textAnchor="middle" fill="white" fillOpacity={0.6} fontSize={28} fontFamily="system-ui, sans-serif" fontWeight={500} letterSpacing={2}>
            ASSET ZONE
          </text>

          {/* Center dot */}
          <circle cx={canvasW / 2} cy={canvasH / 2} r={10} fill="white" fillOpacity={0.4} />
        </svg>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggle}
            className={`absolute top-3 right-3 transition-colors ${
              showGrid
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-black/20 text-white/60 hover:bg-black/30 hover:text-white"
            }`}
          >
            <Grid3x3 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{showGrid ? "Hide grid" : "Show grid"}</TooltipContent>
      </Tooltip>
    </>
  )
}
