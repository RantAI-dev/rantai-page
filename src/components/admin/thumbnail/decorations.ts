export type DecoKey =
  | "circles"
  | "squares"
  | "hexagons"
  | "grid"
  | "diagonals"
  | "crosshatch"
  | "waves"
  | "triangles"
  | "chevrons"
  | "rings"
  | "plus"
  | "starburst"
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
      if (i === 0) {
        ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      } else {
        ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
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
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
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

function decoCrosshatch(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  const spacing = h * 0.12;
  for (let d = -(w + h); d < w + h; d += spacing) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + h, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(d, h);
    ctx.lineTo(d + h, 0);
    ctx.stroke();
  }
  ctx.restore();
}

function decoChevrons(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 3;
  const size = h * 0.13;
  for (let y = size; y < h + size; y += size * 1.6) {
    for (let x = -size; x < w + size; x += size * 2) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y - size * 0.6);
      ctx.lineTo(x + size * 2, y);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function decoRings(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2.5;
  for (const c of [
    { x: 0.20, y: 0.30, r: 0.16 },
    { x: 0.52, y: 0.58, r: 0.26 },
    { x: 0.78, y: 0.26, r: 0.20 },
    { x: 0.85, y: 0.74, r: 0.13 },
    { x: 0.12, y: 0.74, r: 0.11 },
    { x: 0.42, y: 0.16, r: 0.09 },
  ]) {
    ctx.beginPath();
    ctx.arc(c.x * w, c.y * h, c.r * h, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function decoPlus(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  const step = h * 0.16;
  const arm = step * 0.22;
  for (let x = step; x < w; x += step)
    for (let y = step; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(x - arm, y);
      ctx.lineTo(x + arm, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - arm);
      ctx.lineTo(x, y + arm);
      ctx.stroke();
    }
  ctx.restore();
}

function decoStarburst(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;
  const cx = w / 2;
  const cy = h / 2;
  const len = Math.hypot(w, h);
  const rays = 24;
  for (let i = 0; i < rays; i++) {
    const a = ((Math.PI * 2) / rays) * i;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
    ctx.stroke();
  }
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
    key: "crosshatch", label: "Crosshatch",
    preview: [-12, 0, 12, 24, 36]
      .map((x) =>
        `<line x1="${x}" y1="0" x2="${x + 24}" y2="24" stroke="white" stroke-width="1.2" opacity=".4"/><line x1="${x}" y1="24" x2="${x + 24}" y2="0" stroke="white" stroke-width="1.2" opacity=".4"/>`
      )
      .join(""),
    draw: decoCrosshatch,
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
    key: "chevrons", label: "Chevrons",
    preview: [5, 13, 21]
      .map((y) =>
        [4, 16, 28]
          .map((x) => `<polyline points="${x},${y} ${x + 6},${y - 4} ${x + 12},${y}" fill="none" stroke="white" stroke-width="1.3" opacity=".5"/>`)
          .join("")
      )
      .join(""),
    draw: decoChevrons,
  },
  {
    key: "rings", label: "Rings",
    preview: `<circle cx="10" cy="8" r="5" fill="none" stroke="white" stroke-width="1.3" opacity=".6"/><circle cx="26" cy="14" r="8" fill="none" stroke="white" stroke-width="1.3" opacity=".5"/><circle cx="34" cy="6" r="3.5" fill="none" stroke="white" stroke-width="1.3" opacity=".5"/>`,
    draw: decoRings,
  },
  {
    key: "plus", label: "Plus",
    preview: [6, 18]
      .map((y) =>
        [8, 20, 32]
          .map((x) => `<path d="M${x - 2},${y} h4 M${x},${y - 2} v4" stroke="white" stroke-width="1.3" opacity=".55"/>`)
          .join("")
      )
      .join(""),
    draw: decoPlus,
  },
  {
    key: "starburst", label: "Starburst",
    preview: Array.from({ length: 12 }, (_, i) => {
      const a = ((Math.PI * 2) / 12) * i;
      return `<line x1="20" y1="12" x2="${(20 + Math.cos(a) * 20).toFixed(1)}" y2="${(12 + Math.sin(a) * 12).toFixed(1)}" stroke="white" stroke-width="1" opacity=".4"/>`;
    }).join(""),
    draw: decoStarburst,
  },
  {
    key: "none", label: "None",
    preview: `<line x1="4" y1="4" x2="36" y2="20" stroke="white" stroke-width="1.5" opacity=".3"/><line x1="36" y1="4" x2="4" y2="20" stroke="white" stroke-width="1.5" opacity=".3"/>`,
    draw: () => {},
  },
];
