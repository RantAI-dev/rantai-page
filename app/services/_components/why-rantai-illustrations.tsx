const SVG_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-full w-full",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
} as const

const ANIMATIONS = `
  @keyframes flow-dash { to { stroke-dashoffset: -36; } }
  @keyframes pulse-ring { 0% { r: 8; opacity: 0.6; } 100% { r: 28; opacity: 0; } }
  @keyframes pulse-ring-lg { 0% { r: 14; opacity: 0.4; } 100% { r: 42; opacity: 0; } }
  @keyframes float-y { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
  @keyframes node-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.85; } }
  @keyframes badge-orbit { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(0,-4px); } }
  @keyframes blink { 0%, 90%, 100% { opacity: 1; } 95% { opacity: 0.3; } }
  @keyframes gauge-needle {
    0%   { transform: rotate(-180deg); }
    60%  { transform: rotate(-22deg); }
    90%  { transform: rotate(-22deg); }
    100% { transform: rotate(-180deg); }
  }
  @keyframes gauge-fill {
    0%   { stroke-dashoffset: 100; }
    60%  { stroke-dashoffset: 0; }
    90%  { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 100; }
  }
  @keyframes gauge-color {
    0%, 18%  { stroke: #DC2626; }
    32%      { stroke: #EF9F27; }
    48%, 95% { stroke: #1D9E75; }
    100%     { stroke: #DC2626; }
  }
  @keyframes gauge-text {
    0%, 55%   { opacity: 0; }
    65%, 92%  { opacity: 1; }
    100%      { opacity: 0; }
  }
  .flow-line { stroke-dasharray: 6 6; animation: flow-dash 1.6s linear infinite; }
  .float-1 { animation: float-y 3.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  .float-2 { animation: float-y 3.6s ease-in-out infinite 0.4s; transform-box: fill-box; transform-origin: center; }
  .float-3 { animation: float-y 3.4s ease-in-out infinite 0.8s; transform-box: fill-box; transform-origin: center; }
  .pulse-1 { animation: pulse-ring 2.4s ease-out infinite; }
  .pulse-2 { animation: pulse-ring-lg 2.4s ease-out infinite 0.6s; }
  .gauge-needle { transform-origin: 200px 210px; transform-box: view-box; animation: gauge-needle 5s linear infinite; }
  .gauge-fill { animation: gauge-fill 5s linear infinite, gauge-color 5s linear infinite; }
  .gauge-text { animation: gauge-text 5s linear infinite; }
  .node-emphasis { animation: node-pulse 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  .badge-1 { animation: badge-orbit 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  .badge-2 { animation: badge-orbit 3.3s ease-in-out infinite 0.3s; transform-box: fill-box; transform-origin: center; }
  .badge-3 { animation: badge-orbit 3.5s ease-in-out infinite 0.6s; transform-box: fill-box; transform-origin: center; }
  .badge-4 { animation: badge-orbit 3.1s ease-in-out infinite 0.9s; transform-box: fill-box; transform-origin: center; }
  .blink-dot { animation: blink 3s ease-in-out infinite; }
`

function StyleBlock() {
  return <style>{ANIMATIONS}</style>
}

