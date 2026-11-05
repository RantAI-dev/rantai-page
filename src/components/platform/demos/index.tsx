// Interactive product demos for the platform reel, one file per product.
// Shared pieces (the desk, cards, typing, scripts, chips) live in shared.tsx.
import { AgentsDemo } from "./agents"
import { ClawDemo } from "./claw"
import { LakeDemo } from "./lake"
import { LlmopsDemo } from "./llmops"

export { DemoChipSlot } from "./shared"

export const demos: Record<
  string,
  (p: { active?: boolean }) => React.JSX.Element
> = {
  agents: AgentsDemo,
  claw: ClawDemo,
  llmops: LlmopsDemo,
  lake: LakeDemo,
}
