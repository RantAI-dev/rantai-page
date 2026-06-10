import { useRef, useEffect, useState } from "react"
import { iconNames } from "lucide-react/dynamic"

import {
  CANVAS_W,
  CANVAS_H,
  COLOR_PRESETS,
  MAX_ICONS_NO_SEARCH,
  MAX_ICONS_WITH_SEARCH,
} from "./constants"
import { DECO_OPTIONS, type DecoKey } from "./decorations"
import { drawThumbnail } from "./canvas-helpers"

export function useThumbnail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hiddenIconRef = useRef<HTMLDivElement>(null)

  // Appearance
  const [color, setColor] = useState<string>(COLOR_PRESETS[0].value)

  // Decoration
  const [deco, setDeco] = useState<DecoKey>("circles")
  const [decorationType, setDecorationType] = useState<"builtin" | "custom">("builtin")
  const [customDecoUrl, setCustomDecoUrl] = useState<string | null>(null)
  const [customDecoSize, setCustomDecoSize] = useState(100)
  const prevCustomDecoUrl = useRef<string | null>(null)
  const customDecoInputRef = useRef<HTMLInputElement>(null)

  // Noise
  const [noiseEnabled, setNoiseEnabled] = useState(true)
  const [noiseIntensity, setNoiseIntensity] = useState(50)

  // Icon
  const [iconName, setIconName] = useState("brain")
  const [iconType, setIconType] = useState<"lucide" | "custom">("lucide")
  const [customIconUrl, setCustomIconUrl] = useState<string | null>(null)
  const [customIconSize, setCustomIconSize] = useState(100)
  const prevCustomIconUrl = useRef<string | null>(null)
  const customIconInputRef = useRef<HTMLInputElement>(null)

  // Search
  const [search, setSearch] = useState("")

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (prevCustomIconUrl.current) URL.revokeObjectURL(prevCustomIconUrl.current)
      if (prevCustomDecoUrl.current) URL.revokeObjectURL(prevCustomDecoUrl.current)
    }
  }, [])

  const selectedDeco = DECO_OPTIONS.find((d) => d.key === deco)!

  const filteredIcons = (() => {
    const q = search.trim().toLowerCase()
    if (!q) return iconNames.slice(0, MAX_ICONS_NO_SEARCH)
    return iconNames.filter((n) => n.includes(q)).slice(0, MAX_ICONS_WITH_SEARCH)
  })()

  const totalMatches = (() => {
    const q = search.trim().toLowerCase()
    return q ? iconNames.filter((n) => n.includes(q)).length : iconNames.length
  })()

  // Canvas draw effect
  useEffect(() => {
    const canvas = canvasRef.current
    const div = hiddenIconRef.current
    if (!canvas || !div) return

    let observer: MutationObserver | null = null

    const buildOpts = (svgEl?: SVGSVGElement) => ({
      color,
      deco: decorationType === "builtin" ? selectedDeco : null,
      customDecorationUrl: decorationType === "custom" ? customDecoUrl : null,
      customDecorationScale: customDecoSize,
      iconSource:
        iconType === "custom" && customIconUrl
          ? { type: "url" as const, url: customIconUrl }
          : { type: "svg" as const, el: svgEl! },
      iconScale: iconType === "custom" ? customIconSize : 100,
      noiseEnabled,
      noiseIntensity,
    })

    const draw = async () => {
      if (iconType === "custom") {
        if (!customIconUrl) return false
        await drawThumbnail(canvas, buildOpts())
        return true
      }
      const svgEl = div.querySelector("svg") as SVGSVGElement | null
      if (!svgEl) return false
      await drawThumbnail(canvas, buildOpts(svgEl))
      return true
    }

    draw().then((done) => {
      if (!done) {
        observer = new MutationObserver(async () => {
          if (await draw()) observer?.disconnect()
        })
        observer.observe(div, { childList: true, subtree: true })
      }
    })

    return () => observer?.disconnect()
  }, [
    iconName,
    iconType,
    customIconUrl,
    color,
    deco,
    selectedDeco,
    decorationType,
    customDecoUrl,
    customDecoSize,
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
    setIconType("custom")
    e.target.value = ""
  }

  function clearCustomIcon() {
    if (prevCustomIconUrl.current) URL.revokeObjectURL(prevCustomIconUrl.current)
    prevCustomIconUrl.current = null
    setCustomIconUrl(null)
    setIconType("lucide")
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
    hiddenIconRef,
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
    noiseEnabled,
    setNoiseEnabled,
    noiseIntensity,
    setNoiseIntensity,
    iconName,
    setIconName,
    iconType,
    setIconType,
    customIconUrl,
    customIconSize,
    setCustomIconSize,
    search,
    setSearch,
    // Derived
    selectedDeco,
    filteredIcons,
    totalMatches,
    // Handlers
    handleCustomIconUpload,
    clearCustomIcon,
    handleCustomDecoUpload,
    clearCustomDeco,
    handleDownload,
  }
}
