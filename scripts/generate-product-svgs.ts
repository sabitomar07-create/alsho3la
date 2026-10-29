import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images/products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

interface SvgConfig {
  title: string;
  category: string;
  color: string;
  accent: string;
  bodyD: string;
  details: string;
}

const templates: Record<string, SvgConfig> = {
  'tapping-saddle-double-strap.svg': {
    title: 'Double Strap Tapping Saddle',
    category: 'TAPPING FITTINGS',
    color: '#0066FF',
    accent: '#38BDF8',
    bodyD: 'M 100,160 Q 200,110 300,160 L 300,240 Q 200,190 100,240 Z',
    details: `
      <!-- Outlet boss -->
      <rect x="170" y="70" width="60" height="60" rx="6" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="3"/>
      <ellipse cx="200" cy="70" rx="30" ry="12" fill="#0A1128" stroke="#38BDF8" stroke-width="2"/>
      <ellipse cx="200" cy="70" rx="20" ry="8" fill="#0066FF" opacity="0.6"/>
      <!-- Straps -->
      <path d="M 120,240 Q 200,310 280,240" fill="none" stroke="#94A3B8" stroke-width="8" stroke-dasharray="16 4"/>
      <path d="M 140,230 Q 200,290 260,230" fill="none" stroke="#CBD5E1" stroke-width="6"/>
      <!-- Bolts -->
      <circle cx="120" cy="235" r="7" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
      <circle cx="280" cy="235" r="7" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
    `,
  },
  'flanged-tapping-saddle.svg': {
    title: 'Flanged Offtake Tapping Saddle',
    category: 'TAPPING FITTINGS',
    color: '#0066FF',
    accent: '#00A3FF',
    bodyD: 'M 90,170 Q 200,120 310,170 L 310,240 Q 200,190 90,240 Z',
    details: `
      <!-- Flange Neck -->
      <rect x="165" y="80" width="70" height="55" fill="url(#metalGrad)" stroke="#00A3FF" stroke-width="2"/>
      <!-- Flange Disc -->
      <rect x="135" y="60" width="130" height="24" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="3"/>
      <circle cx="155" cy="72" r="5" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
      <circle cx="185" cy="72" r="5" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
      <circle cx="215" cy="72" r="5" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
      <circle cx="245" cy="72" r="5" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
      <ellipse cx="200" cy="60" rx="35" ry="10" fill="#030712" stroke="#00A3FF" stroke-width="2"/>
    `,
  },
  'repair-clamp-single.svg': {
    title: 'Single Band Repair Clamp',
    category: 'REPAIR COUPLINGS',
    color: '#38BDF8',
    accent: '#60A5FA',
    bodyD: 'M 110,120 A 90,90 0 1,0 290,120 L 290,260 A 90,90 0 1,1 110,260 Z',
    details: `
      <!-- Lock bar -->
      <rect x="270" y="100" width="35" height="180" rx="6" fill="url(#steelGrad)" stroke="#E2E8F0" stroke-width="2"/>
      <circle cx="287" cy="130" r="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
      <circle cx="287" cy="190" r="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
      <circle cx="287" cy="250" r="8" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
      <!-- Waffle gasket pattern inside -->
      <line x1="130" y1="130" x2="270" y2="130" stroke="#00A3FF" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>
      <line x1="130" y1="170" x2="270" y2="170" stroke="#00A3FF" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>
      <line x1="130" y1="210" x2="270" y2="210" stroke="#00A3FF" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>
      <line x1="130" y1="250" x2="270" y2="250" stroke="#00A3FF" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>
    `,
  },
  'repair-clamp-double.svg': {
    title: 'Double Band Heavy Repair Clamp',
    category: 'REPAIR COUPLINGS',
    color: '#0284C7',
    accent: '#38BDF8',
    bodyD: 'M 90,110 A 110,110 0 0,1 310,110 L 310,270 A 110,110 0 0,1 90,270 Z',
    details: `
      <!-- Dual clamp lugs -->
      <rect x="75" y="90" width="30" height="200" rx="5" fill="url(#steelGrad)" stroke="#94A3B8" stroke-width="2"/>
      <rect x="295" y="90" width="30" height="200" rx="5" fill="url(#steelGrad)" stroke="#94A3B8" stroke-width="2"/>
      <!-- Bolts on left and right -->
      <circle cx="90" cy="120" r="7" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
      <circle cx="90" cy="190" r="7" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
      <circle cx="90" cy="260" r="7" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
      <circle cx="310" cy="120" r="7" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
      <circle cx="310" cy="190" r="7" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
      <circle cx="310" cy="260" r="7" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
    `,
  },
  'universal-coupling.svg': {
    title: 'Universal Wide-Range Coupling',
    category: 'CONNECTORS & ADAPTERS',
    color: '#1D4ED8',
    accent: '#60A5FA',
    bodyD: 'M 110,120 L 290,120 L 305,260 L 95,260 Z',
    details: `
      <!-- End rings -->
      <rect x="80" y="110" width="35" height="160" rx="4" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="2"/>
      <rect x="285" y="110" width="35" height="160" rx="4" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="2"/>
      <!-- Tie bolts through center -->
      <line x1="85" y1="135" x2="315" y2="135" stroke="#E2E8F0" stroke-width="6"/>
      <line x1="85" y1="245" x2="315" y2="245" stroke="#E2E8F0" stroke-width="6"/>
      <!-- Gasket bevels -->
      <path d="M 115,145 L 135,160 L 135,220 L 115,235" fill="#0F172A" stroke="#00A3FF" stroke-width="2"/>
      <path d="M 285,145 L 265,160 L 265,220 L 285,235" fill="#0F172A" stroke="#00A3FF" stroke-width="2"/>
    `,
  },
  'flange-adapter.svg': {
    title: 'Universal Flange Adapter',
    category: 'FLANGES & ADAPTERS',
    color: '#0284C7',
    accent: '#00E5FF',
    bodyD: 'M 110,130 L 250,130 L 250,250 L 110,250 Z',
    details: `
      <!-- Flange collar on left -->
      <rect x="75" y="100" width="35" height="180" rx="5" fill="url(#steelGrad)" stroke="#00E5FF" stroke-width="3"/>
      <circle cx="92" cy="120" r="7" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="92" cy="155" r="7" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="92" cy="225" r="7" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="92" cy="260" r="7" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <!-- Follower gland on right -->
      <rect x="250" y="115" width="30" height="150" rx="4" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="2"/>
      <line x1="110" y1="135" x2="270" y2="135" stroke="#E2E8F0" stroke-width="5"/>
      <line x1="110" y1="245" x2="270" y2="245" stroke="#E2E8F0" stroke-width="5"/>
    `,
  },
  'gate-valve.svg': {
    title: 'Resilient Seated Gate Valve',
    category: 'VALVES & CONTROLS',
    color: '#1E40AF',
    accent: '#38BDF8',
    bodyD: 'M 100,180 L 300,180 L 285,270 L 115,270 Z',
    details: `
      <!-- Flange ends -->
      <rect x="80" y="160" width="25" height="130" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
      <rect x="295" y="160" width="25" height="130" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
      <!-- Bonnet neck -->
      <path d="M 155,180 L 155,100 L 245,100 L 245,180 Z" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="2"/>
      <!-- Handwheel / Cap -->
      <ellipse cx="200" cy="55" rx="55" ry="14" fill="#0F172A" stroke="#38BDF8" stroke-width="4"/>
      <rect x="194" y="55" width="12" height="45" fill="#E2E8F0" stroke="#0F172A" stroke-width="2"/>
      <!-- Wedge internal indication -->
      <path d="M 185,185 L 215,185 L 205,245 L 195,245 Z" fill="#0066FF" stroke="#38BDF8" stroke-width="2"/>
    `,
  },
  'butterfly-valve.svg': {
    title: 'Wafer Butterfly Valve',
    category: 'VALVES & CONTROLS',
    color: '#0284C7',
    accent: '#38BDF8',
    bodyD: 'M 140,110 A 90,90 0 1,0 260,110 A 90,90 0 1,0 140,110 Z',
    details: `
      <!-- Outer wafer body ring -->
      <circle cx="200" cy="200" r="75" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="6"/>
      <!-- Rotating disc -->
      <ellipse cx="200" cy="200" rx="60" ry="18" fill="#E2E8F0" stroke="#0066FF" stroke-width="3" transform="rotate(-30 200 200)"/>
      <!-- Shaft -->
      <line x1="200" y1="80" x2="200" y2="300" stroke="#CBD5E1" stroke-width="8"/>
      <!-- Gearbox / Actuator top -->
      <rect x="165" y="40" width="70" height="40" rx="4" fill="#0A1128" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="240" cy="60" r="14" fill="none" stroke="#E2E8F0" stroke-width="4"/>
    `,
  },
  'flanged-elbow.svg': {
    title: 'Flanged 90° Ductile Iron Bend',
    category: 'ELBOWS & BENDS',
    color: '#1E3A8A',
    accent: '#38BDF8',
    bodyD: 'M 120,270 L 120,200 Q 120,120 200,120 L 270,120',
    details: `
      <!-- Thick elbow pipe body -->
      <path d="M 100,270 Q 100,90 280,90 L 280,150 Q 160,150 160,270 Z" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="3"/>
      <!-- Flange 1 bottom -->
      <rect x="80" y="260" width="100" height="24" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="105" cy="272" r="5" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
      <circle cx="155" cy="272" r="5" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
      <!-- Flange 2 right -->
      <rect x="270" y="70" width="24" height="100" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="282" cy="95" r="5" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
      <circle cx="282" cy="145" r="5" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
    `,
  },
  'equal-tee.svg': {
    title: 'All-Flanged Equal Tee',
    category: 'TEES & BRANCHES',
    color: '#1E3A8A',
    accent: '#38BDF8',
    bodyD: '',
    details: `
      <!-- Main run -->
      <path d="M 80,160 L 320,160 L 320,240 L 80,240 Z" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="2"/>
      <!-- Top branch -->
      <path d="M 160,160 L 160,80 L 240,80 L 240,160 Z" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="2"/>
      <!-- Flanges -->
      <rect x="65" y="145" width="20" height="110" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
      <rect x="315" y="145" width="20" height="110" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
      <rect x="145" y="65" width="110" height="20" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
    `,
  },
  'concentric-reducer.svg': {
    title: 'Flanged Concentric Reducer',
    category: 'REDUCERS',
    color: '#0284C7',
    accent: '#38BDF8',
    bodyD: '',
    details: `
      <!-- Taper cone -->
      <path d="M 100,130 L 280,160 L 280,240 L 100,270 Z" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="2"/>
      <!-- Large Flange Left -->
      <rect x="80" y="115" width="24" height="170" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
      <!-- Small Flange Right -->
      <rect x="280" y="145" width="22" height="110" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
    `,
  },
  'weld-neck-flange.svg': {
    title: 'Weld Neck Flange',
    category: 'FLANGES',
    color: '#0066FF',
    accent: '#38BDF8',
    bodyD: '',
    details: `
      <!-- Flange disc -->
      <rect x="90" y="150" width="40" height="180" rx="5" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="110" cy="180" r="7" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
      <circle cx="110" cy="300" r="7" fill="#0A1128" stroke="#94A3B8" stroke-width="1.5"/>
      <!-- Hub neck -->
      <path d="M 130,170 L 250,200 L 250,280 L 130,310 Z" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="2"/>
      <!-- Raised Face ring -->
      <rect x="70" y="180" width="20" height="120" rx="2" fill="#E2E8F0" stroke="#0066FF" stroke-width="2"/>
    `,
  },
  'blind-flange.svg': {
    title: 'Blind Blanking Flange',
    category: 'FLANGES',
    color: '#1E40AF',
    accent: '#38BDF8',
    bodyD: '',
    details: `
      <!-- Circular solid face -->
      <circle cx="200" cy="200" r="100" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="5"/>
      <circle cx="200" cy="200" r="65" fill="url(#metalGrad)" stroke="#0066FF" stroke-width="3"/>
      <!-- Bolt circle pattern -->
      <circle cx="200" cy="115" r="9" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="200" cy="285" r="9" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="115" cy="200" r="9" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="285" cy="200" r="9" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="140" cy="140" r="9" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="260" cy="140" r="9" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="140" cy="260" r="9" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="260" cy="260" r="9" fill="#0A1128" stroke="#94A3B8" stroke-width="2"/>
    `,
  },
  'end-cap.svg': {
    title: 'Hydrostatic Test End Cap',
    category: 'END FITTINGS',
    color: '#0284C7',
    accent: '#38BDF8',
    bodyD: '',
    details: `
      <rect x="100" y="120" width="120" height="160" rx="8" fill="url(#metalGrad)" stroke="#38BDF8" stroke-width="3"/>
      <rect x="220" y="105" width="30" height="190" rx="4" fill="url(#steelGrad)" stroke="#38BDF8" stroke-width="2"/>
      <!-- Gauge and fill valve ports -->
      <rect x="70" y="150" width="30" height="20" fill="#E2E8F0" stroke="#0066FF" stroke-width="2"/>
      <circle cx="65" cy="160" r="16" fill="#0A1128" stroke="#38BDF8" stroke-width="2"/>
      <line x1="65" y1="160" x2="72" y2="152" stroke="#EF4444" stroke-width="2.5"/>
    `,
  },
  'full-face-gasket.svg': {
    title: 'Reinforced EPDM Gasket',
    category: 'GASKETS & SEALS',
    color: '#0F172A',
    accent: '#00E5FF',
    bodyD: '',
    details: `
      <!-- Rubber gasket ring -->
      <circle cx="200" cy="200" r="95" fill="#1E293B" stroke="#00E5FF" stroke-width="3"/>
      <circle cx="200" cy="200" r="50" fill="#080D1A" stroke="#00E5FF" stroke-width="2"/>
      <!-- Bolt holes -->
      <circle cx="200" cy="120" r="8" fill="#080D1A" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="200" cy="280" r="8" fill="#080D1A" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="120" cy="200" r="8" fill="#080D1A" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="280" cy="200" r="8" fill="#080D1A" stroke="#94A3B8" stroke-width="2"/>
    `,
  },
  'flange-bolt-kit.svg': {
    title: 'B7/2H PTFE Bolt Kit',
    category: 'FASTENERS',
    color: '#0066FF',
    accent: '#38BDF8',
    bodyD: '',
    details: `
      <!-- Heavy stud bolt with blue PTFE coating -->
      <rect x="130" y="180" width="140" height="40" rx="3" fill="#0284C7" stroke="#38BDF8" stroke-width="3"/>
      <!-- Threads indication -->
      <line x1="140" y1="180" x2="140" y2="220" stroke="#0369A1" stroke-width="3"/>
      <line x1="150" y1="180" x2="150" y2="220" stroke="#0369A1" stroke-width="3"/>
      <line x1="160" y1="180" x2="160" y2="220" stroke="#0369A1" stroke-width="3"/>
      <line x1="240" y1="180" x2="240" y2="220" stroke="#0369A1" stroke-width="3"/>
      <line x1="250" y1="180" x2="250" y2="220" stroke="#0369A1" stroke-width="3"/>
      <line x1="260" y1="180" x2="260" y2="220" stroke="#0369A1" stroke-width="3"/>
      <!-- Nuts on both ends -->
      <rect x="95" y="170" width="35" height="60" rx="4" fill="url(#steelGrad)" stroke="#E2E8F0" stroke-width="2"/>
      <rect x="270" y="170" width="35" height="60" rx="4" fill="url(#steelGrad)" stroke="#E2E8F0" stroke-width="2"/>
    `,
  },
};

