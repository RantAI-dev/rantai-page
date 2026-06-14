"use client"

import { useState, useMemo } from "react"
import {
  Copy,
  Check,
  Scissors,
  FileImage,
  Code2,
  ChevronDown,
  Info,
  Image,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item"
import { ClaudeIcon, OpenAIIcon, GoogleIcon } from "@/components/icons"
import { Separator } from "@/components/ui/separator"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CopyToPromptProps {
  initialSubject?: SubjectMode
}

type SubjectMode = "asset" | "decoration"
type FormatMode = "png" | "svg"

// ── Prompt builders ───────────────────────────────────────────────────────────

function buildPrompt(
  subject: SubjectMode,
  format: FormatMode,
  description: string
): string {
  if (subject === "asset") {
    const desc = description.trim() || "Random Object"
    if (format === "png") {
      return [
        `Create ${desc} as a square (1:1) PNG image.`,
        `White (#FFFFFF), stroke-width 3px, rounded caps and joins, no fill — outline style only.`,
        `Fill 85–90% of the canvas, minimal padding (max 5–8% per side).`,
        `Background: transparent (preferred). Fallback: pure black (#000000).`,
        `No backgrounds, gradients, or drop shadows. Single isolated asset, centered.`,
      ].join(" ")
    }
    return [
      `Generate a clean SVG of ${desc}.`,
      `- viewBox="0 0 100 100", square canvas`,
      `- Transparent background (no <rect> fill)`,
      `- stroke="#FFFFFF", stroke-width="3", stroke-linecap="round", stroke-linejoin="round"`,
      `- fill="none" (outline only)`,
      `- Fill 80–90% of the viewBox, minimal padding`,
      `Output only raw SVG code. No explanation, no markdown code block.`,
    ].join("\n")
  }

  const desc = description.trim() || "Random Object"
  if (format === "png") {
    return [
      `Create ${desc} as a decorative graphic element, square (1:1) PNG image.`,
      `White (#FFFFFF), stroke-width 3px, rounded caps and joins, no fill — outline style only.`,
      `Fill 85–90% of the canvas, minimal padding (max 5–8% per side).`,
      `Background: transparent (preferred). Fallback: pure black (#000000).`,
      `Abstract, geometric, repeating or symmetrical. No text, no icons, decoration only.`,
    ].join(" ")
  }
  return [
    `Generate a decorative SVG pattern of ${desc}.`,
    `- viewBox="0 0 100 100", square canvas`,
    `- Transparent background (no <rect> fill)`,
    `- stroke="#FFFFFF", stroke-width="3", stroke-linecap="round", stroke-linejoin="round"`,
    `- fill="none" (outline only)`,
    `- Abstract geometric, repeating or symmetrical. No text, no icons.`,
    `- Fill 80–90% of the viewBox`,
    `Output only raw SVG code. No explanation, no markdown code block.`,
  ].join("\n")
}

// ── AI providers ──────────────────────────────────────────────────────────────

const AI_PROVIDERS = [
  {
    key: "chatgpt",
    label: "Open in ChatGPT",
    description: "Transparent PNG & SVG · Best choice",
    url: "https://chatgpt.com/",
    icon: <OpenAIIcon size={18} />,
  },
  {
    key: "claude",
    label: "Open in Claude",
    description: "SVG only · Cannot generate images",
    url: "https://claude.ai/new",
    icon: <ClaudeIcon size={18} />,
  },
  {
    key: "gemini",
    label: "Open in Gemini",
    description: "Image only · No transparent or SVG support",
    url: "https://gemini.google.com/app",
    icon: <GoogleIcon size={18} />,
  },
] as const

// ── PromptActions: ButtonGroup + Item dropdown ────────────────────────────────

function PromptActions({ getPrompt }: { getPrompt: () => string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(getPrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleOpenAI(url: string) {
    await navigator.clipboard.writeText(getPrompt())
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <ButtonGroup className="w-full">
      <Button size="lg" className="flex-1" onClick={handleCopy}>
        {copied ? <Check /> : <Copy />}
        {copied ? "Copied!" : "Copy Prompt"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuGroup>
            {AI_PROVIDERS.map((ai) => (
              <DropdownMenuItem
                key={ai.key}
                onClick={() => handleOpenAI(ai.url)}
              >
                <Item size="xs" className="w-full">
                  <ItemMedia>{ai.icon}</ItemMedia>
                  <ItemContent className="gap-0">
                    <ItemTitle>{ai.label}</ItemTitle>
                    <ItemDescription className="leading-none">
                      {ai.description}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CopyToPrompt({ initialSubject = "asset" }: CopyToPromptProps) {
  const [subject, setSubject] = useState<SubjectMode>(initialSubject)
  const [description, setDescription] = useState("")
  const [format, setFormat] = useState<FormatMode>("png")

  const prompt = useMemo(
    () => buildPrompt(subject, format, description),
    [subject, format, description]
  )

  const placeholder =
    subject === "asset"
      ? "e.g. a brain icon, a rocket illustration, a phone holder…"
      : "e.g. concentric circles, hexagon grid, diagonal lines, wave pattern…"

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">Generate with AI</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Generate assets or decorations in the same style using AI.
        </p>
      </div>

      {/* Subject: Asset / Decoration */}
      <div className="space-y-1.5">
        <Label>What do you want to generate?</Label>
        <Tabs
          value={subject}
          onValueChange={(v) => setSubject(v as SubjectMode)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="asset" className="flex-1 gap-1.5">
              <Image className="h-3.5 w-3.5" />
              Asset
            </TabsTrigger>
            <TabsTrigger value="decoration" className="flex-1 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Decoration
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="desc">Description</Label>
        <Textarea
          id="desc"
          placeholder={placeholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Format: PNG / SVG */}
      <div className="space-y-1.5">
        <Label>Output Format</Label>
        <Tabs value={format} onValueChange={(v) => setFormat(v as FormatMode)}>
          <TabsList className="w-full">
            <TabsTrigger value="png" className="flex-1 gap-1.5">
              <FileImage className="h-3.5 w-3.5" />
              PNG
            </TabsTrigger>
            <TabsTrigger value="svg" className="flex-1 gap-1.5">
              <Code2 className="h-3.5 w-3.5" />
              SVG
            </TabsTrigger>
          </TabsList>

          <TabsContent value="png">
            <Alert>
              <Scissors />
              <AlertDescription>
                If the result isn't transparent, remove the background at{" "}
                <a
                  href="https://remove.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-2"
                >
                  remove.bg
                </a>
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="svg">
            <Alert>
              <Info />
              <AlertDescription>
                AI will output SVG code — transparent by default, scalable, can
                be used directly in Figma/code.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>

      <Separator />

      {/* Actions */}
      <div className="space-y-1.5">
        <PromptActions getPrompt={() => prompt} />
      </div>
    </div>
  )
}

// ── Dialog wrapper ────────────────────────────────────────────────────────────

export interface CopyToPromptDialogProps {
  initialSubject: SubjectMode
}

export function CopyToPromptDialog({
  initialSubject,
}: CopyToPromptDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant={"outline"}>
          <Sparkles />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Generate with AI</DialogTitle>
          <DialogDescription className="sr-only">Description</DialogDescription>
        </DialogHeader>
        <CopyToPrompt initialSubject={initialSubject} />
      </DialogContent>
    </Dialog>
  )
}

// ── Popover wrapper ───────────────────────────────────────────────────────────

export function CopyToPromptPopover({
  initialSubject,
}: CopyToPromptDialogProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Sparkles />
          Generate with AI
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[500px]"
        align="start"
        side="right"
        sideOffset={24}
      >
        <CopyToPrompt initialSubject={initialSubject} />
      </PopoverContent>
    </Popover>
  )
}
