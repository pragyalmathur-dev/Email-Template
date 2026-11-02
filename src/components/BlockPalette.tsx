import React from 'react';
import {
  Plus,
  LayoutTemplate,
  FileText,
  Columns2,
  Columns3,
  Images,
  Quote,
  TrendingUp,
  Megaphone,
  Footprints,
  Code2,
  MousePointerClick,
  Space,
  Minus,
  MessageSquareQuote,
  Image as ImageIcon,
} from 'lucide-react';
import { BlockType, NewsletterBlock } from '../types/newsletter';
import { PRESET_IMAGES } from '../utils/svgAssets';

interface BlockPaletteProps {
  onAddBlock: (block: NewsletterBlock) => void;
}

interface BlockTemplateMeta {
  type: BlockType;
  label: string;
  description: string;
  icon: React.ElementType;
}

const BLOCK_TEMPLATES: BlockTemplateMeta[] = [
  {
    type: 'button-block',
    label: 'Call-to-Action Button',
    description: 'Brevo-style bulletproof button for links & section jumps',
    icon: MousePointerClick,
  },
  {
    type: 'image-block',
    label: 'Image Banner',
    description: 'Responsive photo with optional link, alignment & caption',
    icon: ImageIcon,
  },
  {
    type: 'spacer-block',
    label: 'Blank Spacer',
    description: 'Configurable vertical breathing room between sections',
    icon: Space,
  },
  {
    type: 'divider-block',
    label: 'Divider Line',
    description: 'Horizontal separator line with custom style & color',
    icon: Minus,
  },
  {
    type: 'callout-block',
    label: 'Callout / Note Box',
    description: 'Highlighted card with accent border for notes or quotes',
    icon: MessageSquareQuote,
  },
  {
    type: 'hero',
    label: 'Hero Cover Story',
    description: 'Cinematic title, lead photography, kicker & CTA button',
    icon: LayoutTemplate,
  },
  {
    type: 'two-column',
    label: '2-Column Spotlight',
    description: 'Side-by-side image with story & spec pills',
    icon: Columns2,
  },
  {
    type: 'three-column',
    label: '3-Column Dispatches',
    description: 'Triple milestone cards with images & links',
    icon: Columns3,
  },
  {
    type: 'letter',
    label: "Founder's Letter",
    description: 'Personal editorial note, avatar & signature',
    icon: FileText,
  },
  {
    type: 'gallery',
    label: 'Visual Photo Gallery',
    description: 'Dual photo showcase with architectural captions',
    icon: Images,
  },
  {
    type: 'quote',
    label: 'Editorial Pull Quote',
    description: 'High-contrast thought and author attribution',
    icon: Quote,
  },
  {
    type: 'milestones',
    label: 'Benchmark Numbers',
    description: '4-column quantitative milestone indicators',
    icon: TrendingUp,
  },
  {
    type: 'cta-banner',
    label: 'Action Invitation',
    description: 'Dark luxury banner with primary & secondary buttons',
    icon: Megaphone,
  },
  {
    type: 'footer',
    label: 'Compliance Footer',
    description: 'Address, social links, legal notices & unsubscribe',
    icon: Footprints,
  },
  {
    type: 'custom-html',
    label: 'Custom HTML Block',
    description: 'Embed arbitrary email HTML code directly',
    icon: Code2,
  },
];