function generateSvg(cfg: SvgConfig): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080E1E" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="35%" stop-color="#94A3B8" />
      <stop offset="70%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
    <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0066FF" stop-opacity="0" />
      <stop offset="50%" stop-color="#00E5FF" stop-opacity="1" />
      <stop offset="100%" stop-color="#0066FF" stop-opacity="0" />
    </linearGradient>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" stroke-width="0.8" opacity="0.6"/>
    </pattern>
  </defs>

  <!-- Industrial Dark Background -->
  <rect width="400" height="400" fill="url(#bgGrad)" />
  <rect width="400" height="400" fill="url(#grid)" />

  <!-- Technical Circular Radar Ring -->
  <circle cx="200" cy="200" r="160" fill="none" stroke="#1E293B" stroke-width="1" />
  <circle cx="200" cy="200" r="130" fill="none" stroke="#0066FF" stroke-width="0.8" stroke-dasharray="4 6" opacity="0.4" />
  
  <!-- Subtle Cyan Accent Glow -->
  <circle cx="200" cy="200" r="100" fill="#0066FF" opacity="0.08" filter="blur(30px)" />

  <!-- Main Component Drawing -->
  ${cfg.bodyD ? `<path d="${cfg.bodyD}" fill="url(#metalGrad)" stroke="${cfg.accent}" stroke-width="3" />` : ''}
  ${cfg.details}

  <!-- Technical Spec Watermark Lines & Crosshairs -->
  <line x1="20" y1="200" x2="45" y2="200" stroke="#00E5FF" stroke-width="1.5" opacity="0.6" />
  <line x1="355" y1="200" x2="380" y2="200" stroke="#00E5FF" stroke-width="1.5" opacity="0.6" />
  <line x1="200" y1="20" x2="200" y2="45" stroke="#00E5FF" stroke-width="1.5" opacity="0.6" />
  <line x1="200" y1="355" x2="200" y2="380" stroke="#00E5FF" stroke-width="1.5" opacity="0.6" />

  <!-- Header Category Tag -->
  <text x="28" y="38" fill="#38BDF8" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" letter-spacing="1.5">${cfg.category}</text>
  <line x1="28" y1="46" x2="160" y2="46" stroke="url(#glowLine)" stroke-width="1.5" />

  <!-- Bottom Technical Identifier -->
  <text x="28" y="372" fill="#94A3B8" font-family="'JetBrains Mono', monospace" font-size="9" letter-spacing="1">HYDROCORE ENGINEERING SPECIFICATION</text>
  <text x="372" y="372" fill="#00E5FF" font-family="'JetBrains Mono', monospace" font-size="9" text-anchor="end" font-weight="bold">ISO 9001 / EN</text>
