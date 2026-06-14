export interface DefaultAsset {
  key: string
  label: string
  url: string
}

function svg(content: string): string {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${content}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
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
]
