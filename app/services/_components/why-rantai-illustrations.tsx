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
      <polygon
        points="200,140 340,200 200,260 60,200"
        fill="rgba(127,119,221,0.12)"
        stroke="#7F77DD"
        strokeWidth="1.5"
      />
      <polygon
        points="60,200 200,260 200,275 60,215"
        fill="rgba(127,119,221,0.06)"
        stroke="#7F77DD"
        strokeWidth="1.2"
      />
      <polygon
        points="340,200 200,260 200,275 340,215"
        fill="rgba(127,119,221,0.04)"
        stroke="#7F77DD"
        strokeWidth="1.2"
      />

      {/* Product 1 — left */}
      <g className="float-1">
        <polygon
          points="120,118 150,130 120,142 90,130"
          fill="rgba(127,119,221,0.28)"
          stroke="#7F77DD"
          strokeWidth="1.3"
        />
        <polygon
          points="90,130 120,142 120,178 90,166"
          fill="rgba(127,119,221,0.16)"
          stroke="#7F77DD"
          strokeWidth="1.1"
        />
        <polygon
          points="150,130 120,142 120,178 150,166"
          fill="rgba(127,119,221,0.1)"
          stroke="#7F77DD"
          strokeWidth="1.1"
        />
        <text
          x="120"
          y="110"
          textAnchor="middle"
          fontSize="11"
          fill="#AFA9EC"
          fontWeight="600"
        >
          AGENT
        </text>
      </g>

      {/* Product 2 — center, elevated */}
      <g className="float-2">
        <polygon
          points="200,86 230,98 200,110 170,98"
          fill="rgba(127,119,221,0.32)"
          stroke="#7F77DD"
          strokeWidth="1.3"
        />
        <polygon
          points="170,98 200,110 200,146 170,134"
          fill="rgba(127,119,221,0.2)"
          stroke="#7F77DD"
          strokeWidth="1.1"
        />
        <polygon
          points="230,98 200,110 200,146 230,134"
          fill="rgba(127,119,221,0.14)"
          stroke="#7F77DD"
          strokeWidth="1.1"
        />
        <text
          x="200"
          y="80"
          textAnchor="middle"
          fontSize="11"
          fill="#AFA9EC"
          fontWeight="600"
        >
          ANALYTICS
        </text>
      </g>

      {/* Product 3 — right */}
      <g className="float-3">
        <polygon
          points="280,118 310,130 280,142 250,130"
          fill="rgba(127,119,221,0.28)"
          stroke="#7F77DD"
          strokeWidth="1.3"
        />
        <polygon
          points="250,130 280,142 280,178 250,166"
          fill="rgba(127,119,221,0.16)"
          stroke="#7F77DD"
          strokeWidth="1.1"
        />
        <polygon
          points="310,130 280,142 280,178 310,166"
          fill="rgba(127,119,221,0.1)"
          stroke="#7F77DD"
          strokeWidth="1.1"
        />
        <text
          x="280"
          y="110"
          textAnchor="middle"
          fontSize="11"
          fill="#AFA9EC"
          fontWeight="600"
        >
          ZRC
        </text>
      </g>
    </svg>
  )
}