</svg>`;
}

// Generate all standard templates
for (const [filename, cfg] of Object.entries(templates)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, generateSvg(cfg));
}

// Also map any remaining specific product image filenames to their closest category template
const fallbackMappings: Record<string, string> = {
  'pe-tapping-saddle.svg': 'tapping-saddle-double-strap.svg',
  'stainless-tapping-sleeve.svg': 'repair-clamp-double.svg',
  'pvc-clamp-saddle.svg': 'tapping-saddle-double-strap.svg',
  'high-pressure-saddle.svg': 'flanged-tapping-saddle.svg',
  'tapping-saddle-single-strap.svg': 'tapping-saddle-double-strap.svg',
  'bronze-saddle.svg': 'tapping-saddle-double-strap.svg',
  'weld-saddle.svg': 'weld-neck-flange.svg',
  'restrained-coupling.svg': 'universal-coupling.svg',
  'steel-split-sleeve.svg': 'repair-clamp-double.svg',
  'bell-joint-clamp.svg': 'repair-clamp-single.svg',
  'dismantling-joint.svg': 'universal-coupling.svg',
  'expansion-joint.svg': 'universal-coupling.svg',
  'camlock-coupling.svg': 'universal-coupling.svg',
  'ball-joint.svg': 'universal-coupling.svg',
  'grooved-adapter.svg': 'flange-adapter.svg',
  'pipe-union.svg': 'universal-coupling.svg',
  'puddle-flange.svg': 'weld-neck-flange.svg',
  'flanged-duckfoot-elbow.svg': 'flanged-elbow.svg',
  'socket-elbow.svg': 'flanged-elbow.svg',
  'welded-elbow.svg': 'flanged-elbow.svg',
  'pe-elbow.svg': 'flanged-elbow.svg',
  'reducing-tee.svg': 'equal-tee.svg',
  'cross-fitting.svg': 'equal-tee.svg',
  'wye-fitting.svg': 'equal-tee.svg',
  'socket-tee.svg': 'equal-tee.svg',
  'welded-tee.svg': 'equal-tee.svg',
  'pe-tee.svg': 'equal-tee.svg',
  'eccentric-reducer.svg': 'concentric-reducer.svg',
  'reducing-bushing.svg': 'concentric-reducer.svg',
  'welded-reducer.svg': 'concentric-reducer.svg',
  'pe-reducer.svg': 'concentric-reducer.svg',
  'socket-reducer.svg': 'concentric-reducer.svg',
  'slip-on-flange.svg': 'weld-neck-flange.svg',
  'threaded-flange.svg': 'weld-neck-flange.svg',
  'check-valve.svg': 'butterfly-valve.svg',
  'air-valve.svg': 'gate-valve.svg',
  'prv-valve.svg': 'gate-valve.svg',
  'threaded-plug.svg': 'end-cap.svg',
  'dished-cap.svg': 'end-cap.svg',
  'pe-cap.svg': 'end-cap.svg',
  'socket-plug.svg': 'end-cap.svg',
  'spiral-gasket.svg': 'full-face-gasket.svg',
  'isolation-kit.svg': 'full-face-gasket.svg',
  'pipe-lubricant.svg': 'end-cap.svg',
};

for (const [targetName, sourceTemplate] of Object.entries(fallbackMappings)) {
  const targetPath = path.join(outDir, targetName);
  if (!fs.existsSync(targetPath)) {
    const templateCfg = templates[sourceTemplate] || templates['flange-adapter.svg'];
    const customizedCfg = { ...templateCfg, title: targetName.replace('.svg', '').toUpperCase() };
    fs.writeFileSync(targetPath, generateSvg(customizedCfg));
  }
}

console.log('All product SVG schematics successfully written to public/images/products');
