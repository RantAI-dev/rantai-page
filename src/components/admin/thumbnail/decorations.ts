export type DecoKey =
  | "circles"
  | "squares"
  | "hexagons"
  | "grid"
  | "diagonals"
  | "waves"
  | "triangles"
  | "none";

export interface DecoOption {
  key: DecoKey;
  label: string;
  preview: string;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

function decoCircles(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.lineWidth = 3;
  for (const c of [
    { x: w * 0.5,  y: h * 0.5, r: h * 0.38 },
    { x: w * 0.5,  y: h * 0.5, r: h * 0.56 },
    { x: w * 0.18, y: h * 0.5, r: h * 0.22 },
    { x: w * 0.82, y: h * 0.5, r: h * 0.22 },
  ]) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function decoSquares(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 3;
  for (const s of [h * 0.35, h * 0.55, h * 0.72, h * 0.88]) {
    ctx.strokeRect(w / 2 - s / 2, h / 2 - s / 2, s, s);
  }
  const sq = h * 0.18;
  ctx.strokeRect(w * 0.05,      h / 2 - sq / 2, sq, sq);
  ctx.strokeRect(w * 0.95 - sq, h / 2 - sq / 2, sq, sq);
  ctx.restore();
}

function decoHexagons(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.lineWidth = 3;
  const hex = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      i === 0
        ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
        : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.stroke();
  };
  hex(w * 0.5,  h * 0.5, h * 0.38);
  hex(w * 0.5,  h * 0.5, h * 0.56);
  hex(w * 0.18, h * 0.5, h * 0.20);
  hex(w * 0.82, h * 0.5, h * 0.20);
  ctx.restore();
}

function decoGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  const step = h * 0.08;
  for (let x = step; x < w; x += step)
    for (let y = step; y < h; y += step) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  ctx.restore();
}

function decoDiagonals(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;
  const spacing = h * 0.12;
  for (let d = -(w + h); d < w + h; d += spacing) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + h, h);
    ctx.stroke();
  }
  ctx.restore();
}

function decoWaves(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2.5;
  const rows = 8;
  const amp  = h * 0.04;
  const freq = (Math.PI * 2) / (w * 0.25);
  for (let row = 0; row < rows; row++) {
    const y0 = (h / (rows + 1)) * (row + 1);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = y0 + Math.sin(x * freq + row * 0.8) * amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function decoTriangles(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 3;
  const tri = (cx: number, cy: number, size: number) => {
    const h2 = size * (Math.sqrt(3) / 2);
    ctx.beginPath();
    ctx.moveTo(cx,            cy - size * 0.6);
    ctx.lineTo(cx + size / 2, cy + h2 * 0.4);
    ctx.lineTo(cx - size / 2, cy + h2 * 0.4);
    ctx.closePath();
    ctx.stroke();
  };
  tri(w * 0.5,  h * 0.5, h * 0.75);
  tri(w * 0.5,  h * 0.5, h * 0.50);
  tri(w * 0.18, h * 0.5, h * 0.35);
  tri(w * 0.82, h * 0.5, h * 0.35);
  ctx.restore();
}

export const DECO_OPTIONS: DecoOption[] = [
  {
    key: "circles", label: "Circles",
    preview: `<circle cx="20" cy="12" r="9" fill="none" stroke="white" stroke-width="1.5" opacity=".7"/><circle cx="20" cy="12" r="5" fill="none" stroke="white" stroke-width="1.5" opacity=".5"/><circle cx="6" cy="12" r="4" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/><circle cx="34" cy="12" r="4" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/>`,
    draw: decoCircles,
  },
  {
    key: "squares", label: "Squares",
    preview: `<rect x="13" y="5" width="14" height="14" fill="none" stroke="white" stroke-width="1.5" opacity=".7"/><rect x="9" y="2" width="22" height="20" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/><rect x="2" y="8" width="8" height="8" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/><rect x="30" y="8" width="8" height="8" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/>`,
    draw: decoSquares,
  },
  {
    key: "hexagons", label: "Hexagons",
    preview: `<polygon points="20,4 27,8 27,16 20,20 13,16 13,8" fill="none" stroke="white" stroke-width="1.5" opacity=".7"/><polygon points="20,1 30,6.5 30,17.5 20,23 10,17.5 10,6.5" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/><polygon points="6,8 10,10 10,14 6,16 2,14 2,10" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/><polygon points="34,8 38,10 38,14 34,16 30,14 30,10" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/>`,
    draw: decoHexagons,
  },
  {
    key: "grid", label: "Dot Grid",
    preview: Array.from({ length: 15 }, (_, i) =>
      `<circle cx="${6 + (i % 5) * 7}" cy="${4 + Math.floor(i / 5) * 8}" r="1.5" fill="white" opacity=".6"/>`
    ).join(""),
    draw: decoGrid,
  },
  {
    key: "diagonals", label: "Diagonals",
    preview: [0, 8, 16, 24, 32, 40]
      .map((x) => `<line x1="${x}" y1="0" x2="${x + 24}" y2="24" stroke="white" stroke-width="1.5" opacity=".5"/>`)
      .join(""),
    draw: decoDiagonals,
  },
  {
    key: "waves", label: "Waves",
    preview: [4, 8, 12, 16, 20]
      .map((y, i) =>
        `<path d="M0 ${y} Q5 ${y - 3 + (i % 2) * 6} 10 ${y} Q15 ${y + 3 - (i % 2) * 6} 20 ${y} Q25 ${y - 3 + (i % 2) * 6} 30 ${y} Q35 ${y + 3 - (i % 2) * 6} 40 ${y}" fill="none" stroke="white" stroke-width="1.5" opacity=".55"/>`
      )
      .join(""),
    draw: decoWaves,
  },
  {
    key: "triangles", label: "Triangles",
    preview: `<polygon points="20,2 33,22 7,22" fill="none" stroke="white" stroke-width="1.5" opacity=".7"/><polygon points="20,6 29,20 11,20" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/><polygon points="6,8 12,20 0,20" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/><polygon points="34,8 40,20 28,20" fill="none" stroke="white" stroke-width="1.5" opacity=".4"/>`,
    draw: decoTriangles,
  },
  {
    key: "none", label: "None",
    preview: `<line x1="4" y1="4" x2="36" y2="20" stroke="white" stroke-width="1.5" opacity=".3"/><line x1="36" y1="4" x2="4" y2="20" stroke="white" stroke-width="1.5" opacity=".3"/>`,
    draw: () => {},
  },
];