export function createDefaultBlock(type: BlockType): NewsletterBlock {
  const id = `block-${type}-${Date.now()}`;

  switch (type) {
    case 'button-block':
      return {
        id,
        type: 'button-block',
        title: 'CTA Button',
        buttonText: 'Explore Now',
        buttonUrl: '#',
        buttonBg: '#f59e0b',
        buttonTextColor: '#171717',
        align: 'center',
        radius: 'rounded',
      };

    case 'image-block':
      return {
        id,
        type: 'image-block',
        title: 'Image Banner',
        imageUrl: PRESET_IMAGES[0].dataUri,
        imageAlt: 'Curated architectural photography',
        caption: 'Photography survey from our seasonal project portfolio.',
        linkUrl: '#',
        align: 'center',
        width: '100%',
      };

    case 'spacer-block':
      return {
        id,
        type: 'spacer-block',
        title: 'Blank Space',
        height: 30,
        backgroundColor: 'transparent',
      };

    case 'divider-block':
      return {
        id,
        type: 'divider-block',
        title: 'Divider Line',
        dividerStyle: 'solid',
        color: '#e5e7eb',
        thickness: 1,
        widthPercent: 100,
        margin: 20,
      };

    case 'callout-block':
      return {
        id,
        type: 'callout-block',
        title: 'Callout Box',
        calloutTitle: 'EDITORIAL NOTE',
        content: 'Natural materials and balanced proportions are at the heart of our craft. Every edition explores stories from our community.',
        theme: 'ivory',
      };

    case 'hero':
      return {
        id,
        type: 'hero',
        title: 'New Hero Cover',
        kicker: 'NEW EDITORIAL RELEASE',
        headline: 'Harmonious Spaces & Sustainable Living',
        subtitle: 'Exploring how architectural proportions and natural materials foster timeless well-being.',
        imageUrl: PRESET_IMAGES[0].dataUri,
        imageAlt: 'Architectural estate elevation',
        imageCaption: 'Hillside residence overlooking coastal tidal waters.',
        ctaText: 'Discover The Portfolio',
        ctaUrl: '#',
        layout: 'image-above',
      };

    case 'two-column':
      return {
        id,
        type: 'two-column',
        title: 'New 2-Column Story',
        kicker: 'ARCHITECTURE SPOTLIGHT',
        headline: 'The Hillside Residence',
        description: 'Deep verandahs and natural timber screens provide passive cooling throughout the year.',
        specPills: ['4,800 sq.ft', 'Tropical Garden', 'Private Pool'],
        imageUrl: PRESET_IMAGES[1].dataUri,
        imageAlt: 'Living pavilion verandah',
        imageSide: 'left',
        ctaText: 'View Floorplans',
        ctaUrl: '#',
      };

    case 'three-column':
      return {
        id,
        type: 'three-column',
        title: 'New 3-Column Grid',
        kicker: 'SEASONAL UPDATES',
        headline: 'Craftsmanship In Focus',
        subtitle: 'Highlights from our construction studios.',
        items: [
          {
            id: 'item-1',
            tag: 'MATERIALS',
            title: 'Reclaimed Teak',
            description: 'Sustainably sourced timber seasoned for high humidity.',
            imageUrl: PRESET_IMAGES[3].dataUri,
            imageAlt: 'Teak craftsmanship',
            linkText: 'Learn More',
            linkUrl: '#',
          },
          {
            id: 'item-2',
            tag: 'VERNACULAR',
            title: 'Stone Courtyard',
            description: 'Laterite stone reflection pools naturally cool the interior.',
            imageUrl: PRESET_IMAGES[2].dataUri,
            imageAlt: 'Courtyard with water basin',
            linkText: 'Learn More',
            linkUrl: '#',
          },
          {
            id: 'item-3',
            tag: 'LIFESTYLE',
            title: 'Verandah Dining',
            description: 'Alfresco dining pergolas designed for year-round entertaining.',
            imageUrl: PRESET_IMAGES[4].dataUri,
            imageAlt: 'Verandah dining table',
            linkText: 'Learn More',
            linkUrl: '#',
          },
        ],
      };

    case 'letter':
      return {
        id,
        type: 'letter',
        title: 'New Editorial Letter',
        kicker: 'FROM THE DESK',
        headline: 'A Message to Our Community',
        authorName: 'Senior Principal',
        authorTitle: 'Studio Director',
        authorAvatarUrl: PRESET_IMAGES[4].dataUri,
        paragraphs: [
          'Every design we produce begins with an attentive reading of sunlight, soil, and wind patterns.',
          'Thank you for accompanying us on this journey of deliberate craft.',
        ],
        signatureText: 'The Architecture Council',
      };

    case 'gallery':
      return {
        id,
        type: 'gallery',
        title: 'New Photo Gallery',
        kicker: 'PHOTO SURVEY',
        headline: 'Natural Textures & Craft',
        description: 'Captured on-site across our seasonal projects.',
        layout: 'grid-2',
        images: [
          { id: 'g1', url: PRESET_IMAGES[1].dataUri, alt: 'Interior living space', caption: 'Verandah living room' },
          { id: 'g2', url: PRESET_IMAGES[2].dataUri, alt: 'Courtyard reflection pond', caption: 'Courtyard reflection basin' },
        ],
      };

    case 'quote':
      return {
        id,
        type: 'quote',
        quoteText: 'Architecture is the thoughtful making of space.',
        author: 'Louis Kahn',
        authorRole: 'Architect & Educator',
        theme: 'charcoal',
      };

    case 'milestones':
      return {
        id,
        type: 'milestones',
        kicker: 'AT A GLANCE',
        headline: 'Quarterly Milestones',
        milestones: [
          { id: 'm1', metric: '18+', label: 'Years', subtext: 'Continuous practice' },
          { id: 'm2', metric: '100%', label: 'Solar Assisted', subtext: 'Sustainable energy' },
          { id: 'm3', metric: '42', label: 'Homes', subtext: 'Delivered in 2026' },
          { id: 'm4', metric: '0', label: 'Net Waste', subtext: 'Eco-certified' },
        ],
      };

    case 'cta-banner':
      return {
        id,
        type: 'cta-banner',
        kicker: 'CURATED APPOINTMENTS',
        headline: 'Schedule a Private Site Walkthrough',
        description: 'Experience the craftsmanship and quiet surroundings in person.',
        primaryButtonText: 'Reserve Appointment',
        primaryButtonUrl: '#',
        theme: 'dark',
      };

    case 'footer':
      return {
        id,
        type: 'footer',
        brandName: 'NEWSLETTER EDITORIAL',
        addressLines: ['100 Design Boulevard, Suite 400', 'San Francisco, CA 94103'],
        phone: '+1 (800) 555-0144',
        email: 'contact@newsletter.com',
        socialLinks: [
          { platform: 'website', label: 'Website', url: '#' },
          { platform: 'instagram', label: 'Instagram', url: '#' },
        ],
        copyrightText: '© 2026 All rights reserved.',
        unsubscribeNotice: 'You received this email because you opted in to receive announcements.',
        unsubscribeUrl: '#',
      };

    case 'custom-html':
      return {
        id,
        type: 'custom-html',
        htmlContent: '<div style="padding: 20px; background-color: #faf5ee; border-radius: 4px; text-align: center; color: #7c4f2c; font-weight: 500;">Custom Callout Box (Editable HTML)</div>',
      };

    default:
      return {
        id,
        type: 'hero',
        headline: 'Default Block',
        kicker: 'SECTION',
        subtitle: 'Subhead',
        imageUrl: PRESET_IMAGES[0].dataUri,
        imageAlt: 'Hero',
        layout: 'image-above',
      };
  }
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock }) => {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Add Newsletter Blocks</h4>
        <span className="text-[11px] text-neutral-500">Click to insert</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {BLOCK_TEMPLATES.map((tmpl) => {
          const Icon = tmpl.icon;
          return (
            <button
              key={tmpl.type}
              type="button"
              onClick={() => onAddBlock(createDefaultBlock(tmpl.type))}
              className="group flex items-start gap-3 p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-md bg-neutral-800 group-hover:bg-amber-500/20 text-neutral-400 group-hover:text-amber-400 flex items-center justify-center shrink-0 transition-colors mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>{tmpl.label}</span>
                  <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-amber-400 transition-opacity" />
                </div>
                <div className="text-[11px] text-neutral-400 leading-tight truncate mt-0.5">{tmpl.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
