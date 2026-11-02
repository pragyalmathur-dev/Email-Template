import { NewsletterBlock, NewsletterDocument } from '../types/newsletter';

/**
 * Generates email-client compliant, inline-styled HTML for newsletters.
 * Adheres to email standard: 600-680px centered tables, mobile media queries,
 * web font fallbacks, bulletproof buttons, and email preheader support.
 */

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateNewsletterHtml(doc: NewsletterDocument): string {
  if (doc.rawHtmlMode && doc.rawHtmlContent) {
    return doc.rawHtmlContent;
  }

  const { metadata, blocks } = doc;
  const isSerif = metadata.fontFamily === 'serif';
  const fontFamilyCss = isSerif
    ? "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
    : "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const bodyFont = isSerif
    ? "'Plus Jakarta Sans', Georgia, sans-serif"
    : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const accent = metadata.accentColor || '#934b35';
  const maxWidth = metadata.maxWidth || 680;

  const renderedBlocks = blocks
    .filter((b) => !b.hidden)
    .map((block) => renderBlockHtml(block, { accent, fontFamilyCss, bodyFont }))
    .join('\n');

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(metadata.title || metadata.subject)}</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style type="text/css">
    /* Client Resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; max-width: 100%; height: auto; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f7f5f0; }
    
    /* Responsive Queries */
    @media only screen and (max-width: 620px) {
      .mobile-full-width { width: 100% !important; max-width: 100% !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-headline { font-size: 28px !important; line-height: 36px !important; }
      .mobile-subhead { font-size: 16px !important; line-height: 24px !important; }
      .mobile-hide { display: none !important; }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Georgia, serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4efe9; color: #1c1917; -webkit-font-smoothing: antialiased;">
  <!-- Hidden Preheader Snippet -->
  <div style="display: none; font-size: 1px; color: #f4efe9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${escapeHtml(metadata.preheader || '')}
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- Main Email Wrapper Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4efe9;">
    <tr>
      <td align="center" style="padding: 24px 12px 48px 12px;">
        <!-- Centered Newsletter Container -->
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="${maxWidth}">
        <tr>
        <td align="center" valign="top" width="${maxWidth}">
        <![endif]-->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="mobile-full-width" style="max-width: ${maxWidth}px; background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); font-family: ${bodyFont};">
          ${renderedBlocks}
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

interface RenderContext {
  accent: string;
  fontFamilyCss: string;
  bodyFont: string;
}

function renderBlockHtml(block: NewsletterBlock, ctx: RenderContext): string {
  switch (block.type) {
    case 'header': {
      return `
      <!-- Block: Header -->
      <tr>
        <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #e7dfd5;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="left" valign="middle">
                <a href="${escapeHtml(block.websiteUrl || '#')}" target="_blank" style="text-decoration: none; display: inline-block;">
                  <span style="font-family: 'Cinzel', ${ctx.fontFamilyCss}; font-size: 26px; font-weight: 700; letter-spacing: 4px; color: #1c1917; text-transform: uppercase;">
                    ${escapeHtml(block.brandName)}
                  </span>
                </a>
                <div style="font-size: 11px; letter-spacing: 2px; color: #78716c; text-transform: uppercase; margin-top: 4px; font-weight: 500;">
                  ${escapeHtml(block.subHeader)}
                </div>
              </td>
              <td align="right" valign="middle" class="mobile-stack" style="text-align: right; padding-top: 6px;">
                <span style="font-size: 11px; letter-spacing: 1.5px; color: ${ctx.accent}; font-weight: 600; text-transform: uppercase; display: inline-block; padding: 4px 10px; border: 1px solid ${ctx.accent}40; border-radius: 2px;">
                  ${escapeHtml(block.editionNo)}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    }

    case 'hero': {
      return `
      <!-- Block: Hero -->
      <tr>
        <td style="padding: 0;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            ${
              block.imageUrl
                ? `<tr>
              <td align="center" style="padding: 0; line-height: 0;">
                <img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.imageAlt || block.headline)}" width="100%" style="width: 100%; max-width: 100%; height: auto; display: block;" />
              </td>
            </tr>`
                : ''
            }
            ${
              block.imageCaption
                ? `<tr>
              <td style="padding: 8px 36px 0 36px; font-size: 11px; font-style: italic; color: #a8a29e; text-align: right;" class="mobile-padding">
                ${escapeHtml(block.imageCaption)}
              </td>
            </tr>`
                : ''
            }
            <tr>
              <td style="padding: 32px 36px 36px 36px;" class="mobile-padding">
                <div style="font-size: 11px; letter-spacing: 2.5px; color: ${ctx.accent}; text-transform: uppercase; font-weight: 600; margin-bottom: 12px;">
                  ${escapeHtml(block.kicker)}
                </div>
                <h1 class="mobile-headline" style="margin: 0 0 16px 0; font-family: ${ctx.fontFamilyCss}; font-size: 38px; line-height: 44px; font-weight: 600; color: #1c1917; letter-spacing: -0.5px;">
                  ${escapeHtml(block.headline)}
                </h1>
                <p class="mobile-subhead" style="margin: 0 0 24px 0; font-size: 17px; line-height: 27px; color: #57534e;">
                  ${escapeHtml(block.subtitle)}
                </p>
                ${
                  block.ctaText
                    ? `<div>
                  <a href="${escapeHtml(block.ctaUrl || '#')}" target="_blank" style="display: inline-block; background-color: #1c1917; color: #ffffff; padding: 13px 26px; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; font-weight: 600; border-radius: 2px;">
                    ${escapeHtml(block.ctaText)} &rarr;
                  </a>
                </div>`
                    : ''
                }
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    }

    case 'letter': {
      const paragraphsHtml = block.paragraphs
        .map(
          (p) =>
            `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 26px; color: #44403c;">${escapeHtml(p)}</p>`
        )
        .join('');

      return `
      <!-- Block: Letter -->
      <tr>
        <td style="padding: 36px 36px 40px 36px; background-color: #faf7f2; border-top: 1px solid #eee7de; border-bottom: 1px solid #eee7de;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <div style="font-size: 11px; letter-spacing: 2px; color: ${ctx.accent}; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">
                  ${escapeHtml(block.kicker)}
                </div>
                <h2 style="margin: 0 0 20px 0; font-family: ${ctx.fontFamilyCss}; font-size: 28px; line-height: 34px; font-weight: 600; color: #1c1917;">
                  ${escapeHtml(block.headline)}
                </h2>
                ${paragraphsHtml}
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #d6ccc2;">
                  <div style="font-family: ${ctx.fontFamilyCss}; font-size: 18px; font-weight: 600; color: #1c1917;">
                    ${escapeHtml(block.authorName)}
                  </div>
                  <div style="font-size: 12px; color: #78716c; margin-top: 2px;">
                    ${escapeHtml(block.authorTitle)}
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    }

    case 'two-column': {
      const pillsHtml = (block.specPills || [])
        .map(
          (pill) =>
            `<span style="display: inline-block; font-size: 11px; color: #57534e; background-color: #f5f0eb; padding: 4px 10px; margin-right: 6px; margin-bottom: 6px; border-radius: 2px; font-weight: 500;">${escapeHtml(pill)}</span>`
        )
        .join('');

      const textCol = `
        <td width="50%" valign="top" class="mobile-stack" style="padding: 12px 16px;">
          <div style="font-size: 10px; letter-spacing: 2px; color: ${ctx.accent}; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">
            ${escapeHtml(block.kicker)}
          </div>
          <h2 style="margin: 0 0 12px 0; font-family: ${ctx.fontFamilyCss}; font-size: 26px; line-height: 32px; font-weight: 600; color: #1c1917;">
            ${escapeHtml(block.headline)}
          </h2>
          <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #57534e;">
            ${escapeHtml(block.description)}
          </p>
          ${pillsHtml ? `<div style="margin-bottom: 20px;">${pillsHtml}</div>` : ''}
          ${
            block.ctaText
              ? `<div>
            <a href="${escapeHtml(block.ctaUrl || '#')}" target="_blank" style="display: inline-block; background-color: ${ctx.accent}; color: #ffffff; padding: 10px 20px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; font-weight: 600; border-radius: 2px;">
              ${escapeHtml(block.ctaText)} &rarr;
            </a>
          </div>`
              : ''
          }
        </td>
      `;

      const imageCol = `
        <td width="50%" valign="middle" class="mobile-stack" style="padding: 12px 16px; text-align: center;">
          <img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.imageAlt || block.headline)}" width="100%" style="width: 100%; max-width: 100%; height: auto; border-radius: 3px; display: block;" />
          ${
            block.imageCaption
              ? `<div style="font-size: 11px; font-style: italic; color: #a8a29e; text-align: left; margin-top: 6px;">${escapeHtml(block.imageCaption)}</div>`
              : ''
          }
        </td>
      `;

      return `
      <!-- Block: Two Column -->
      <tr>
        <td style="padding: 36px 20px;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              ${block.imageSide === 'left' ? `${imageCol}${textCol}` : `${textCol}${imageCol}`}
            </tr>
          </table>
        </td>
      </tr>`;
    }

    case 'three-column': {
      const itemsHtml = block.items
        .map(
          (item) => `
        <td width="33.33%" valign="top" class="mobile-stack" style="padding: 12px 10px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            ${
              item.imageUrl
                ? `<tr>
              <td style="padding-bottom: 12px; line-height: 0;">
                <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.imageAlt || item.title)}" width="100%" style="width: 100%; height: 160px; object-fit: cover; border-radius: 3px; display: block;" />
              </td>
            </tr>`
                : ''
            }
            <tr>
              <td>
                <div style="font-size: 10px; letter-spacing: 1.5px; color: ${ctx.accent}; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">
                  ${escapeHtml(item.tag)}
                </div>
                <h3 style="margin: 0 0 8px 0; font-family: ${ctx.fontFamilyCss}; font-size: 19px; line-height: 24px; font-weight: 600; color: #1c1917;">
                  ${escapeHtml(item.title)}
                </h3>
                <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 19px; color: #57534e;">
                  ${escapeHtml(item.description)}
                </p>
                ${
                  item.linkText
                    ? `<a href="${escapeHtml(item.linkUrl || '#')}" target="_blank" style="font-size: 11px; letter-spacing: 1px; color: #1c1917; text-transform: uppercase; font-weight: 600; text-decoration: underline;">
                  ${escapeHtml(item.linkText)} &rarr;
                </a>`
                    : ''
                }
              </td>
            </tr>
          </table>
        </td>
      `
        )
        .join('');

      return `
      <!-- Block: Three Column -->
      <tr>
        <td style="padding: 36px 26px; border-top: 1px solid #f0eae1;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <div style="font-size: 11px; letter-spacing: 2px; color: ${ctx.accent}; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">
                  ${escapeHtml(block.kicker)}
                </div>
                <h2 style="margin: 0 0 6px 0; font-family: ${ctx.fontFamilyCss}; font-size: 28px; line-height: 34px; font-weight: 600; color: #1c1917;">
                  ${escapeHtml(block.headline)}
                </h2>
                ${
                  block.subtitle
                    ? `<p style="margin: 0; font-size: 14px; color: #78716c;">${escapeHtml(block.subtitle)}</p>`
                    : ''
                }
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    ${itemsHtml}
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    }

    case 'gallery': {
      const imagesHtml = block.images
        .map(
          (img) => `
        <td width="50%" valign="top" class="mobile-stack" style="padding: 8px;">
          <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt || '')}" width="100%" style="width: 100%; height: 200px; object-fit: cover; border-radius: 2px; display: block;" />
          ${img.caption ? `<div style="font-size: 11px; font-style: italic; color: #78716c; margin-top: 6px;">${escapeHtml(img.caption)}</div>` : ''}
        </td>
      `
        )
        .join('');

      return `
      <!-- Block: Gallery -->
      <tr>
        <td style="padding: 36px 28px; background-color: #faf7f2;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <div style="font-size: 11px; letter-spacing: 2px; color: ${ctx.accent}; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">
                  ${escapeHtml(block.kicker)}
                </div>
                <h2 style="margin: 0; font-family: ${ctx.fontFamilyCss}; font-size: 26px; line-height: 32px; font-weight: 600; color: #1c1917;">
                  ${escapeHtml(block.headline)}
                </h2>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    ${imagesHtml}
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    }

    case 'quote': {
      const isCharcoal = block.theme === 'charcoal';
      const bgColor = isCharcoal ? '#1c1917' : '#faf7f2';
      const textColor = isCharcoal ? '#f5f0eb' : '#1c1917';
      const citationColor = isCharcoal ? '#a8a29e' : '#78716c';

      return `
      <!-- Block: Quote -->
      <tr>
        <td align="center" style="padding: 44px 36px; background-color: ${bgColor};" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px;">
            <tr>
              <td align="center">
                <div style="font-family: ${ctx.fontFamilyCss}; font-size: 40px; line-height: 20px; color: ${ctx.accent};">&ldquo;</div>
                <blockquote style="margin: 8px 0 16px 0; font-family: ${ctx.fontFamilyCss}; font-size: 22px; line-height: 32px; font-style: italic; color: ${textColor}; text-align: center;">
                  ${escapeHtml(block.quoteText)}
                </blockquote>
                <div style="font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${textColor};">
                  ${escapeHtml(block.author)}
                </div>
                <div style="font-size: 12px; color: ${citationColor}; margin-top: 3px;">
                  ${escapeHtml(block.authorRole)}${block.sourceContext ? ` · ${escapeHtml(block.sourceContext)}` : ''}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    }

    case 'milestones': {
      const statsHtml = block.milestones
        .map(
          (m) => `
        <td width="25%" valign="top" align="center" class="mobile-stack" style="padding: 12px 8px;">
          <div style="font-family: 'Cinzel', ${ctx.fontFamilyCss}; font-size: 32px; font-weight: 700; color: ${ctx.accent}; line-height: 38px;">
            ${escapeHtml(m.metric)}
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #1c1917; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">
            ${escapeHtml(m.label)}
          </div>
          <div style="font-size: 11px; color: #78716c; margin-top: 2px;">
            ${escapeHtml(m.subtext)}
          </div>
        </td>
      `
        )
        .join('');

      return `
      <!-- Block: Milestones -->
      <tr>
        <td style="padding: 36px 24px; border-top: 1px solid #f0eae1; border-bottom: 1px solid #f0eae1;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <div style="font-size: 10px; letter-spacing: 2px; color: ${ctx.accent}; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">
                  ${escapeHtml(block.kicker)}
                </div>
                <h2 style="margin: 0; font-family: ${ctx.fontFamilyCss}; font-size: 24px; line-height: 30px; font-weight: 600; color: #1c1917;">
                  ${escapeHtml(block.headline)}
                </h2>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    ${statsHtml}
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    }

    case 'cta-banner': {
      return `
      <!-- Block: CTA Banner -->
      <tr>
        <td align="center" style="padding: 44px 36px; background-color: #1c1917; color: #ffffff;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px;">
            <tr>
              <td align="center">
                <div style="font-size: 10px; letter-spacing: 2px; color: #e0aa62; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">
                  ${escapeHtml(block.kicker)}
                </div>
                <h2 style="margin: 0 0 12px 0; font-family: ${ctx.fontFamilyCss}; font-size: 30px; line-height: 36px; font-weight: 600; color: #ffffff;">
                  ${escapeHtml(block.headline)}
                </h2>
                <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 23px; color: #d6d3d1;">
                  ${escapeHtml(block.description)}
                </p>
                <div>
                  <a href="${escapeHtml(block.primaryButtonUrl || '#')}" target="_blank" style="display: inline-block; background-color: #d4af37; color: #1c1917; padding: 13px 28px; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; font-weight: 700; border-radius: 2px; margin-right: 8px; margin-bottom: 8px;">
                    ${escapeHtml(block.primaryButtonText)} &rarr;
                  </a>
                  ${
                    block.secondaryButtonText
                      ? `<a href="${escapeHtml(block.secondaryButtonUrl || '#')}" target="_blank" style="display: inline-block; background-color: transparent; color: #f5f0eb; border: 1px solid #78716c; padding: 12px 24px; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; font-weight: 600; border-radius: 2px; margin-bottom: 8px;">
                    ${escapeHtml(block.secondaryButtonText)}
                  </a>`
                      : ''
                  }
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    }

    case 'footer': {
      const addressLinesHtml = (block.addressLines || [])
        .map((line) => `<div style="margin-bottom: 3px;">${escapeHtml(line)}</div>`)
        .join('');

      const socialLinksHtml = (block.socialLinks || [])
        .map(
          (link) =>
            `<a href="${escapeHtml(link.url)}" target="_blank" style="display: inline-block; margin: 0 8px; color: #78716c; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-decoration: underline;">${escapeHtml(link.label)}</a>`
        )
        .join(' · ');

      return `
      <!-- Block: Footer -->
      <tr>
        <td style="padding: 36px 36px 40px 36px; background-color: #f7f5f0; border-top: 1px solid #e7dfd5; text-align: center;" class="mobile-padding">
          <div style="font-family: 'Cinzel', ${ctx.fontFamilyCss}; font-size: 18px; font-weight: 700; letter-spacing: 3px; color: #1c1917; text-transform: uppercase; margin-bottom: 12px;">
            ${escapeHtml(block.brandName)}
          </div>
          <div style="font-size: 12px; line-height: 20px; color: #78716c; margin-bottom: 16px;">
            ${addressLinesHtml}
            ${block.phone ? `<div>Tel: ${escapeHtml(block.phone)} | Email: ${escapeHtml(block.email)}</div>` : ''}
          </div>
          ${socialLinksHtml ? `<div style="margin-bottom: 18px;">${socialLinksHtml}</div>` : ''}
          <div style="font-size: 11px; line-height: 18px; color: #a8a29e; max-width: 480px; margin: 0 auto 12px auto;">
            ${escapeHtml(block.unsubscribeNotice)}
          </div>
          <div style="font-size: 11px; color: #78716c;">
            <a href="${escapeHtml(block.unsubscribeUrl || '#')}" style="color: #78716c; text-decoration: underline;">Unsubscribe</a>
            ${
              block.viewOnlineUrl
                ? ` · <a href="${escapeHtml(block.viewOnlineUrl)}" style="color: #78716c; text-decoration: underline;">View Online Version</a>`
                : ''
            }
          </div>
          <div style="font-size: 10px; color: #a8a29e; margin-top: 14px;">
            ${escapeHtml(block.copyrightText)}
          </div>
        </td>
      </tr>`;
    }

    case 'custom-html': {
      return `
      <!-- Block: Custom HTML -->
      <tr>
        <td style="padding: 16px 20px;">
          ${block.htmlContent || ''}
        </td>
      </tr>`;
    }

    default:
      return '';
  }
}
