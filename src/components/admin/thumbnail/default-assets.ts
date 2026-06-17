export interface DefaultAsset {
  key: string
  label: string
  url: string
}

function svg(content: string): string {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${content}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
}

function starPoints(spikes: number, outer: number, inner: number): string {
  const pts: string[] = []
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI / spikes) * i - Math.PI / 2
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`)
  }
  return pts.join(" ")
}

export const DEFAULT_ASSETS: DefaultAsset[] = [
  {
    key: "circle",
    label: "Circle",
    url: svg(`<circle cx="50" cy="50" r="46" fill="white"/>`),
  },
  {
    key: "ring",
    label: "Ring",
    url: svg(`<circle cx="50" cy="50" r="40" fill="none" stroke="white" stroke-width="14"/>`),
  },
  {
    key: "square",
    label: "Square",
    url: svg(`<rect x="8" y="8" width="84" height="84" rx="10" fill="white"/>`),
  },
  {
    key: "triangle",
    label: "Triangle",
    url: svg(`<polygon points="50,8 93,88 7,88" fill="white"/>`),
  },
  {
    key: "diamond",
    label: "Diamond",
    url: svg(`<polygon points="50,7 93,50 50,93 7,50" fill="white"/>`),
  },
  {
    key: "hexagon",
    label: "Hexagon",
    url: svg(`<polygon points="50,7 88,28 88,72 50,93 12,72 12,28" fill="white"/>`),
  },
  {
    key: "star",
    label: "Star",
    url: svg(`<polygon points="50,6 61,36 93,36 68,56 77,86 50,67 23,86 32,56 7,36 39,36" fill="white"/>`),
  },
  {
    key: "cross",
    label: "Cross",
    url: svg(`<path d="M36,8 h28 v28 h28 v28 h-28 v28 h-28 v-28 h-28 v-28 h28 z" fill="white"/>`),
  },
  {
    key: "arrow",
    label: "Arrow",
    url: svg(`<path d="M8,38 L60,38 L60,18 L92,50 L60,82 L60,62 L8,62 Z" fill="white"/>`),
  },
  {
    key: "lightning",
    label: "Lightning",
    url: svg(`<polygon points="58,5 22,54 46,54 42,95 78,46 54,46" fill="white"/>`),
  },
  {
    key: "pentagon",
    label: "Pentagon",
    url: svg(`<polygon points="50,7 90,37 75,87 25,87 10,37" fill="white"/>`),
  },
  {
    key: "octagon",
    label: "Octagon",
    url: svg(`<polygon points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32" fill="white"/>`),
  },
  {
    key: "sparkle",
    label: "Sparkle",
    url: svg(`<polygon points="${starPoints(4, 46, 16)}" fill="white"/>`),
  },
  {
    key: "burst",
    label: "Burst",
    url: svg(`<polygon points="${starPoints(8, 46, 22)}" fill="white"/>`),
  },
  {
    key: "heart",
    label: "Heart",
    url: svg(`<path d="M50,88 C12,60 8,32 28,20 C40,13 50,22 50,30 C50,22 60,13 72,20 C92,32 88,60 50,88 Z" fill="white"/>`),
  },
  {
    key: "shield",
    label: "Shield",
    url: svg(`<path d="M50,6 L88,20 V52 C88,74 72,88 50,95 C28,88 12,74 12,52 V20 Z" fill="white"/>`),
  },
  {
    key: "play",
    label: "Play",
    url: svg(`<polygon points="22,12 22,88 86,50" fill="white"/>`),
  },
  {
    key: "chevron",
    label: "Chevron",
    url: svg(`<path d="M50,18 L92,60 L80,72 L50,42 L20,72 L8,60 Z" fill="white"/>`),
  },
  {
    key: "droplet",
    label: "Droplet",
    url: svg(`<path d="M50,8 C50,8 82,46 82,64 A32,32 0 1 1 18,64 C18,46 50,8 50,8 Z" fill="white"/>`),
  },
  {
    key: "crescent",
    label: "Crescent",
    url: svg(`<path d="M50,6 A44,44 0 1 0 50,94 A34,34 0 1 1 50,6 Z" fill="white"/>`),
  },
]
