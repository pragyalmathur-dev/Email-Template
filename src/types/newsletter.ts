export type BlockType =
  | 'header'
  | 'hero'
  | 'letter'
  | 'two-column'
  | 'three-column'
  | 'gallery'
  | 'quote'
  | 'milestones'
  | 'cta-banner'
  | 'footer'
  | 'custom-html';

export interface BaseBlock {
  id: string;
  type: BlockType;
  title?: string;
  hidden?: boolean;
}

export interface HeaderBlock extends BaseBlock {
  type: 'header';
  brandName: string;
  subHeader: string;
  issueBadge: string;
  editionNo: string;
  logoUrl?: string;
  accentColor?: string;
  websiteUrl?: string;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  kicker: string;
  headline: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  imageCaption?: string;
  ctaText?: string;
  ctaUrl?: string;
  layout: 'image-above' | 'image-below' | 'text-overlay';
}

export interface LetterBlock extends BaseBlock {
  type: 'letter';
  kicker: string;
  headline: string;
  authorName: string;
  authorTitle: string;
  authorAvatarUrl?: string;
  paragraphs: string[];
  signatureText?: string;
}

export interface TwoColumnBlock extends BaseBlock {
  type: 'two-column';
  kicker: string;
  headline: string;
  description: string;
  specPills: string[];
  imageUrl: string;
  imageAlt: string;
  imageCaption?: string;
  imageSide: 'left' | 'right';
  ctaText: string;
  ctaUrl: string;
}

export interface ThreeColumnItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  linkText?: string;
  linkUrl?: string;
}

export interface ThreeColumnBlock extends BaseBlock {
  type: 'three-column';
  kicker: string;
  headline: string;
  subtitle: string;
  items: ThreeColumnItem[];
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  span?: 'full' | 'half';
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  kicker: string;
  headline: string;
  description: string;
  layout: 'grid-2' | 'grid-3' | 'hero-plus-grid';
  images: GalleryImage[];
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  quoteText: string;
  author: string;
  authorRole: string;
  sourceContext?: string;
  theme: 'light' | 'charcoal' | 'terracotta' | 'cream';
}

export interface MilestoneItem {
  id: string;
  metric: string;
  label: string;
  subtext: string;
}

export interface MilestonesBlock extends BaseBlock {
  type: 'milestones';
  kicker: string;
  headline: string;
  milestones: MilestoneItem[];
}

export interface CtaBannerBlock extends BaseBlock {
  type: 'cta-banner';
  kicker: string;
  headline: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  theme: 'dark' | 'cream' | 'terracotta';
}

export interface SocialLink {
  platform: 'instagram' | 'website' | 'linkedin' | 'youtube' | 'email';
  url: string;
  label: string;
}

export interface FooterBlock extends BaseBlock {
  type: 'footer';
  brandName: string;
  addressLines: string[];
  phone: string;
  email: string;
  socialLinks: SocialLink[];
  copyrightText: string;
  unsubscribeNotice: string;
  unsubscribeUrl: string;
  viewOnlineUrl?: string;
}

export interface CustomHtmlBlock extends BaseBlock {
  type: 'custom-html';
  htmlContent: string;
  caption?: string;
}

export type NewsletterBlock =
  | HeaderBlock
  | HeroBlock
  | LetterBlock
  | TwoColumnBlock
  | ThreeColumnBlock
  | GalleryBlock
  | QuoteBlock
  | MilestonesBlock
  | CtaBannerBlock
  | FooterBlock
  | CustomHtmlBlock;

export interface NewsletterMetadata {
  subject: string;
  preheader: string;
  senderName: string;
  senderEmail: string;
  title: string;
  accentColor: string;
  fontFamily: 'serif' | 'sans';
  maxWidth: number;
}

export interface NewsletterDocument {
  id: string;
  name: string;
  updatedAt: string;
  metadata: NewsletterMetadata;
  blocks: NewsletterBlock[];
  rawHtmlMode?: boolean;
  rawHtmlContent?: string;
}

export interface DetectedImage {
  id: string;
  blockId: string;
  blockTitle: string;
  blockType: string;
  fieldKey: string;
  index?: number;
  url: string;
  alt: string;
  caption?: string;
}