export function NoLockInIllustration() {
  return (
    <svg viewBox="0 0 400 280" {...SVG_PROPS}>
      <StyleBlock />
      <defs>
        <marker
          id="arr-teal"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="#1D9E75"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {/* Pulse rings */}
      <circle
        cx="200"
        cy="140"
        r="14"
        fill="none"
        stroke="#1D9E75"
        strokeWidth="1"
        className="pulse-2"
      />

      {/* Center hub */}
      <circle
        cx="200"
        cy="140"
        r="44"
        fill="rgba(29,158,117,0.06)"
        stroke="#1D9E75"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <circle
        cx="200"
        cy="140"
        r="32"
        fill="rgba(29,158,117,0.2)"
        stroke="#1D9E75"
        strokeWidth="1.8"
      />
      <text
        x="200"
        y="138"
        textAnchor="middle"
        fontSize="13"
        fill="#5DCAA5"
        fontWeight="700"
      >
        RantAI
      </text>
      <text
        x="200"
        y="153"
        textAnchor="middle"
        fontSize="9"
        fill="rgba(93,202,165,0.6)"
        letterSpacing="0.1em"
      >
        CORE
      </text>

      {/* LLM nodes */}
      <rect
        x="30"
        y="40"
        width="78"
        height="32"
        rx="6"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      <text
        x="69"
        y="60"
        textAnchor="middle"
        fontSize="12"
        fill="rgba(255,255,255,0.7)"
        fontWeight="500"
      >
        OpenAI
      </text>

      <rect
        x="292"
        y="40"
        width="78"
        height="32"
        rx="6"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      <text
        x="331"
        y="60"
        textAnchor="middle"
        fontSize="12"
        fill="rgba(255,255,255,0.7)"
        fontWeight="500"
      >
        Claude
      </text>

      <rect
        x="30"
        y="208"
        width="78"
        height="32"
        rx="6"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      <text
        x="69"
        y="228"
        textAnchor="middle"
        fontSize="12"
        fill="rgba(255,255,255,0.7)"
        fontWeight="500"
      >
        Gemini
      </text>

      <rect
        x="292"
        y="208"
        width="78"
        height="32"
        rx="6"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      <text
        x="331"
        y="228"
        textAnchor="middle"
        fontSize="12"
        fill="rgba(255,255,255,0.7)"
        fontWeight="500"
      >
        Llama
      </text>

      {/* Animated flow lines */}
      <line
        x1="108"
        y1="56"
        x2="170"
        y2="118"
        stroke="#1D9E75"
        strokeWidth="1.5"
        markerEnd="url(#arr-teal)"
        className="flow-line"
      />
      <line
        x1="292"
        y1="56"
        x2="230"
        y2="118"
        stroke="#1D9E75"
        strokeWidth="1.5"
        markerEnd="url(#arr-teal)"
        className="flow-line"
        style={{ animationDelay: "0.3s" }}
      />
      <line
        x1="108"
        y1="224"
        x2="170"
        y2="162"
        stroke="#1D9E75"
        strokeWidth="1.5"
        markerEnd="url(#arr-teal)"
        className="flow-line"
        style={{ animationDelay: "0.6s" }}
      />
      <line
        x1="292"
        y1="224"
        x2="230"
        y2="162"
        stroke="#1D9E75"
        strokeWidth="1.5"
        markerEnd="url(#arr-teal)"
        className="flow-line"
        style={{ animationDelay: "0.9s" }}
      />
    </svg>
  )
}