export function ProductsIllustration() {
  return (
    <svg viewBox="0 0 400 280" {...SVG_PROPS}>
      <StyleBlock />

      {/* Platform base — isometric */}
      <polygon points="200,140 340,200 200,260 60,200" fill="rgba(127,119,221,0.12)" stroke="#7F77DD" strokeWidth="1.5" />
      <polygon points="60,200 200,260 200,275 60,215" fill="rgba(127,119,221,0.06)" stroke="#7F77DD" strokeWidth="1.2" />
      <polygon points="340,200 200,260 200,275 340,215" fill="rgba(127,119,221,0.04)" stroke="#7F77DD" strokeWidth="1.2" />

      {/* Product 1 — left */}
      <g className="float-1">
        <polygon points="120,118 150,130 120,142 90,130" fill="rgba(127,119,221,0.28)" stroke="#7F77DD" strokeWidth="1.3" />
        <polygon points="90,130 120,142 120,178 90,166" fill="rgba(127,119,221,0.16)" stroke="#7F77DD" strokeWidth="1.1" />
        <polygon points="150,130 120,142 120,178 150,166" fill="rgba(127,119,221,0.1)" stroke="#7F77DD" strokeWidth="1.1" />
        <text x="120" y="136" textAnchor="middle" fontSize="11" fill="#AFA9EC" fontWeight="600">AGENT</text>
      </g>

      {/* Product 2 — center, elevated */}
      <g className="float-2">
        <polygon points="200,86 230,98 200,110 170,98" fill="rgba(127,119,221,0.32)" stroke="#7F77DD" strokeWidth="1.3" />
        <polygon points="170,98 200,110 200,146 170,134" fill="rgba(127,119,221,0.2)" stroke="#7F77DD" strokeWidth="1.1" />
        <polygon points="230,98 200,110 200,146 230,134" fill="rgba(127,119,221,0.14)" stroke="#7F77DD" strokeWidth="1.1" />
        <text x="200" y="104" textAnchor="middle" fontSize="11" fill="#AFA9EC" fontWeight="600">ANALYTICS</text>
      </g>

      {/* Product 3 — right */}
      <g className="float-3">
        <polygon points="280,118 310,130 280,142 250,130" fill="rgba(127,119,221,0.28)" stroke="#7F77DD" strokeWidth="1.3" />
        <polygon points="250,130 280,142 280,178 250,166" fill="rgba(127,119,221,0.16)" stroke="#7F77DD" strokeWidth="1.1" />
        <polygon points="310,130 280,142 280,178 310,166" fill="rgba(127,119,221,0.1)" stroke="#7F77DD" strokeWidth="1.1" />
        <text x="280" y="136" textAnchor="middle" fontSize="11" fill="#AFA9EC" fontWeight="600">ZRC</text>
      </g>
    </svg>
  )
}

export function NoLockInIllustration() {
  return (
    <svg viewBox="0 0 400 280" {...SVG_PROPS}>
      <StyleBlock />
      <defs>
        <marker id="arr-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* Pulse rings */}
      <circle cx="200" cy="140" r="14" fill="none" stroke="#1D9E75" strokeWidth="1" className="pulse-2" />

      {/* Center hub */}
      <circle cx="200" cy="140" r="44" fill="rgba(29,158,117,0.06)" stroke="#1D9E75" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="200" cy="140" r="32" fill="rgba(29,158,117,0.2)" stroke="#1D9E75" strokeWidth="1.8" />
      <text x="200" y="138" textAnchor="middle" fontSize="13" fill="#5DCAA5" fontWeight="700">RantAI</text>
      <text x="200" y="153" textAnchor="middle" fontSize="9" fill="rgba(93,202,165,0.6)" letterSpacing="0.1em">CORE</text>

      {/* LLM nodes */}
      <rect x="30" y="40" width="78" height="32" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <text x="69" y="60" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.7)" fontWeight="500">OpenAI</text>

      <rect x="292" y="40" width="78" height="32" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <text x="331" y="60" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.7)" fontWeight="500">Claude</text>

      <rect x="30" y="208" width="78" height="32" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <text x="69" y="228" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.7)" fontWeight="500">Gemini</text>

      <rect x="292" y="208" width="78" height="32" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <text x="331" y="228" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.7)" fontWeight="500">Llama</text>

      {/* Animated flow lines */}
      <line x1="108" y1="56" x2="170" y2="118" stroke="#1D9E75" strokeWidth="1.5" markerEnd="url(#arr-teal)" className="flow-line" />
      <line x1="292" y1="56" x2="230" y2="118" stroke="#1D9E75" strokeWidth="1.5" markerEnd="url(#arr-teal)" className="flow-line" style={{ animationDelay: "0.3s" }} />
      <line x1="108" y1="224" x2="170" y2="162" stroke="#1D9E75" strokeWidth="1.5" markerEnd="url(#arr-teal)" className="flow-line" style={{ animationDelay: "0.6s" }} />
      <line x1="292" y1="224" x2="230" y2="162" stroke="#1D9E75" strokeWidth="1.5" markerEnd="url(#arr-teal)" className="flow-line" style={{ animationDelay: "0.9s" }} />
    </svg>
  )
}

