import { useRef, useEffect, useState } from "react"

import { CANVAS_W, CANVAS_H, COLOR_PRESETS } from "./constants"
import { DECO_OPTIONS, type DecoKey } from "./decorations"
import { drawThumbnail } from "./canvas-helpers"
import { DEFAULT_ASSETS } from "./default-assets"

export function useThumbnail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Appearance
  const [color, setColor] = useState<string>(COLOR_PRESETS[0].value)

  // Decoration
  const [deco, setDeco] = useState<DecoKey>("circles")
  const [decorationType, setDecorationType] = useState<"builtin" | "custom">("builtin")
  const [customDecoUrl, setCustomDecoUrl] = useState<string | null>(null)
  const [customDecoSize, setCustomDecoSize] = useState(100)
  const [customDecoOpacity, setCustomDecoOpacity] = useState(13)
  const prevCustomDecoUrl = useRef<string | null>(null)
  const customDecoInputRef = useRef<HTMLInputElement>(null)

  // Noise
  const [noiseEnabled, setNoiseEnabled] = useState(true)
  const [noiseIntensity, setNoiseIntensity] = useState(50)

  // Asset (upload or default — always a URL)
  const [customIconUrl, setCustomIconUrl] = useState<string>(DEFAULT_ASSETS[0].url)
  const [customIconSize, setCustomIconSize] = useState(100)
  const prevCustomIconUrl = useRef<string | null>(null)
  const customIconInputRef = useRef<HTMLInputElement>(null)

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (prevCustomIconUrl.current) URL.revokeObjectURL(prevCustomIconUrl.current)
      if (prevCustomDecoUrl.current) URL.revokeObjectURL(prevCustomDecoUrl.current)
    }
  }, [])

  const selectedDeco = DECO_OPTIONS.find((d) => d.key === deco)!

  // Canvas draw effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    drawThumbnail(canvas, {
      color,
      deco: decorationType === "builtin" ? selectedDeco : null,
      customDecorationUrl: decorationType === "custom" ? customDecoUrl : null,
      customDecorationScale: customDecoSize,
      customDecorationOpacity: customDecoOpacity,
      iconSource: { type: "url", url: customIconUrl },
      iconScale: customIconSize,
      noiseEnabled,
      noiseIntensity,
    })
  }, [
    color,
    deco,
    selectedDeco,
    decorationType,
    customDecoUrl,
    customDecoSize,
    customDecoOpacity,
    customIconUrl,
    customIconSize,
    noiseEnabled,
    noiseIntensity,
  ])

  // Upload handlers
  function handleCustomIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (prevCustomIconUrl.current) URL.revokeObjectURL(prevCustomIconUrl.current)
    const url = URL.createObjectURL(file)
    prevCustomIconUrl.current = url
    setCustomIconUrl(url)
    e.target.value = ""
  }

  function handleDefaultAssetSelect(url: string) {
    if (prevCustomIconUrl.current) URL.revokeObjectURL(prevCustomIconUrl.current)
    prevCustomIconUrl.current = null
    setCustomIconUrl(url)
  }

  function handleCustomDecoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (prevCustomDecoUrl.current) URL.revokeObjectURL(prevCustomDecoUrl.current)
    const url = URL.createObjectURL(file)
    prevCustomDecoUrl.current = url
    setCustomDecoUrl(url)
    setDecorationType("custom")
    e.target.value = ""
  }

  function clearCustomDeco() {
    if (prevCustomDecoUrl.current) URL.revokeObjectURL(prevCustomDecoUrl.current)
    prevCustomDecoUrl.current = null
    setCustomDecoUrl(null)
    setDecorationType("builtin")
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `thumbnail-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return {
    // Refs
    canvasRef,
    customIconInputRef,
    customDecoInputRef,
    // Canvas size
    CANVAS_W,
    CANVAS_H,
    // State
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
    // Derived
    selectedDeco,
    // Handlers
    handleCustomIconUpload,
    handleDefaultAssetSelect,
    handleCustomDecoUpload,
    clearCustomDeco,
    handleDownload,
  }
}