export function LocalExpertiseIllustration() {
  return (
    <svg viewBox="0 0 400 280" {...SVG_PROPS}>
      <StyleBlock />

      {/* Indonesia archipelago */}
      <g
        transform="translate(55 75) scale(1.1)"
        fill="rgba(239,159,39,0.18)"
        stroke="#EF9F27"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M107.399 15.5996L109.599 13.1996L114.199 9.59961L114.099 12.7996L113.999 16.8996L111.299 16.6996L110.199 18.8996L107.399 15.5996Z" />
        <path d="M141.8 110.4L139.4 110.5L132.3 106L137.7 104.7L140.5 106.7L142.3 108.6L141.8 110.4Z" />
        <path d="M166.6 101.7L167.1 103L167 104.9L162.9 109.7L157.9 111.1L157.3 110.4L158 108.2L160.8 104.3L166.6 101.7Z" />
        <path d="M127 96.5996L128.9 98.2996L132.5 97.7996L133.7 100.5L127 101.8L123.1 102.7L120 102.6L122.2 98.8996H125.4L127 96.5996Z" />
        <path d="M155.3 96.5996L154.2 100.2L145.6 102L138.1 101.2L138.3 98.7996L142.9 97.4996L146.3 99.3996L150.1 98.8996L155.3 96.5996Z" />
        <path d="M75.1002 88.1L85.9001 88.8L87.3002 86.1L97.6002 89.2L99.4001 93.4L107.8 94.6L114.5 98.4L107.9 100.8L101.8 98.2L96.7002 98.4L90.9001 97.9L85.7002 96.8L79.3002 94.3L75.2002 93.7L72.8002 94.5L62.6002 91.8L61.8002 89.1L56.7002 88.6L60.9001 82.5L67.7002 82.9L72.1002 85.4L74.5001 85.9L75.1002 88.1Z" />
        <path d="M223 84.4996L219.8 88.8996L219.6 84.0996L220.7 81.7996L222 79.5996L223.2 81.4996L223 84.4996Z" />
        <path d="M181.6 66.8002L179.4 69.0002L175.6 67.8002L174.6 65.0002L180.3 64.7002L181.6 66.8002Z" />
        <path d="M200 64.4996L201.8 69.3996L197.2 66.6996L192.5 66.1996L189.2 66.5996L185.3 66.3996L186.8 62.8996L193.8 62.5996L200 64.4996Z" />
        <path d="M259.8 61.3L258.8 82.2L257.2 103.2L252.6 97.9L247 96.6L245.5 98.4L238.3 98.6L241.1 93.4L244.8 91.6L243.8 84.6L241.5 79.3L230.8 73.8L226.2 73.3L217.9 67.3L216.1 70.5L213.9 71L212.8 68.7L212.9 65.9L208.7 62.7L214.9 60.4L218.9 60.5L218.5 58.8H210.2L208 55L203 53.8L200.7 50.6L208.3 49.1L211.2 47L220.3 49.6L221.2 52L222.5 62.4L228.2 66.2L233.2 59.4L239.8 55.6H244.8L249.6 57.8L253.7 60.1L259.8 61.3Z" />
        <path d="M170.7 35.4996L166.2 41.8996L161.9 43.0996L156.5 41.8996L147 42.1996L142.1 43.0996L141.3 47.9996L146.3 53.6996L149.4 50.7996L160 48.5996L159.5 51.4996L157 50.5996L154.5 54.3996L149.4 56.8996L154.5 65.0996L153.4 67.2996L158.2 74.6996L157.9 78.8996L154.8 80.7996L152.7 78.4996L155.7 73.2996L150 75.7996L148.7 73.9996L149.5 71.4996L145.6 67.6996L146.3 61.4996L142.4 63.3996L142.6 70.8996L142.4 80.0996L138.7 80.9996L136.4 79.1996L138.3 73.2996L137.7 67.0996L135.3 66.9996L133.7 62.5996L136.2 58.3996L137.1 53.2996L140.1 43.5996L141.2 40.9996L146 36.1996L150.5 38.0996L157.6 38.9996L164.1 38.6996L169.7 34.0996L170.7 35.4996Z" />
        <path d="M190.3 37.4002L190 43.0002L187.1 42.3002L186.2 46.2002L188.5 49.6002L186.9 50.4002L184.7 46.3002L183 38.1002L184 33.0002L185.8 30.7002L186.3 34.2002L189.7 34.7002L190.3 37.4002Z" />
        <path d="M82.2994 31.7L83.2994 36L87.1995 39.7L90.8994 38.4L94.4994 38.8L97.7994 35.6L100.499 35L105.899 36.8L110.499 35.4L113.099 26.5L115.199 24.3L116.899 17H123.399L128.399 18.1L125.399 23.9L129.799 29.9L128.899 32.9L135.299 38.8L128.599 39.6L126.799 44L126.999 49.8L121.499 54.2L121.099 60.6L118.599 70.4L117.899 68.1L111.299 71L109.199 67.1L105.199 66.7L102.399 64.6L95.5995 67L93.6995 63.8L89.8994 64.2L85.2994 63.5L84.6995 54.9L81.8994 53.1L79.1995 47.6L78.3994 42L78.9994 36L82.2994 31.7Z" />
        <path d="M59.4995 82.1994L53.2996 82.2994L48.7996 76.9994L41.6996 71.6994L39.3995 67.7994L35.2996 62.5994L32.5996 57.7994L28.3995 48.7994L23.4995 43.3994L21.7996 37.8994L19.5996 32.8994L14.3995 28.8994L11.2996 23.3994L6.89954 19.7994L0.699585 12.6994L0.0996094 9.39941L3.69958 9.6994L12.5996 10.8994L17.7996 17.1994L22.3995 21.5994L25.5996 24.1994L31.0996 31.0994L36.8995 31.1994L41.6996 35.5994L45.0996 40.9994L49.3995 43.9994L47.0996 49.1994L50.3995 51.3994L52.3995 51.5994L53.2996 56.0994L55.1996 59.5994L59.2996 60.1994L61.8995 64.2994L60.1996 72.2994L59.4995 82.1994Z" />
        <path d="M128.4 18.0996L123.4 16.9996H116.9L115.2 24.2996L113.1 26.4996L110.5 35.3996L105.9 36.7996L100.5 34.9996L97.7998 35.5996L94.4998 38.7996L90.8998 38.3996L87.1998 39.6996L83.2998 35.9996L82.2998 31.6996L86.4998 33.8996L90.7998 32.6996L91.7998 27.2996L94.1998 26.0996L101 24.6996L104.8 19.5996L107.4 15.5996L110.2 18.8996L111.3 16.6996L114 16.8996L114.1 12.7996L114.2 9.59961L118.3 5.19962L120.9 0.199615L123.2 0.0996094L126.3 3.39963L126.7 6.19962L130.5 7.99963L135.3 9.89963L135.1 12.3996L131.3 12.6996L132.4 15.8996L128.4 18.0996Z" />
        <path d="M167 104.9L167.1 103L166.6 101.7L167.4 100.2L172.3 98.8002L176.3 98.5002L178.1 97.7002L180.2 98.5002L178 100.3L171.9 103.1L167 104.9Z" />
      </g>

      {/* Pulse rings around pin — Depok, West Java */}
      <circle
        cx="117"
        cy="172"
        r="8"
        fill="none"
        stroke="#EF9F27"
        strokeWidth="1.2"
        className="pulse-1"
      />
      <circle
        cx="117"
        cy="172"
        r="8"
        fill="none"
        stroke="#EF9F27"
        strokeWidth="1"
        className="pulse-2"
      />

      {/* Pin */}
      <circle
        cx="117"
        cy="172"
        r="8"
        fill="rgba(239,159,39,0.35)"
        stroke="#EF9F27"
        strokeWidth="1.5"
      />
      <circle cx="117" cy="172" r="3.5" fill="#EF9F27" />

      {/* Pin stem to flag */}
      <line
        x1="117"
        y1="164"
        x2="117"
        y2="70"
        stroke="#EF9F27"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="77"
        y="48"
        width="80"
        height="22"
        rx="3"
        fill="rgba(239,159,39,0.15)"
        stroke="#EF9F27"
        strokeWidth="1.2"
      />
      <text
        x="117"
        y="63"
        textAnchor="middle"
        fontSize="11"
        fill="#FAC775"
        fontWeight="600"
      >
        DEPOK, ID
      </text>

      {/* Bottom badges */}
      <g className="badge-1">
        <rect
          x="50"
          y="220"
          width="92"
          height="26"
          rx="6"
          fill="rgba(239,159,39,0.08)"
          stroke="rgba(239,159,39,0.3)"
          strokeWidth="1"
        />
        <text x="96" y="237" textAnchor="middle" fontSize="11" fill="#FAC775">
          Government
        </text>
      </g>
      <g className="badge-2">
        <rect
          x="154"
          y="220"
          width="92"
          height="26"
          rx="6"
          fill="rgba(239,159,39,0.08)"
          stroke="rgba(239,159,39,0.3)"
          strokeWidth="1"
        />
        <text x="200" y="237" textAnchor="middle" fontSize="11" fill="#FAC775">
          Compliance
        </text>
      </g>
      <g className="badge-3">
        <rect
          x="258"
          y="220"
          width="92"
          height="26"
          rx="6"
          fill="rgba(239,159,39,0.08)"
          stroke="rgba(239,159,39,0.3)"
          strokeWidth="1"
        />
        <text x="304" y="237" textAnchor="middle" fontSize="11" fill="#FAC775">
          Enterprise
        </text>
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
      <path
        d="M 70 210 A 130 130 0 0 1 330 210"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="22"
        strokeLinecap="round"
      />

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
      <line
        x1="70"
        y1="210"
        x2="84"
        y2="210"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="108.07"
        y1="118.07"
        x2="118.93"
        y2="127.78"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="200"
        y1="80"
        x2="200"
        y2="94"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="291.93"
        y1="118.07"
        x2="281.07"
        y2="127.78"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="330"
        y1="210"
        x2="316"
        y2="210"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Animated needle — base points right, rotates from -180° (0%) → -22° (99.9%) */}
      <g className="gauge-needle">
        <line
          x1="200"
          y1="210"
          x2="295"
          y2="210"
          stroke="#5DCAA5"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="200"
          cy="210"
          r="10"
          fill="#1D9E75"
          stroke="#0a0a0a"
          strokeWidth="3"
        />
      </g>

      {/* Readout — fades in at end of sweep */}
      <g className="gauge-text">
        <text
          x="200"
          y="160"
          textAnchor="middle"
          fontSize="44"
          fill="#5DCAA5"
          fontWeight="500"
          letterSpacing="-0.02em"
        >
          99.9%
        </text>
        <text
          x="200"
          y="180"
          textAnchor="middle"
          fontSize="11"
          fill="rgba(93,202,165,0.6)"
          letterSpacing="0.2em"
        >
          UPTIME
        </text>
      </g>

      {/* Scale labels */}
      <text
        x="64"
        y="240"
        textAnchor="middle"
        fontSize="11"
        fill="rgba(255,255,255,0.35)"
      >
        0%
      </text>
      <text
        x="336"
        y="240"
        textAnchor="middle"
        fontSize="11"
        fill="rgba(255,255,255,0.35)"
      >
        100%
      </text>
    </svg>
  )
}