export function LocalExpertiseIllustration() {
  return (
    <svg viewBox="0 0 400 280" {...SVG_PROPS}>
      <StyleBlock />

      {/* Indonesia archipelago */}
      <path d="M50,110 Q70,90 100,95 Q120,90 130,115 Q120,135 95,135 Q70,138 55,130 Z" fill="rgba(239,159,39,0.15)" stroke="#EF9F27" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M115,145 Q150,135 200,142 Q240,138 280,148 Q260,162 220,162 Q180,164 140,160 Q120,158 115,150 Z" fill="rgba(239,159,39,0.18)" stroke="#EF9F27" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M180,75 Q220,60 260,72 Q280,85 275,105 Q260,118 230,115 Q200,112 185,100 Z" fill="rgba(239,159,39,0.13)" stroke="#EF9F27" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M290,85 Q310,75 320,90 Q325,110 310,118 Q298,108 295,98 Z" fill="rgba(239,159,39,0.13)" stroke="#EF9F27" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M340,120 Q360,115 370,130 Q372,150 358,155 Q345,148 340,135 Z" fill="rgba(239,159,39,0.13)" stroke="#EF9F27" strokeWidth="1.1" strokeLinejoin="round" />

      {/* Pulse rings around pin */}
      <circle cx="178" cy="152" r="8" fill="none" stroke="#EF9F27" strokeWidth="1.2" className="pulse-1" />
      <circle cx="178" cy="152" r="8" fill="none" stroke="#EF9F27" strokeWidth="1" className="pulse-2" />

      {/* Pin */}
      <circle cx="178" cy="152" r="8" fill="rgba(239,159,39,0.35)" stroke="#EF9F27" strokeWidth="1.5" />
      <circle cx="178" cy="152" r="3.5" fill="#EF9F27" />

      {/* Pin stem to flag */}
      <line x1="178" y1="144" x2="178" y2="112" stroke="#EF9F27" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="180" y="98" width="46" height="22" rx="3" fill="rgba(239,159,39,0.15)" stroke="#EF9F27" strokeWidth="1.2" />
      <text x="203" y="113" textAnchor="middle" fontSize="11" fill="#FAC775" fontWeight="600">DEPOK, ID</text>

      {/* Bottom badges */}
      <g className="badge-1">
        <rect x="50" y="220" width="92" height="26" rx="6" fill="rgba(239,159,39,0.08)" stroke="rgba(239,159,39,0.3)" strokeWidth="1" />
        <text x="96" y="237" textAnchor="middle" fontSize="11" fill="#FAC775">Government</text>
      </g>
      <g className="badge-2">
        <rect x="154" y="220" width="92" height="26" rx="6" fill="rgba(239,159,39,0.08)" stroke="rgba(239,159,39,0.3)" strokeWidth="1" />
        <text x="200" y="237" textAnchor="middle" fontSize="11" fill="#FAC775">Compliance</text>
      </g>
      <g className="badge-3">
        <rect x="258" y="220" width="92" height="26" rx="6" fill="rgba(239,159,39,0.08)" stroke="rgba(239,159,39,0.3)" strokeWidth="1" />
        <text x="304" y="237" textAnchor="middle" fontSize="11" fill="#FAC775">Enterprise</text>
      </g>
    </svg>
  )
}

