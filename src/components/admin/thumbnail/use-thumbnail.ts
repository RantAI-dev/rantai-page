import { useRef, useEffect, useState } from "react"

import {
  THUMBNAIL_DESIGN_VERSION,
  type ThumbnailDesignConfig,
} from "@/lib/thumbnail-design"

import { CANVAS_W, CANVAS_H, COLOR_PRESETS } from "./constants"
import { DECO_OPTIONS, type DecoKey } from "./decorations"
import { drawThumbnail } from "./canvas-helpers"
import { DEFAULT_ASSETS } from "./default-assets"

function getDefaultDesign(): ThumbnailDesignConfig {
  return {
    version: THUMBNAIL_DESIGN_VERSION,
    color: COLOR_PRESETS[0].value,
    decorationType: "builtin",
    deco: "circles",
    customDecoUrl: null,
    customDecoSize: 100,
    customDecoOpacity: 13,
    noiseEnabled: true,
    noiseIntensity: 50,
    assetUrl: DEFAULT_ASSETS[0].url,
    assetSize: 100,
  }
}

export function useThumbnail(initialDesign?: ThumbnailDesignConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const seed = initialDesign ?? getDefaultDesign()

  // Appearance
  const [color, setColor] = useState<string>(seed.color)

  // Decoration
  const [deco, setDeco] = useState<DecoKey>(seed.deco)
  const [decorationType, setDecorationType] = useState<"builtin" | "custom">(seed.decorationType)
  const [customDecoUrl, setCustomDecoUrl] = useState<string | null>(seed.customDecoUrl)
  const [customDecoSize, setCustomDecoSize] = useState(seed.customDecoSize)
  const [customDecoOpacity, setCustomDecoOpacity] = useState(seed.customDecoOpacity)
  const [customDecoFile, setCustomDecoFile] = useState<File | null>(null)
  const prevCustomDecoUrl = useRef<string | null>(null)
  const customDecoInputRef = useRef<HTMLInputElement>(null)

  // Noise
  const [noiseEnabled, setNoiseEnabled] = useState(seed.noiseEnabled)
  const [noiseIntensity, setNoiseIntensity] = useState(seed.noiseIntensity)

  // Asset (upload or default — always a URL)
  const [customIconUrl, setCustomIconUrl] = useState<string>(seed.assetUrl)
  const [customIconSize, setCustomIconSize] = useState(seed.assetSize)
  const [customIconFile, setCustomIconFile] = useState<File | null>(null)
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
    setCustomIconFile(file)
    setCustomIconUrl(url)
    e.target.value = ""
  }

  function handleDefaultAssetSelect(url: string) {
    if (prevCustomIconUrl.current) URL.revokeObjectURL(prevCustomIconUrl.current)
    prevCustomIconUrl.current = null
    setCustomIconFile(null)
    setCustomIconUrl(url)
  }

  function handleCustomDecoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (prevCustomDecoUrl.current) URL.revokeObjectURL(prevCustomDecoUrl.current)
    const url = URL.createObjectURL(file)
    prevCustomDecoUrl.current = url
    setCustomDecoFile(file)
    setCustomDecoUrl(url)
    setDecorationType("custom")
    e.target.value = ""
  }

  function clearCustomDeco() {
    if (prevCustomDecoUrl.current) URL.revokeObjectURL(prevCustomDecoUrl.current)
    prevCustomDecoUrl.current = null
    setCustomDecoFile(null)
    setCustomDecoUrl(null)
    setDecorationType("builtin")
  }

  function getDesign(overrides?: {
    assetUrl?: string
    customDecoUrl?: string | null
  }): ThumbnailDesignConfig {
    return {
      version: THUMBNAIL_DESIGN_VERSION,
      color,
      decorationType,
      deco,
      customDecoUrl: overrides?.customDecoUrl ?? customDecoUrl,
      customDecoSize,
      customDecoOpacity,
      noiseEnabled,
      noiseIntensity,
      assetUrl: overrides?.assetUrl ?? customIconUrl,
      assetSize: customIconSize,
    }
  }

  function markDesignSaved(design: ThumbnailDesignConfig) {
    if (prevCustomIconUrl.current) URL.revokeObjectURL(prevCustomIconUrl.current)
    if (prevCustomDecoUrl.current) URL.revokeObjectURL(prevCustomDecoUrl.current)
    prevCustomIconUrl.current = null
    prevCustomDecoUrl.current = null
    setCustomIconFile(null)
    setCustomDecoFile(null)
    setCustomIconUrl(design.assetUrl)
    setCustomDecoUrl(design.customDecoUrl)
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `thumbnail-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  function handleDownloadSvg() {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageHref = canvas.toDataURL("image/png")
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_W}" height="${CANVAS_H}" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}"><image href="${imageHref}" width="${CANVAS_W}" height="${CANVAS_H}"/></svg>`
    const url = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
    )
    const link = document.createElement("a")
    link.download = `thumbnail-${Date.now()}.svg`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
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
    customIconFile,
    customDecoFile,
    // Derived
    selectedDeco,
    // Handlers
    handleCustomIconUpload,
    handleDefaultAssetSelect,
    handleCustomDecoUpload,
    clearCustomDeco,
    handleDownload,
    handleDownloadSvg,
    getDesign,
    markDesignSaved,
  }
}