export function EndToEndIllustration() {
  return (
    <svg viewBox="0 0 400 280" {...SVG_PROPS}>
      <StyleBlock />
      <defs>
        <marker
          id="arr-purple"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="#7F77DD"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {/* Animated track */}
      <line
        x1="50"
        y1="140"
        x2="350"
        y2="140"
        stroke="rgba(127,119,221,0.3)"
        strokeWidth="1.5"
        className="flow-line"
      />

      {/* Nodes */}
      <g>
        <circle
          cx="60"
          cy="140"
          r="26"
          fill="rgba(127,119,221,0.12)"
          stroke="#7F77DD"
          strokeWidth="1.5"
        />
        <text
          x="60"
          y="144"
          textAnchor="middle"
          fontSize="12"
          fill="#AFA9EC"
          fontWeight="600"
        >
          Plan
        </text>
        <text
          x="60"
          y="186"
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.35)"
          letterSpacing="0.05em"
        >
          Strategy
        </text>
        <line
          x1="88"
          y1="140"
          x2="132"
          y2="140"
          stroke="#7F77DD"
          strokeWidth="1.5"
          markerEnd="url(#arr-purple)"
        />
      </g>
      <g>
        <circle
          cx="160"
          cy="140"
          r="26"
          fill="rgba(127,119,221,0.12)"
          stroke="#7F77DD"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="144"
          textAnchor="middle"
          fontSize="12"
          fill="#AFA9EC"
          fontWeight="600"
        >
          Build
        </text>
        <text
          x="160"
          y="186"
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.35)"
          letterSpacing="0.05em"
        >
          Engineer
        </text>
        <line
          x1="188"
          y1="140"
          x2="212"
          y2="140"
          stroke="#7F77DD"
          strokeWidth="1.5"
          markerEnd="url(#arr-purple)"
        />
      </g>

      {/* Deploy — emphasized with pulse */}
      <g>
        <circle
          cx="240"
          cy="140"
          r="26"
          fill="rgba(127,119,221,0.18)"
          stroke="#7F77DD"
          strokeWidth="2"
        />
        <circle
          cx="240"
          cy="140"
          r="26"
          fill="none"
          stroke="#7F77DD"
          strokeWidth="1"
          className="pulse-2"
        />
        <text
          x="240"
          y="144"
          textAnchor="middle"
          fontSize="12"
          fill="#AFA9EC"
          fontWeight="600"
        >
          Deploy
        </text>
        <text
          x="240"
          y="186"
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.35)"
          letterSpacing="0.05em"
        >
          Launch
        </text>
        <line
          x1="268"
          y1="140"
          x2="312"
          y2="140"
          stroke="#7F77DD"
          strokeWidth="1.5"
          markerEnd="url(#arr-purple)"
        />
      </g>
      <g>
        <circle
          cx="340"
          cy="140"
          r="26"
          fill="rgba(127,119,221,0.12)"
          stroke="#7F77DD"
          strokeWidth="1.5"
        />
        <text
          x="340"
          y="144"
          textAnchor="middle"
          fontSize="12"
          fill="#AFA9EC"
          fontWeight="600"
        >
          Run
        </text>
        <text
          x="340"
          y="186"
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.35)"
          letterSpacing="0.05em"
        >
          Support
        </text>
      </g>

      {/* Brace */}
      <path
        d="M50,212 L50,222 Q50,230 58,230 L196,230 Q200,230 200,236 Q200,230 204,230 L342,230 Q350,230 350,222 L350,212"
        fill="none"
        stroke="rgba(127,119,221,0.4)"
        strokeWidth="1.2"
      />
      <text
        x="200"
        y="258"
        textAnchor="middle"
        fontSize="11"
        fill="#AFA9EC"
        fontWeight="500"
        letterSpacing="0.1em"
      >
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
      <rect
        x="140"
        y="130"
        width="120"
        height="100"
        rx="14"
        fill="rgba(99,153,34,0.12)"
        stroke="#639922"
        strokeWidth="2"
      />

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
      <circle
        cx="200"
        cy="172"
        r="13"
        fill="rgba(99,153,34,0.2)"
        stroke="#639922"
        strokeWidth="1.2"
      />
      <circle
        cx="200"
        cy="172"
        r="6"
        fill="#639922"
        opacity="0.8"
        className="blink-dot"
      />
      <rect
        x="196"
        y="178"
        width="8"
        height="18"
        rx="2"
        fill="#639922"
        opacity="0.8"
      />

      {/* Orbiting badges */}
      <g className="badge-1">
        <circle
          cx="64"
          cy="80"
          r="22"
          fill="rgba(29,158,117,0.15)"
          stroke="#1D9E75"
          strokeWidth="1.4"
        />
        <text
          x="64"
          y="85"
          textAnchor="middle"
          fontSize="11"
          fill="#5DCAA5"
          fontWeight="700"
        >
          OS
        </text>
      </g>
      <g className="badge-2">
        <circle
          cx="336"
          cy="80"
          r="22"
          fill="rgba(55,138,221,0.15)"
          stroke="#378ADD"
          strokeWidth="1.4"
        />
        <text
          x="336"
          y="85"
          textAnchor="middle"
          fontSize="11"
          fill="#85B7EB"
          fontWeight="700"
        >
          API
        </text>
      </g>
      <g className="badge-3">
        <circle
          cx="52"
          cy="180"
          r="20"
          fill="rgba(239,159,39,0.15)"
          stroke="#EF9F27"
          strokeWidth="1.4"
        />
        <text
          x="52"
          y="184"
          textAnchor="middle"
          fontSize="10"
          fill="#FAC775"
          fontWeight="700"
        >
          IaC
        </text>
      </g>
      <g className="badge-4">
        <circle
          cx="348"
          cy="180"
          r="20"
          fill="rgba(127,119,221,0.15)"
          stroke="#7F77DD"
          strokeWidth="1.4"
        />
        <text
          x="348"
          y="184"
          textAnchor="middle"
          fontSize="10"
          fill="#AFA9EC"
          fontWeight="700"
        >
          SDK
        </text>
      </g>

      {/* Leader lines */}
      <line
        x1="84"
        y1="92"
        x2="148"
        y2="142"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <line
        x1="316"
        y1="92"
        x2="252"
        y2="142"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <line
        x1="72"
        y1="178"
        x2="140"
        y2="178"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <line
        x1="328"
        y1="178"
        x2="260"
        y2="178"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />

      {/* Footer */}
      <text
        x="200"
        y="262"
        textAnchor="middle"
        fontSize="11"
        fill="#97C459"
        fontWeight="500"
        letterSpacing="0.1em"
      >
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