export function ProductionGradeIllustration() {
  /*
    Gauge geometry — center (200, 210), radius 130.
    Endpoints lie exactly on the circle:
      θ=180° → (70, 210)       — 0% (left)
      θ=22°  → (320.55, 161.31) — 99.9% (upper-right)
      θ=0°   → (330, 210)       — 100% (right)
    Needle base points right at (295, 210); animated rotation -180° → -22°.
  */
  return (
    <svg viewBox="0 0 400 280" {...SVG_PROPS}>
      <StyleBlock />

      {/* Track — full semicircle, faint */}
      <path d="M 70 210 A 130 130 0 0 1 330 210" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="22" strokeLinecap="round" />

      {/* Animated filled arc — pathLength normalized to 100 */}
      <path
        d="M 70 210 A 130 130 0 0 1 320.55 161.31"
        fill="none"
        strokeWidth="22"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100}
        className="gauge-fill"
      />

      {/* Tick marks (static) */}
      <line x1="70" y1="210" x2="84" y2="210" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="108.07" y1="118.07" x2="118.93" y2="127.78" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="200" y1="80" x2="200" y2="94" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="291.93" y1="118.07" x2="281.07" y2="127.78" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="330" y1="210" x2="316" y2="210" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Animated needle — base points right, rotates from -180° (0%) → -22° (99.9%) */}
      <g className="gauge-needle">
        <line x1="200" y1="210" x2="295" y2="210" stroke="#5DCAA5" strokeWidth="3" strokeLinecap="round" />
        <circle cx="200" cy="210" r="10" fill="#1D9E75" stroke="#0a0a0a" strokeWidth="3" />
      </g>

      {/* Readout — fades in at end of sweep */}
      <g className="gauge-text">
        <text x="200" y="190" textAnchor="middle" fontSize="44" fill="#5DCAA5" fontWeight="500" letterSpacing="-0.02em">99.9%</text>
        <text x="200" y="208" textAnchor="middle" fontSize="11" fill="rgba(93,202,165,0.6)" letterSpacing="0.2em">UPTIME</text>
      </g>

      {/* Scale labels */}
      <text x="64" y="240" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.35)">0%</text>
      <text x="336" y="240" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.35)">100%</text>
    </svg>
  )
}

export function EndToEndIllustration() {
  return (
    <svg viewBox="0 0 400 280" {...SVG_PROPS}>
      <StyleBlock />
      <defs>
        <marker id="arr-purple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* Animated track */}
      <line x1="50" y1="140" x2="350" y2="140" stroke="rgba(127,119,221,0.3)" strokeWidth="1.5" className="flow-line" />

      {/* Nodes */}
      <g>
        <circle cx="60" cy="140" r="26" fill="rgba(127,119,221,0.12)" stroke="#7F77DD" strokeWidth="1.5" />
        <text x="60" y="144" textAnchor="middle" fontSize="12" fill="#AFA9EC" fontWeight="600">Plan</text>
        <text x="60" y="186" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)" letterSpacing="0.05em">Strategy</text>
        <line x1="88" y1="140" x2="132" y2="140" stroke="#7F77DD" strokeWidth="1.5" markerEnd="url(#arr-purple)" />
      </g>
      <g>
        <circle cx="160" cy="140" r="26" fill="rgba(127,119,221,0.12)" stroke="#7F77DD" strokeWidth="1.5" />
        <text x="160" y="144" textAnchor="middle" fontSize="12" fill="#AFA9EC" fontWeight="600">Build</text>
        <text x="160" y="186" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)" letterSpacing="0.05em">Engineer</text>
        <line x1="188" y1="140" x2="212" y2="140" stroke="#7F77DD" strokeWidth="1.5" markerEnd="url(#arr-purple)" />
      </g>

      {/* Deploy — emphasized with pulse */}
      <g>
        <circle cx="240" cy="140" r="26" fill="rgba(127,119,221,0.18)" stroke="#7F77DD" strokeWidth="2" />
        <circle cx="240" cy="140" r="26" fill="none" stroke="#7F77DD" strokeWidth="1" className="pulse-2" />
        <text x="240" y="144" textAnchor="middle" fontSize="12" fill="#AFA9EC" fontWeight="600">Deploy</text>
        <text x="240" y="186" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)" letterSpacing="0.05em">Launch</text>
        <line x1="268" y1="140" x2="312" y2="140" stroke="#7F77DD" strokeWidth="1.5" markerEnd="url(#arr-purple)" />
      </g>
      <g>
        <circle cx="340" cy="140" r="26" fill="rgba(127,119,221,0.12)" stroke="#7F77DD" strokeWidth="1.5" />
        <text x="340" y="144" textAnchor="middle" fontSize="12" fill="#AFA9EC" fontWeight="600">Run</text>
        <text x="340" y="186" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)" letterSpacing="0.05em">Support</text>
      </g>

      {/* Brace */}
      <path
        d="M50,212 L50,222 Q50,230 58,230 L196,230 Q200,230 200,236 Q200,230 204,230 L342,230 Q350,230 350,222 L350,212"
        fill="none"
        stroke="rgba(127,119,221,0.4)"
        strokeWidth="1.2"
      />
      <text x="200" y="258" textAnchor="middle" fontSize="11" fill="#AFA9EC" fontWeight="500" letterSpacing="0.1em">
        ONE PARTNER · FULL LIFECYCLE
      </text>
    </svg>
  )
}

