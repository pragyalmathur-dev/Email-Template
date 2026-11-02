/**
 * High-fidelity, self-contained SVG artwork & imagery presets for luxury architectural & editorial newsletters.
 * Generates crisp, email-safe Data URLs that never break or fail in hermetic sandboxes.
 */

// Helper to convert SVG string to clean Data URI
export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export interface PresetImage {
  id: string;
  name: string;
  category: 'architecture' | 'interior' | 'nature' | 'craft' | 'abstract';
  aspectRatio: string;
  dataUri: string;
  description: string;
}

export const PRESET_IMAGES: PresetImage[] = [
  {
    id: 'preset-villa-caisua-hero',
    name: 'Villa Caisua — Tropical Modern Estate',
    category: 'architecture',
    aspectRatio: '16:9',
    description: 'Modernist cantilevered villa with infinity reflection pool and tropical palms in Goa twilight',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1c2526"/>
            <stop offset="45%" stop-color="#3a413d"/>
            <stop offset="75%" stop-color="#a47551"/>
            <stop offset="100%" stop-color="#d4a373"/>
          </linearGradient>
          <linearGradient id="poolGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0f3438"/>
            <stop offset="50%" stop-color="#1b4d53"/>
            <stop offset="100%" stop-color="#2a6f77"/>
          </linearGradient>
          <linearGradient id="teakGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#6e4727"/>
            <stop offset="50%" stop-color="#935f37"/>
            <stop offset="100%" stop-color="#5a381c"/>
          </linearGradient>
          <linearGradient id="concreteGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e2ded9"/>
            <stop offset="100%" stop-color="#b8b2a8"/>
          </linearGradient>
          <filter id="subtleGlow">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <!-- Sky & Atmosphere -->
        <rect width="1200" height="675" fill="url(#skyGrad)"/>

        <!-- Distant Hill & Palm Silhouettes -->
        <path d="M0,450 Q300,380 600,420 T1200,430 L1200,675 L0,675 Z" fill="#1e2723" opacity="0.8"/>
        
        <!-- Architectural Terraces & Villa Geometry -->
        <!-- Concrete Base Structure -->
        <rect x="220" y="240" width="760" height="240" fill="url(#concreteGrad)"/>
        
        <!-- Upper Cantilever Teak Pavilion -->
        <rect x="180" y="190" width="540" height="40" fill="url(#teakGrad)"/>
        <rect x="240" y="230" width="440" height="120" fill="#141a18" opacity="0.9"/>

        <!-- Warm Interior Glow Behind Slatted Glass -->
        <rect x="250" y="240" width="420" height="100" fill="#f8e3b6" opacity="0.75" filter="url(#subtleGlow)"/>
        
        <!-- Architectural Vertical Teak Louvers -->
        <g stroke="#6e4727" stroke-width="4" opacity="0.85">
          <line x1="280" y1="230" x2="280" y2="350"/>
          <line x1="310" y1="230" x2="310" y2="350"/>
          <line x1="340" y1="230" x2="340" y2="350"/>
          <line x1="370" y1="230" x2="370" y2="350"/>
          <line x1="400" y1="230" x2="400" y2="350"/>
          <line x1="430" y1="230" x2="430" y2="350"/>
          <line x1="460" y1="230" x2="460" y2="350"/>
          <line x1="490" y1="230" x2="490" y2="350"/>
          <line x1="520" y1="230" x2="520" y2="350"/>
          <line x1="550" y1="230" x2="550" y2="350"/>
          <line x1="580" y1="230" x2="580" y2="350"/>
          <line x1="610" y1="230" x2="610" y2="350"/>
          <line x1="640" y1="230" x2="640" y2="350"/>
        </g>

        <!-- Right Wing Laterite Stone Wall -->
        <rect x="700" y="240" width="280" height="230" fill="#8c4836"/>
        <!-- Laterite Texture lines -->
        <g stroke="#6d3526" stroke-width="2" opacity="0.6">
          <line x1="700" y1="280" x2="980" y2="280"/>
          <line x1="700" y1="320" x2="980" y2="320"/>
          <line x1="700" y1="360" x2="980" y2="360"/>
          <line x1="700" y1="400" x2="980" y2="400"/>
          <line x1="700" y1="440" x2="980" y2="440"/>
        </g>

        <!-- Verandah Deck -->
        <polygon points="120,470 1080,470 1140,510 60,510" fill="#4a311b"/>

        <!-- Reflection Infinity Pool -->
        <polygon points="160,510 1040,510 1120,675 80,675" fill="url(#poolGrad)"/>
        <!-- Water reflection ripples & golden glow -->
        <path d="M240,530 Q600,535 960,530" stroke="#f6d59b" stroke-width="3" opacity="0.4"/>
        <path d="M200,560 Q600,568 1000,560" stroke="#f6d59b" stroke-width="2" opacity="0.3"/>
        <path d="M160,600 Q600,610 1040,600" stroke="#f6d59b" stroke-width="2.5" opacity="0.25"/>

        <!-- Tropical Flora & Palm Fronds (Left & Right framing) -->
        <g fill="#141c17">
          <!-- Left Palms -->
          <path d="M-20,675 C10,480 80,320 180,210 C140,240 80,310 50,440 Z"/>
          <path d="M180,210 C140,200 90,220 30,260 C70,230 130,220 180,210 Z"/>
          <path d="M180,210 C210,180 250,170 320,175 C260,185 220,195 180,210 Z"/>
          <path d="M180,210 C190,240 220,280 270,310 C230,270 200,240 180,210 Z"/>

          <!-- Right Palms -->
          <path d="M1220,675 C1190,460 1110,300 1000,190 C1040,230 1100,310 1140,460 Z"/>
          <path d="M1000,190 C1040,170 1110,180 1170,220 C1120,190 1060,180 1000,190 Z"/>
          <path d="M1000,190 C960,165 910,160 840,170 C900,175 950,180 1000,190 Z"/>
          <path d="M1000,190 C990,220 960,260 910,290 C950,250 980,220 1000,190 Z"/>
        </g>

        <!-- Subtle Editorial Badge Overlay -->
        <rect x="50" y="50" width="220" height="34" fill="#0c1110" opacity="0.75" rx="4"/>
        <text x="65" y="72" fill="#d9ad7c" font-family="'Cinzel', serif" font-size="13" letter-spacing="3">VIANAAR ARCHITECTURE</text>
      </svg>
    `),
  },
  {
    id: 'preset-living-interior',
    name: 'Verandah Living Room — Teak & Laterite',
    category: 'interior',
    aspectRatio: '4:3',
    description: 'Double-height minimalist living room opening into tropical courtyard garden',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
        <defs>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#f4eee8"/>
            <stop offset="100%" stop-color="#ded4c8"/>
          </linearGradient>
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4a3b32"/>
            <stop offset="100%" stop-color="#2d221c"/>
          </linearGradient>
          <linearGradient id="gardenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8ba888"/>
            <stop offset="60%" stop-color="#4e6d4b"/>
            <stop offset="100%" stop-color="#263b24"/>
          </linearGradient>
        </defs>

        <!-- Walls & Ceiling -->
        <rect width="800" height="600" fill="url(#wallGrad)"/>
        
        <!-- Floor with Polished Stone Finish -->
        <polygon points="0,420 800,420 800,600 0,600" fill="url(#floorGrad)"/>

        <!-- Double-Height Glass Pivot Door Aperture to Tropical Garden -->
        <rect x="280" y="80" width="460" height="340" fill="url(#gardenGrad)"/>
        <!-- Garden Flora through glass -->
        <circle cx="380" cy="320" r="140" fill="#314e2d" opacity="0.8"/>
        <circle cx="580" cy="260" r="160" fill="#3f613a" opacity="0.75"/>
        <circle cx="480" cy="180" r="120" fill="#588153" opacity="0.6"/>

        <!-- Slim Steel Black Minimalist Frame -->
        <rect x="280" y="80" width="460" height="340" fill="none" stroke="#222" stroke-width="6"/>
        <line x1="510" y1="80" x2="510" y2="420" stroke="#222" stroke-width="5"/>

        <!-- High Exposed Rafters / Wood Beams -->
        <g fill="#432818">
          <rect x="0" y="40" width="800" height="18"/>
          <rect x="0" y="75" width="280" height="14"/>
        </g>

        <!-- Minimalist Linen Lounge Sofa -->
        <polygon points="80,410 320,410 350,470 60,470" fill="#ede8e1"/>
        <rect x="70" y="370" width="240" height="50" rx="6" fill="#ded7cd"/>
        <!-- Cushions -->
        <rect x="90" y="360" width="50" height="40" rx="4" fill="#a47551"/>
        <rect x="150" y="360" width="50" height="40" rx="4" fill="#c2b69d"/>

        <!-- Low Artisanal Teak Coffee Table -->
        <polygon points="180,480 380,480 350,520 150,520" fill="#7f4f24"/>
        <!-- Ceramic Vase with dried grass -->
        <ellipse cx="260" cy="478" rx="8" ry="12" fill="#fff" stroke="#999" stroke-width="1"/>
        <line x1="260" y1="466" x2="255" y2="430" stroke="#8c6239" stroke-width="2"/>

        <!-- Pendant Minimalist Brass Lamp -->
        <line x1="200" y1="0" x2="200" y2="210" stroke="#111" stroke-width="2"/>
        <circle cx="200" cy="225" r="24" fill="#d4af37"/>
        <circle cx="200" cy="225" r="40" fill="#fff5cc" opacity="0.25"/>
      </svg>
    `),
  },
  {
    id: 'preset-stone-courtyard',
    name: 'Laterite Stone & Reflection Courtyard',
    category: 'architecture',
    aspectRatio: '4:3',
    description: 'Traditional Goan laterite stone courtyard with lotus pond and Frangipani tree',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
        <defs>
          <linearGradient id="lateriteGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#934b35"/>
            <stop offset="50%" stop-color="#7a3723"/>
            <stop offset="100%" stop-color="#5e2616"/>
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1d3536"/>
            <stop offset="100%" stop-color="#3b696a"/>
          </linearGradient>
        </defs>

        <!-- Red Laterite Courtyard Walls -->
        <rect width="800" height="380" fill="url(#lateriteGrad)"/>

        <!-- Laterite Texture Grid -->
        <g stroke="#481c10" stroke-width="3" opacity="0.45">
          <line x1="0" y1="60" x2="800" y2="60"/>
          <line x1="0" y1="120" x2="800" y2="120"/>
          <line x1="0" y1="180" x2="800" y2="180"/>
          <line x1="0" y1="240" x2="800" y2="240"/>
          <line x1="0" y1="300" x2="800" y2="300"/>
          <line x1="0" y1="360" x2="800" y2="360"/>
          <!-- Vertical mortar -->
          <line x1="160" y1="0" x2="160" y2="380"/>
          <line x1="320" y1="0" x2="320" y2="380"/>
          <line x1="480" y1="0" x2="480" y2="380"/>
          <line x1="640" y1="0" x2="640" y2="380"/>
        </g>

        <!-- Courtyard Stone Floor -->
        <polygon points="0,380 800,380 800,600 0,600" fill="#c4bbaa"/>

        <!-- Central Water Reflection Basin -->
        <polygon points="150,420 650,420 700,560 100,560" fill="url(#waterGrad)"/>
        <!-- Granite Coping Edge -->
        <polygon points="140,414 660,414 665,420 135,420" fill="#2d3130"/>

        <!-- Lotus Leaves Floating -->
        <ellipse cx="280" cy="480" rx="36" ry="14" fill="#386641"/>
        <ellipse cx="450" cy="500" rx="48" ry="18" fill="#2d5435"/>
        <ellipse cx="560" cy="460" rx="30" ry="12" fill="#447a4f"/>
        <!-- White Lotus Flower -->
        <circle cx="460" cy="495" r="8" fill="#fff"/>
        <circle cx="460" cy="495" r="4" fill="#f4d06f"/>

        <!-- Sculptural Frangipani Tree on Left -->
        <path d="M120,440 Q150,300 200,200 T260,110" stroke="#4a3b32" stroke-width="16" fill="none" stroke-linecap="round"/>
        <path d="M200,200 Q260,180 320,150" stroke="#4a3b32" stroke-width="10" fill="none" stroke-linecap="round"/>
        <!-- White and Gold Blossoms -->
        <g fill="#fff" stroke="#f4d06f" stroke-width="2">
          <circle cx="260" cy="110" r="10"/>
          <circle cx="320" cy="150" r="10"/>
          <circle cx="230" cy="140" r="9"/>
          <circle cx="290" cy="120" r="9"/>
        </g>
      </svg>
    `),
  },
  {
    id: 'preset-woodwork-craft',
    name: 'Sustainable Teak Joinery & Craft',
    category: 'craft',
    aspectRatio: '1:1',
    description: 'Master artisan detailing seasoned Burma teak wood with hand tools',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
        <defs>
          <linearGradient id="woodSurface" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#804a26"/>
            <stop offset="50%" stop-color="#a26538"/>
            <stop offset="100%" stop-color="#5e3215"/>
          </linearGradient>
        </defs>

        <!-- Dark Studio Background -->
        <rect width="600" height="600" fill="#1b1715"/>

        <!-- Solid Teak Workbench Slab -->
        <rect x="50" y="80" width="500" height="440" fill="url(#woodSurface)" rx="6"/>
        
        <!-- Wood Grains -->
        <g stroke="#48250f" stroke-width="2" opacity="0.6" fill="none">
          <path d="M50,140 Q300,160 550,130"/>
          <path d="M50,200 Q320,225 550,195"/>
          <path d="M50,270 Q280,290 550,260"/>
          <path d="M50,340 Q340,360 550,335"/>
          <path d="M50,410 Q290,430 550,405"/>
          <path d="M50,470 Q310,490 550,465"/>
        </g>

        <!-- Dovetail Joinery Detail -->
        <g fill="#43210b">
          <polygon points="120,80 140,130 170,130 190,80"/>
          <polygon points="240,80 260,130 290,130 310,80"/>
          <polygon points="360,80 380,130 410,130 430,80"/>
        </g>

        <!-- Traditional Brass & Steel Carpenter Chisel -->
        <rect x="180" y="260" width="240" height="28" rx="4" fill="#d4af37" transform="rotate(-25 300 274)"/>
        <polygon points="120,340 180,312 170,334" fill="#a0a0a0" transform="rotate(-25 300 274)"/>

        <!-- Tactile Wood Shavings -->
        <path d="M380,380 Q430,340 450,390 T410,430" stroke="#f4c079" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M320,410 Q350,370 380,410" stroke="#e0aa62" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M260,430 Q290,390 310,420" stroke="#f4c079" stroke-width="5" fill="none" stroke-linecap="round"/>

        <!-- Craft Stamp -->
        <circle cx="480" cy="460" r="40" fill="none" stroke="#e0aa62" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="480" y="456" fill="#e0aa62" font-family="'Cinzel', serif" font-size="11" text-anchor="middle" letter-spacing="2">SUSTAINABLE</text>
        <text x="480" y="472" fill="#e0aa62" font-family="'Cinzel', serif" font-size="10" text-anchor="middle" letter-spacing="2">TEAK 2026</text>
      </svg>
    `),
  },
  {
    id: 'preset-verandah-dining',
    name: 'Alfresco Verandah Dining & Lifestyle',
    category: 'interior',
    aspectRatio: '4:3',
    description: 'Outdoor dining pergola styled with artisanal ceramic dinnerware overlooking tropical valley',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
        <defs>
          <linearGradient id="skyBreeze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#99b8b7"/>
            <stop offset="60%" stop-color="#d4e2d4"/>
            <stop offset="100%" stop-color="#f2ebe3"/>
          </linearGradient>
        </defs>

        <rect width="800" height="600" fill="url(#skyBreeze)"/>

        <!-- Distant Hill Crests -->
        <path d="M0,320 Q220,260 480,290 T800,270 L800,600 L0,600 Z" fill="#4d664c" opacity="0.6"/>
        <path d="M0,380 Q300,320 600,350 T800,330 L800,600 L0,600 Z" fill="#2d422c" opacity="0.8"/>

        <!-- Pergola Overhead Wood Beams -->
        <g fill="#432818">
          <rect x="0" y="0" width="800" height="30"/>
          <rect x="120" y="0" width="40" height="180"/>
          <rect x="360" y="0" width="40" height="180"/>
          <rect x="600" y="0" width="40" height="180"/>
        </g>

        <!-- Verandah Deck Floor -->
        <polygon points="0,440 800,440 800,600 0,600" fill="#a47551"/>

        <!-- Artisanal Dining Table -->
        <polygon points="160,420 640,420 680,520 120,520" fill="#603813"/>
        <!-- Table Top Highlight -->
        <polygon points="170,424 630,424 620,432 180,432" fill="#7a4618"/>

        <!-- Table Runner & Place Settings -->
        <polygon points="260,424 540,424 550,520 250,520" fill="#f0ebe1"/>

        <!-- Ceramic Dishes & Wine Glasses -->
        <ellipse cx="330" cy="460" rx="22" ry="10" fill="#ded7cb" stroke="#b0a594" stroke-width="2"/>
        <ellipse cx="470" cy="460" rx="22" ry="10" fill="#ded7cb" stroke="#b0a594" stroke-width="2"/>
        <!-- Glasses -->
        <circle cx="360" cy="445" r="7" fill="#fff" opacity="0.7"/>
        <circle cx="440" cy="445" r="7" fill="#fff" opacity="0.7"/>

        <!-- Bowl of fresh citrus fruits -->
        <ellipse cx="400" cy="465" rx="30" ry="14" fill="#a68a68"/>
        <circle cx="390" cy="460" r="7" fill="#f4a261"/>
        <circle cx="405" cy="462" r="8" fill="#e76f51"/>
        <circle cx="415" cy="460" r="7" fill="#e9c46a"/>
      </svg>
    `),
  },
  {
    id: 'preset-crest-monogram',
    name: 'Vianaar Crest & Editorial Monogram',
    category: 'abstract',
    aspectRatio: '1:1',
    description: 'Gold foil architectural emblem and seal of authenticity',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" fill="#141817"/>
        <circle cx="200" cy="200" r="160" fill="none" stroke="#d4af37" stroke-width="2"/>
        <circle cx="200" cy="200" r="148" fill="none" stroke="#d4af37" stroke-width="1" stroke-dasharray="3,3"/>
        
        <!-- Architectural Geometric Diamond -->
        <polygon points="200,80 320,200 200,320 80,200" fill="none" stroke="#d4af37" stroke-width="2"/>
        
        <!-- Center V Monogram -->
        <path d="M150,140 L200,250 L250,140" fill="none" stroke="#f5e1a4" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter"/>
        <line x1="130" y1="140" x2="170" y2="140" stroke="#f5e1a4" stroke-width="4"/>
        <line x1="230" y1="140" x2="270" y2="140" stroke="#f5e1a4" stroke-width="4"/>

        <!-- Text Arc / Typography -->
        <text x="200" y="295" fill="#d4af37" font-family="'Cinzel', serif" font-size="12" text-anchor="middle" letter-spacing="4">EST. GOA 2007</text>
      </svg>
    `),
  },
];
