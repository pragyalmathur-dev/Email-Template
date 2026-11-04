/**
 * Ready-to-use, email-client-compatible HTML section templates
 * Designed for Microsoft Word / Brevo / Mailchimp quality newsletter editing.
 */

export interface SectionTemplate {
  id: string;
  title: string;
  category: 'content' | 'game' | 'media' | 'cta' | 'data' | 'footer';
  description: string;
  iconName: string;
  badge?: string;
  generateHtml: () => string;
}

export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    id: 'feature-article',
    title: 'Featured Story / Article',
    category: 'content',
    description: 'Headline, author byline, feature image, introductory text, and read more button.',
    iconName: 'Newspaper',
    badge: 'Popular',
    generateHtml: () => `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 8px; margin: 16px 0; border: 1px solid #e7e5e4;">
  <tr>
    <td style="padding: 24px;">
      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #b45309; display: block; margin-bottom: 6px;">FEATURE STORY</span>
      <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #1c1917; line-height: 1.3;">Designing for Tomorrow: The New Architecture Paradigm</h2>
      <p style="margin: 0 0 16px 0; font-size: 12px; color: #78716c; font-style: italic;">By Editorial Team &middot; 4 min read</p>
      <div style="margin-bottom: 16px;">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80" alt="Architecture Feature" width="100%" style="display: block; border-radius: 6px; max-height: 320px; object-fit: cover;" />
      </div>
      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #44403c;">
        Every season brings an opportunity to reflect on craftsmanship, intentional spaces, and how community values shape our living environments. Explore the thinking behind our newest residential sanctuaries.
      </p>
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="border-radius: 6px; background-color: #f59e0b;">
            <a href="#" style="font-size: 13px; font-weight: 700; color: #1c1917; text-decoration: none; padding: 10px 20px; display: inline-block;">Read Full Story &rarr;</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
  },

  {
    id: 'sudoku-game',
    title: 'Sudoku Game & Puzzle Zone',
    category: 'game',
    description: 'Interactive Sudoku challenge grid with difficulty badge, instructions, and prize banner.',
    iconName: 'Gamepad2',
    badge: 'Interactive',
    generateHtml: () => `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf5ff; border: 2px dashed #a855f7; border-radius: 12px; margin: 20px 0;">
  <tr>
    <td style="padding: 24px; text-align: center;">
      <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #7e22ce; background-color: #f3e8ff; padding: 4px 12px; border-radius: 999px; display: inline-block; margin-bottom: 8px;">BRAIN TEASER &middot; ISSUE CHALLENGE</span>
      <h3 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: #3b0764;">Sudoku of the Week</h3>
      <p style="margin: 0 0 18px 0; font-size: 12px; color: #6b21a8;">Solve the puzzle below and submit your row 5 numbers to win our monthly coffee table gift set!</p>
      
      <!-- Sudoku 9x9 Grid (Email-safe HTML table) -->
      <table align="center" border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 3px solid #581c87; background-color: #ffffff; margin: 0 auto 16px auto; width: 280px; height: 280px; text-align: center; font-family: monospace; font-size: 16px; font-weight: bold; color: #1e1b4b;">
        <tr style="height: 30px;">
          <td style="width: 30px; border-right: 2px solid #581c87; background-color: #f5f3ff;">5</td>
          <td style="width: 30px;">3</td>
          <td style="width: 30px; border-right: 3px solid #581c87;">&nbsp;</td>
          <td style="width: 30px;">&nbsp;</td>
          <td style="width: 30px; background-color: #f5f3ff;">7</td>
          <td style="width: 30px; border-right: 3px solid #581c87;">&nbsp;</td>
          <td style="width: 30px;">&nbsp;</td>
          <td style="width: 30px;">&nbsp;</td>
          <td style="width: 30px;">&nbsp;</td>
        </tr>
        <tr style="height: 30px;">
          <td>6</td>
          <td>&nbsp;</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>1</td>
          <td>9</td>
          <td style="border-right: 3px solid #581c87;">5</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr style="height: 30px; border-bottom: 3px solid #581c87;">
          <td>&nbsp;</td>
          <td>9</td>
          <td style="border-right: 3px solid #581c87;">8</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>&nbsp;</td>
          <td>6</td>
          <td>&nbsp;</td>
        </tr>
        <tr style="height: 30px;">
          <td>8</td>
          <td>&nbsp;</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>&nbsp;</td>
          <td>6</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>3</td>
        </tr>
        <tr style="height: 30px; background-color: #fef08a;">
          <td>4</td>
          <td>&nbsp;</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>8</td>
          <td>&nbsp;</td>
          <td style="border-right: 3px solid #581c87;">3</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>1</td>
        </tr>
        <tr style="height: 30px; border-bottom: 3px solid #581c87;">
          <td>7</td>
          <td>&nbsp;</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>&nbsp;</td>
          <td>2</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>6</td>
        </tr>
        <tr style="height: 30px;">
          <td>&nbsp;</td>
          <td>6</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>2</td>
          <td>8</td>
          <td>&nbsp;</td>
        </tr>
        <tr style="height: 30px;">
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>4</td>
          <td>1</td>
          <td style="border-right: 3px solid #581c87;">9</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>5</td>
        </tr>
        <tr style="height: 30px;">
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>&nbsp;</td>
          <td>8</td>
          <td style="border-right: 3px solid #581c87;">&nbsp;</td>
          <td>&nbsp;</td>
          <td>7</td>
          <td>9</td>
        </tr>
      </table>

      <table align="center" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="border-radius: 6px; background-color: #9333ea;">
            <a href="#" style="font-size: 12px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 8px 18px; display: inline-block;">Submit Answers &amp; View Solutions &rarr;</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
  },

  {
    id: 'two-column-feature',
    title: 'Two-Column Split (Image + Story)',
    category: 'content',
    description: 'Side-by-side photo and story copy with bullet points and action link.',
    iconName: 'Columns2',
    generateHtml: () => `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 16px 0; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px;">
  <tr>
    <td style="padding: 20px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="48%" valign="top" style="padding-right: 12px;">
            <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80" alt="Spotlight" width="100%" style="display: block; border-radius: 6px; max-height: 240px; object-fit: cover;" />
          </td>
          <td width="48%" valign="top" style="padding-left: 12px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #b45309; letter-spacing: 0.1em;">SPOTLIGHT</span>
            <h3 style="margin: 4px 0 10px 0; font-size: 18px; font-weight: 700; color: #1c1917; line-height: 1.3;">Customer Delight Stories</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #57534e;">
              Hear directly from our homeowners about their journey from blueprint to moving into their dream estate.
            </p>
            <ul style="margin: 0 0 14px 0; padding-left: 18px; font-size: 12px; color: #44403c; line-height: 1.6;">
              <li>Dedicated lifestyle concierge</li>
              <li>Sustainably sourced stone &amp; wood</li>
              <li>Seamless property management</li>
            </ul>
            <a href="#" style="font-size: 12px; font-weight: 700; color: #d97706; text-decoration: none;">Watch Video Interviews &rarr;</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
  },

  {
    id: 'three-column-cards',
    title: 'Three-Column Highlights Grid',
    category: 'content',
    description: 'Three equal cards with thumbnail images, badges, and headline titles.',
    iconName: 'LayoutGrid',
    generateHtml: () => `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 16px 0;">
  <tr>
    <td style="padding: 10px 0;">
      <h3 style="margin: 0 0 14px 0; font-size: 18px; font-weight: 700; color: #1c1917; text-align: center;">In This Edition &middot; Highlights</h3>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <!-- Card 1 -->
          <td width="31%" valign="top" style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; padding: 12px; text-align: center;">
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80" alt="Card 1" width="100%" style="display: block; border-radius: 4px; height: 110px; object-fit: cover; margin-bottom: 8px;" />
            <span style="font-size: 10px; font-weight: 700; color: #0284c7; text-transform: uppercase;">Leadership</span>
            <h4 style="margin: 4px 0; font-size: 13px; font-weight: 700; color: #1c1917;">Meet Our CEO</h4>
            <p style="margin: 0; font-size: 11px; color: #78716c; line-height: 1.4;">Q&amp;A on growth, hospitality, and innovation.</p>
          </td>
          <td width="3%">&nbsp;</td>
          <!-- Card 2 -->
          <td width="31%" valign="top" style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; padding: 12px; text-align: center;">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80" alt="Card 2" width="100%" style="display: block; border-radius: 4px; height: 110px; object-fit: cover; margin-bottom: 8px;" />
            <span style="font-size: 10px; font-weight: 700; color: #059669; text-transform: uppercase;">Sustainability</span>
            <h4 style="margin: 4px 0; font-size: 13px; font-weight: 700; color: #1c1917;">Green Horizons</h4>
            <p style="margin: 0; font-size: 11px; color: #78716c; line-height: 1.4;">500 new saplings planted this quarter.</p>
          </td>
          <td width="3%">&nbsp;</td>
          <!-- Card 3 -->
          <td width="31%" valign="top" style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; padding: 12px; text-align: center;">
            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&auto=format&fit=crop&q=80" alt="Card 3" width="100%" style="display: block; border-radius: 4px; height: 110px; object-fit: cover; margin-bottom: 8px;" />
            <span style="font-size: 10px; font-weight: 700; color: #d97706; text-transform: uppercase;">Community</span>
            <h4 style="margin: 4px 0; font-size: 13px; font-weight: 700; color: #1c1917;">Upcoming Gala</h4>
            <p style="margin: 0; font-size: 11px; color: #78716c; line-height: 1.4;">Annual homeowner dinner &amp; art evening.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
  },

  {
    id: 'hero-banner',
    title: 'Hero Announcement Banner',
    category: 'cta',
    description: 'High-impact full-width banner with bold title, subtitle, and primary call to action.',
    iconName: 'Sparkles',
    generateHtml: () => `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1c1917; border-radius: 10px; margin: 20px 0; overflow: hidden;">
  <tr>
    <td style="padding: 36px 24px; text-align: center; color: #ffffff;">
      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #fbbf24; display: block; margin-bottom: 10px;">EXCITING ANNOUNCEMENT</span>
      <h1 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.2;">The Grand Unveiling of Estate IV</h1>
      <p style="margin: 0 auto 20px auto; font-size: 14px; line-height: 1.6; color: #d6d3d1; max-width: 480px;">
        Private viewings now open for accredited patrons. Experience bespoke coastal architecture combined with tranquil sanctuary grounds.
      </p>
      <table align="center" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="border-radius: 6px; background-color: #f59e0b;">
            <a href="#" style="font-size: 13px; font-weight: 800; color: #1c1917; text-decoration: none; padding: 12px 28px; display: inline-block;">Reserve Private Tour &rarr;</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
  },

  {
    id: 'quote-testimonial',
    title: 'Quote & Leader Testimonial',
    category: 'content',
    description: 'Large quotation marks, featured endorsement quote, and portrait avatar badge.',
    iconName: 'MessageSquareQuote',
    generateHtml: () => `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fefce8; border-left: 4px solid #ca8a04; border-radius: 6px; margin: 18px 0;">
  <tr>
    <td style="padding: 20px 24px;">
      <div style="font-size: 32px; color: #ca8a04; line-height: 1; font-family: Georgia, serif; margin-bottom: -10px;">&ldquo;</div>
      <p style="margin: 0 0 12px 0; font-size: 15px; font-style: italic; color: #713f12; line-height: 1.6;">
        True luxury isn&rsquo;t about excess; it&rsquo;s about the seamless quietude of a morning where every detail has been thoughtfully orchestrated.
      </p>
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td width="40" valign="middle">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" width="36" height="36" style="display: block; border-radius: 999px; object-fit: cover;" />
          </td>
          <td style="padding-left: 10px;" valign="middle">
            <div style="font-size: 12px; font-weight: bold; color: #1c1917;">Priya Mathur</div>
            <div style="font-size: 11px; color: #854d0e;">Director of Design &middot; Vianaar Sanctuary</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
  },

  {
    id: 'milestones-counter',
    title: 'Stats & Milestones Counter',
    category: 'data',
    description: '3 or 4 metric numbers highlighting achievements, community stats, or growth.',
    iconName: 'Trophy',
    generateHtml: () => `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f4; border-radius: 8px; margin: 16px 0; text-align: center;">
  <tr>
    <td style="padding: 24px 12px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="33%" style="border-right: 1px solid #d6d3d1;">
            <div style="font-size: 26px; font-weight: 800; color: #b45309;">140+</div>
            <div style="font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600; margin-top: 4px;">Homes Delivered</div>
          </td>
          <td width="33%" style="border-right: 1px solid #d6d3d1;">
            <div style="font-size: 26px; font-weight: 800; color: #b45309;">98.4%</div>
            <div style="font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600; margin-top: 4px;">Customer Satisfaction</div>
          </td>
          <td width="33%">
            <div style="font-size: 26px; font-weight: 800; color: #b45309;">12 Yrs</div>
            <div style="font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600; margin-top: 4px;">Legacy of Excellence</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
  },

  {
    id: 'event-calendar',
    title: 'Event & Webinar Box',
    category: 'content',
    description: 'Calendar date badge, event title, description, and RSVP button.',
    iconName: 'Calendar',
    generateHtml: () => `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e7e5e4; border-radius: 8px; background-color: #ffffff; margin: 16px 0;">
  <tr>
    <td style="padding: 20px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <!-- Date Badge -->
          <td width="64" valign="top">
            <table border="0" cellpadding="0" cellspacing="0" width="58" style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; text-align: center;">
              <tr>
                <td style="background-color: #f59e0b; color: #1c1917; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 3px 0;">NOV</td>
              </tr>
              <tr>
                <td style="font-size: 22px; font-weight: 800; color: #78350f; padding: 6px 0;">18</td>
              </tr>
            </table>
          </td>
          <!-- Details -->
          <td style="padding-left: 16px;" valign="top">
            <span style="font-size: 10px; font-weight: 700; color: #d97706; text-transform: uppercase;">UPCOMING GATHERING</span>
            <h3 style="margin: 2px 0 6px 0; font-size: 16px; font-weight: 700; color: #1c1917;">Autumn Homeowner Soirée &amp; Tasting</h3>
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #57534e; line-height: 1.5;">
              Join neighbors for an artisanal tasting menu, live acoustic quartet, and a look at upcoming winter events.
            </p>
            <div style="font-size: 11px; color: #78716c; margin-bottom: 10px;">&bull; 6:30 PM &ndash; 9:30 PM &middot; The Clubhouse Lawn</div>
            <a href="#" style="font-size: 12px; font-weight: 700; color: #b45309; text-decoration: none;">RSVP Your Seats &rarr;</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
  },

  {
    id: 'callout-box',
    title: 'Callout Notice / Highlight Note',
    category: 'cta',
    description: 'Notice box with amber border and actionable reminder note.',
    iconName: 'AlertCircle',
    generateHtml: () => `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; margin: 16px 0;">
  <tr>
    <td style="padding: 16px 20px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="28" valign="top" style="font-size: 20px; color: #d97706; line-height: 1;">&#9888;</td>
          <td style="padding-left: 12px;" valign="top">
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #92400e;">Reminder: Annual Maintenance Window</h4>
            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #b45309;">
              Water filtration inspections are scheduled between Nov 10&ndash;14. Please notify your community concierge if you require specific appointment slots.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
  },

  {
    id: 'footer-social',
    title: 'Newsletter Footer & Unsubscribe',
    category: 'footer',
    description: 'Clean email footer with contact details, social links, and compliance unsubscribe note.',
    iconName: 'FileText',
    generateHtml: () => `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f4; border-top: 1px solid #e7e5e4; margin-top: 32px;">
  <tr>
    <td style="padding: 28px 24px; text-align: center; font-size: 12px; color: #78716c; line-height: 1.6;">
      <div style="font-weight: 700; color: #292524; font-size: 14px; margin-bottom: 6px;">VIANAAR HOMES &middot; THE INSIDE EDIT</div>
      <p style="margin: 0 0 10px 0;">Main Boulevard Sanctuary Grounds &middot; Goa &middot; India &middot; Tel: +91 98200 12345</p>
      <p style="margin: 0 0 14px 0; font-size: 11px; color: #a8a29e;">
        You received this newsletter because you are a registered patron of Vianaar Homes.
      </p>
      <div style="font-size: 11px;">
        <a href="#" style="color: #78716c; text-decoration: underline; margin: 0 6px;">Unsubscribe</a> &middot;
        <a href="#" style="color: #78716c; text-decoration: underline; margin: 0 6px;">Update Preferences</a> &middot;
        <a href="#" style="color: #78716c; text-decoration: underline; margin: 0 6px;">Privacy Policy</a>
      </div>
      <div style="margin-top: 14px; font-size: 10px; color: #a8a29e;">
        &copy; ${new Date().getFullYear()} Vianaar Homes. All rights reserved.
      </div>
    </td>
  </tr>
</table>`,
  },
];