export function OpenStandardsIllustration() {
  return (
    <svg viewBox="0 0 400 280" {...SVG_PROPS}>
      <StyleBlock />

      {/* Lock body */}
      <rect x="140" y="130" width="120" height="100" rx="14" fill="rgba(99,153,34,0.12)" stroke="#639922" strokeWidth="2" />

      {/* Shackle — open */}
      <path
        d="M165,130 L165,82 Q165,46 200,46 Q235,46 235,82 L235,102"
        fill="none"
        stroke="#639922"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Keyhole */}
      <circle cx="200" cy="172" r="13" fill="rgba(99,153,34,0.2)" stroke="#639922" strokeWidth="1.2" />
      <circle cx="200" cy="172" r="6" fill="#639922" opacity="0.8" className="blink-dot" />
      <rect x="196" y="178" width="8" height="18" rx="2" fill="#639922" opacity="0.8" />

      {/* Orbiting badges */}
      <g className="badge-1">
        <circle cx="64" cy="80" r="22" fill="rgba(29,158,117,0.15)" stroke="#1D9E75" strokeWidth="1.4" />
        <text x="64" y="85" textAnchor="middle" fontSize="11" fill="#5DCAA5" fontWeight="700">OS</text>
      </g>
      <g className="badge-2">
        <circle cx="336" cy="80" r="22" fill="rgba(55,138,221,0.15)" stroke="#378ADD" strokeWidth="1.4" />
        <text x="336" y="85" textAnchor="middle" fontSize="11" fill="#85B7EB" fontWeight="700">API</text>
      </g>
      <g className="badge-3">
        <circle cx="52" cy="180" r="20" fill="rgba(239,159,39,0.15)" stroke="#EF9F27" strokeWidth="1.4" />
        <text x="52" y="184" textAnchor="middle" fontSize="10" fill="#FAC775" fontWeight="700">IaC</text>
      </g>
      <g className="badge-4">
        <circle cx="348" cy="180" r="20" fill="rgba(127,119,221,0.15)" stroke="#7F77DD" strokeWidth="1.4" />
        <text x="348" y="184" textAnchor="middle" fontSize="10" fill="#AFA9EC" fontWeight="700">SDK</text>
      </g>

      {/* Leader lines */}
      <line x1="84" y1="92" x2="148" y2="142" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="316" y1="92" x2="252" y2="142" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="72" y1="178" x2="140" y2="178" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="328" y1="178" x2="260" y2="178" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 3" />

      {/* Footer */}
      <text x="200" y="262" textAnchor="middle" fontSize="11" fill="#97C459" fontWeight="500" letterSpacing="0.1em">
        NO BLACK BOXES · FULL AUDITABILITY
      </text>
    </svg>
  )
}

export const whyRantAIIllustrations = [
  ProductsIllustration,
  NoLockInIllustration,
  LocalExpertiseIllustration,
  ProductionGradeIllustration,
  EndToEndIllustration,
  OpenStandardsIllustration,
]
