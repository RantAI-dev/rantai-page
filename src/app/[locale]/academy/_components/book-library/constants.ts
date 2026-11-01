/** One colour per book category: a dot on the filters, a tag on the cards. */
export const categoryTones: Record<string, { tone: string; text: string }> = {
  Foundation: { tone: "#10b981", text: "#047857" },
  Architecture: { tone: "#8b5cf6", text: "#6d28d9" },
  Algorithms: { tone: "#f59e0b", text: "#b45309" },
  "AI/ML": { tone: "#0ea5e9", text: "#0369a1" },
  Business: { tone: "#f43f5e", text: "#be123c" },
  Data: { tone: "#14b8a6", text: "#0f766e" },
  Blockchain: { tone: "#f97316", text: "#c2410c" },
  Science: { tone: "#6366f1", text: "#4338ca" },
}

export const fallbackTone = { tone: "#737373", text: "#525252" }
