import Image from "next/image"

import { cn } from "@/lib/utils"

// The real product marks, so products are recognised by their logo
// everywhere they appear. "light" is for light backgrounds, "dark" for dark.

export type ProductId = "agents" | "claw" | "llmops" | "lake"

const files: Record<ProductId, { name: string; file: string; ratio: number }> =
  {
    agents: { name: "RantAI Agents", file: "RantAI Agents", ratio: 1.3 },
    claw: { name: "RantAI Claw", file: "RantAIClaw", ratio: 1.06 },
    llmops: { name: "RantAI LLMOps", file: "RantAI LLMOps", ratio: 1 },
    lake: { name: "RantAI Lakehouse", file: "RantAI Lakehouse", ratio: 1.17 },
  }

export function logoSrc(id: ProductId, variant: "light" | "dark" = "light") {
  return `/logo/${files[id].file} ${variant === "light" ? "Light" : "Dark"}.svg`
}

/** Finds the product a display name refers to ("RantAI Lakehouse" → "lake"). */
export function productIdFrom(name: string): ProductId | undefined {
  const n = name.toLowerCase()
  if (n.includes("agents")) return "agents"
  if (n.includes("claw")) return "claw"
  if (n.includes("llmops")) return "llmops"
  if (n.includes("lake")) return "lake"
  return undefined
}

/** The bare mark, sized by height. */
export function ProductLogo({
  id,
  variant = "light",
  className,
}: Readonly<{
  id: ProductId
  variant?: "light" | "dark"
  className?: string
}>) {
  const { ratio } = files[id]
  return (
    <Image
      src={logoSrc(id, variant)}
      alt=""
      width={Math.round(40 * ratio)}
      height={40}
      draggable={false}
      className={cn("h-4 w-auto shrink-0", className)}
    />
  )
}

/** The mark on a small white tile, like an app icon. */
export function ProductTile({
  id,
  className,
  logoClassName,
}: Readonly<{ id: ProductId; className?: string; logoClassName?: string }>) {
  return (
    <span
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-md bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.06]",
        className
      )}
    >
      <ProductLogo id={id} className={cn("h-3.5", logoClassName)} />
    </span>
  )
}
