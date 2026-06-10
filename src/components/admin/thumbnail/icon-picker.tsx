"use client"

import { Suspense } from "react"
import { Search, Upload, X } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface IconPickerProps {
  iconName: string
  iconType: "lucide" | "custom"
  customIconUrl: string | null
  inputRef: React.RefObject<HTMLInputElement | null>
  search: string
  filteredIcons: string[]
  onIconSelect: (name: string) => void
  onSearchChange: (s: string) => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}

export function IconPicker({
  iconName,
  iconType,
  customIconUrl,
  inputRef,
  search,
  filteredIcons,
  onIconSelect,
  onSearchChange,
  onUpload,
  onClear,
}: IconPickerProps) {
  return (
    <div className="mb-5">
      <p className="mb-3 text-sm font-semibold">Assets</p>

      <div className="relative mb-2">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search icon..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 text-xs"
        />
      </div>

      <div className="mb-2 max-h-48 overflow-y-auto rounded-md border border-border p-1.5">
        <div className="grid grid-cols-4 gap-1">
          {filteredIcons.map((name) => (
            <button
              key={name}
              title={name}
              onClick={() => onIconSelect(name)}
              className={`flex items-center justify-center rounded border p-2 transition-colors ${
                iconType === "lucide" && iconName === name
                  ? "border-foreground bg-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <Suspense fallback={<span className="block h-4 w-4" />}>
                <DynamicIcon
                  name={name as Parameters<typeof DynamicIcon>[0]["name"]}
                  className="h-4 w-4"
                />
              </Suspense>
            </button>
          ))}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".svg,.png,image/svg+xml,image/png"
        className="hidden"
        onChange={onUpload}
      />
      {iconType === "custom" && customIconUrl ? (
        <div className="flex items-center gap-2 rounded-md border border-foreground bg-accent px-3 py-2">
          <img src={customIconUrl} alt="Custom icon" className="h-4 w-4 shrink-0 object-contain" />
          <span className="flex-1 truncate font-mono text-[10px] text-foreground">custom</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClear}>
            <X />
          </Button>
        </div>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => inputRef.current?.click()}>
          <Upload />
          Upload assets
        </Button>
      )}
    </div>
  )
}
