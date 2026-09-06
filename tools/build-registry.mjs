/**
 * GOV.UK AI Components — tile builder.
 *
 * Renders self-contained tiles from tools/inventory.mjs: one HTML file per
 * variant with real GOV.UK markup, inline CSS approximation, and the full
 * v2 agent-meta block (discovery/selection/instruction/coordination/
 * constraints/portability + compliance/mobileUX).
 *
 * Usage: node tools/build-registry.mjs [--force]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { inventory, COMPLIANCE } from './inventory.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TILE_DIR = join(ROOT, 'infinite');
const FORCE = process.argv.includes('--force');

// ─── Shared CSS (GOV.UK visual language approximation) ───────────────────────

const BASE_CSS = `
body{font-family:'Marianne',Arial,Helvetica,sans-serif;font-size:1rem;line-height:1.5rem;color:#161616;padding:2rem;background:#fff;margin:0}
.cap{position:fixed;bottom:12px;left:16px;font-size:11px;letter-spacing:.08em;color:#666;text-transform:uppercase}
a{color:#000091}
:focus-visible{outline:2px solid #0a76f6;outline-offset:2px}
.govuk-visually-hidden,.fr-visually-hidden{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.fr-label{display:block;font-weight:500;font-size:.875rem;line-height:1.5rem;color:#161616}
.fr-hint-text{display:block;font-weight:400;font-size:.75rem;line-height:1.25rem;color:#666;margin-top:0}
.fr-error-text{display:block;font-weight:500;font-size:.75rem;line-height:1.5rem;color:#ce0500;margin-top:4px}
.fr-valid-text{display:block;font-weight:500;font-size:.75rem;line-height:1.5rem;color:#18753c;margin-top:4px}
.fr-text--lg{font-size:1.25rem;line-height:2rem}
.fr-text--sm,.fr-callout p{font-size:.875rem;line-height:1.5rem}
`;

const CSS = {
  'button': `.fr-btn{font:inherit;display:inline-flex;align-items:center;flex-direction:row;padding:.5rem 1rem;background:#000091;color:#fff;border:0;border-radius:.25rem .25rem 0 0;cursor:pointer;text-decoration:none;text-align:center}
.fr-btn:hover{background:#1212ff}
.fr-btn--secondary{background:#fff;color:#000091;box-shadow:inset 0 0 0 1px #000091}
.fr-btn--secondary:hover{background:#f5f5fe}
.fr-btn--tertiary{background:#fff;color:#000091;box-shadow:inset 0 0 0 1px #ddd}
.fr-btn--tertiary:hover{background:#f5f5fe}
.fr-btn--disabled{background:#e5e5e5;color:#929292;cursor:not-allowed;box-shadow:none}
.fr-btn--icon-left:before,.fr-btn--icon-right:after{content:"→";font-weight:400}
.fr-btn--icon-left:before{margin-right:.5rem}
`,
  'input': `.fr-input-group{margin-bottom:1.5rem;max-width:30rem}
.fr-input-group--error .fr-input,.fr-input:invalid{border:2px solid #ce0500}
.fr-input-group--valid .fr-input{border:2px solid #18753c}
.fr-input{display:block;width:100%;border-radius:.25rem .25rem 0 0;border:1px solid #161616;border-top:2px solid #161616;padding:.5rem .75rem;color:#161616;background:#fff;font:inherit}
.fr-input:focus{outline:2px solid #0a76f6;outline-offset:2px}
.fr-input-group--error .fr-label,.fr-input-group--valid .fr-label{margin-top:.75rem}
.fr-select-group{margin-bottom:1.5rem;max-width:30rem}
.fr-select{display:block;width:100%;border-radius:.25rem .25rem 0 0;border:1px solid #161616;border-top:2px solid #161616;padding:.5rem .75rem;font:inherit;color:#161616;background:#fff}
.fr-select-group--error .fr-select{border:2px solid #ce0500}
.fr-select-group--error .fr-label{margin-top:.75rem}
.fr-textarea{min-height:8rem}
.fr-upload{font:inherit;border:0;padding:.25rem 0;color:#161616;width:100%}
.fr-upload-group--error .fr-upload{border:1px solid #ce0500}
`,
  'checkbox': `.fr-checkbox-group,.fr-radio-group{margin-bottom:1.5rem}
.fr-fieldset{border:0;padding:0;margin:0}
.fr-fieldset__legend{font-weight:500;padding:0}
.fr-fieldset__element{margin-bottom:1rem}
.fr-fieldset--error{border-left:2px solid #ce0500;padding-left:1rem}
.fr-checkbox-group input[type=checkbox]{position:absolute;opacity:0;width:20px;height:20px;margin:0}
.fr-checkbox-group label{position:relative;padding-left:2rem;cursor:pointer;display:inline-block}
.fr-checkbox-group input[type=checkbox]+label:before{content:"";position:absolute;left:0;top:1px;width:18px;height:18px;border:1px solid #161616;border-radius:.15rem;background:#fff}
.fr-checkbox-group input[type=checkbox]:checked+label:after{content:"✓";position:absolute;left:4px;top:-2px;color:#000091;font-weight:700}
.fr-checkbox-group input[type=checkbox]:focus+label:before{outline:2px solid #0a76f6;outline-offset:2px}
`,
  'radio': `.fr-radio-group{margin-bottom:1.5rem}
.fr-fieldset{border:0;padding:0;margin:0}
.fr-fieldset__legend{font-weight:500;padding:0}
.fr-fieldset__element{margin-bottom:1rem}
.fr-radio-group input[type=radio]{position:absolute;opacity:0;width:20px;height:20px;margin:0}
.fr-radio-group label{position:relative;padding-left:2rem;cursor:pointer;display:inline-block}
.fr-radio-group input[type=radio]+label:before{content:"";position:absolute;left:0;top:1px;width:18px;height:18px;border:1px solid #161616;border-radius:50%;background:#fff}
.fr-radio-group input[type=radio]:checked+label:after{content:"";position:absolute;left:5px;top:6px;width:10px;height:10px;border-radius:50%;background:#000091}
.fr-radio-group input[type=radio]:focus+label:before{outline:2px solid #0a76f6;outline-offset:2px}
`,
  'toggle': `.fr-toggle{margin-bottom:1.5rem}
.fr-toggle__input{position:absolute;opacity:0;width:40px;height:24px;margin:0}
.fr-toggle__label{position:relative;display:inline-block;padding-left:3rem;padding-top:.25rem;cursor:pointer}
.fr-toggle__label:before{content:"";position:absolute;left:0;top:0;width:40px;height:24px;background:#e5e5e5;border-radius:1rem;border:1px solid #161616;transition:.1s}
.fr-toggle__label:after{content:"";position:absolute;left:3px;top:4px;width:16px;height:16px;border-radius:50%;background:#161616;transition:.1s}
.fr-toggle__input:checked+label:before{background:#000091}
.fr-toggle__input:checked+label:after{transform:translateX(1rem);background:#fff}
.fr-toggle__input:focus+label:before{outline:2px solid #0a76f6;outline-offset:2px}
`,
  'stepper': `.fr-stepper{margin-bottom:2rem;max-width:40rem}
.fr-stepper__title{font-size:1.375rem;font-weight:700;margin:0 0 .5rem}
.fr-stepper__state{color:#666;font-weight:400;font-size:1rem}
.fr-stepper__steps{height:.5rem;background:linear-gradient(90deg,#000091 var(--dsfr-step,66%),#eee var(--dsfr-step,66%));border-radius:.25rem;margin-bottom:.5rem}
.fr-stepper__details{font-size:.875rem;margin:0;color:#666}
`,
  'upload': `.fr-upload-group{margin-bottom:1.5rem;max-width:30rem}
.fr-upload-group--error .fr-label{margin-top:.75rem}
.fr-upload{cursor:pointer}
`,
  'search': `.fr-search-bar{display:flex;max-width:30rem}
.fr-search-bar label{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.fr-search-bar .fr-input{border-radius:.25rem 0 0 0;border-right:0}
.fr-search-bar .fr-btn{border-radius:0 .25rem 0 0}
`,
  'breadcrumb': `.fr-breadcrumb{margin:1rem 0}
.fr-breadcrumb__button{display:none;font:inherit;color:#000091;background:none;border:0;text-decoration:underline;cursor:pointer;padding:0}
.fr-breadcrumb__list{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:.25rem;font-size:.75rem}
.fr-breadcrumb__list li:not(:first-child):before{content:"›";margin-right:.25rem;color:#666}
.fr-breadcrumb__link{color:#000091;text-decoration:underline}
.fr-breadcrumb__list li:last-child .fr-breadcrumb__link{color:#161616;text-decoration:none}
`,
  'tabs': `.fr-tabs{border:1px solid #ddd;border-radius:.25rem .25rem 0 0}
.fr-tabs__list{list-style:none;margin:0;padding:.5rem .5rem 0;display:flex;gap:.25rem;box-shadow:inset 0 -1px 0 #ddd}
.fr-tabs__tab{font:inherit;color:#000091;background:none;border:0;padding:.5rem 1rem;cursor:pointer;text-decoration:underline;border-radius:.25rem .25rem 0 0}
.fr-tabs__tab[aria-selected=true]{background:#fff;box-shadow:inset 0 2px 0 #000091,inset 0 -1px 0 #fff;font-weight:700;text-decoration:none}
.fr-tabs__panel{padding:1rem}
.fr-tabs__panel--hidden{display:none}
`,
  'pagination': `.fr-pagination__list{list-style:none;margin:1rem 0;padding:0;display:flex;flex-wrap:wrap;gap:.25rem}
.fr-pagination__link{display:inline-block;padding:.25rem .5rem;color:#000091;text-decoration:underline;border:1px solid transparent}
.fr-pagination__link[aria-current=page]{background:#000091;color:#fff;text-decoration:none;font-weight:700}
.fr-pagination__link--first,.fr-pagination__link--prev,.fr-pagination__link--next,.fr-pagination__link--last{color:#000091}
`,
  'skiplinks': `.fr-skiplinks{position:absolute;top:0;left:0;right:0;z-index:10}
.fr-skiplinks__list{list-style:none;margin:0;padding:0;display:none}
.fr-skiplinks:focus-within .fr-skiplinks__list{display:flex;gap:.5rem;padding:.5rem;background:#fff}
.fr-skiplinks .fr-link{color:#000091;text-decoration:underline}
`,
  'header': `.fr-header{background:#fff;border-bottom:1px solid #ddd;margin:-2rem -2rem 2rem;padding:0}
.fr-header__body-row{display:flex;align-items:center;gap:1.5rem;padding:.5rem 1rem;max-width:78rem;margin:0 auto}
.fr-logo{font-size:.9rem;font-weight:700;line-height:1.1;margin:0;color:#161616}
.fr-header__service{border-left:1px solid #ddd;padding-left:1.5rem}
.fr-header__service-title{margin:0;font-weight:700}
.fr-header__service-tagline{margin:0;font-size:.75rem;color:#666}
`,
  'footer': `.fr-footer{background:#f6f6f6;margin:3rem -2rem -2rem;padding:1.5rem;border-top:1px solid #ddd}
.fr-footer .fr-container{max-width:78rem;margin:0 auto;padding:0 1rem}
.fr-footer__body{display:flex;gap:2rem;margin-bottom:1rem}
.fr-logo{font-size:.9rem;font-weight:700;line-height:1.1;margin:0}
.fr-footer__content-desc{font-size:.75rem;color:#666;margin:0}
.fr-footer__bottom-list{list-style:none;margin:0 0 .5rem;padding:0;display:flex;flex-wrap:wrap;gap:1rem}
.fr-footer__bottom-link{color:#666;font-size:.75rem;text-decoration:underline}
.fr-footer__bottom-copy p{font-size:.75rem;color:#666;margin:0}
`,
  'alert': `.fr-alert{padding:1rem 1.5rem 1rem 3rem;margin-bottom:1rem;background:#e8edff;position:relative}
.fr-alert:before{content:"ⓘ";position:absolute;left:1rem;top:1rem;color:#000091}
.fr-alert--success{background:#b8fec9}.fr-alert--success:before{content:"✓";color:#18753c}
.fr-alert--error{background:#ffe9e9}.fr-alert--error:before{content:"✕";color:#ce0500}
.fr-alert--warning{background:#ffe9e6}.fr-alert--warning:before{content:"⚠";color:#b34000}
.fr-alert__title{font-size:1.125rem;font-weight:700;margin:0 0 .25rem}
.fr-alert p{margin:0}
`,
  'badge': `.fr-badge{display:inline-block;padding:.125rem .5rem;font-size:.75rem;font-weight:700;background:#e8edff;color:#000091;border-radius:1rem;margin:0 .25rem .25rem 0}
.fr-badge--success{background:#b8fec9;color:#18753c}
.fr-badge--error{background:#ffe9e9;color:#ce0500}
.fr-badge--warning{background:#ffe9e6;color:#b34000}
.fr-badge--info{background:#e8edff;color:#000091}
.fr-badge--new{background:#8eb5eb;color:#000091}
`,
  'callout': `.fr-callout{padding:1.5rem;margin:1rem 0;background:#e8edff;border-left:4px solid #000091}
.fr-callout__title{font-size:1.375rem;font-weight:700;margin:0 0 .5rem}
`,
  'highlight': `.fr-highlight{border-left:4px solid #000091;padding-left:1rem;margin:1rem 0}
`,
  'notice': `.fr-notice{background:#e8edff;padding:1rem;margin:-2rem -2rem 2rem}
.fr-notice__title{margin:0;font-weight:500}
`,
  'table': `.fr-table table{width:100%;border-collapse:collapse;margin:1rem 0}
.fr-table caption{font-weight:700;text-align:left;margin-bottom:.5rem}
.fr-table th{text-align:left;font-weight:700;padding:.5rem .75rem;background:#f6f6f6;border-bottom:2px solid #161616}
.fr-table td{padding:.5rem .75rem;border-bottom:1px solid #ddd}
`,
  'card': `.fr-card{border:1px solid #ddd;border-radius:.25rem;overflow:hidden;max-width:24rem;background:#fff}
.fr-card__body{padding:1rem}
.fr-card__title{font-size:1.125rem;margin:0 0 .5rem}
.fr-card__link{color:#000091;text-decoration:underline;font-weight:500}
.fr-card__desc{margin:0;font-size:.875rem;color:#666}
`,
  'tag': `.fr-tags-group{list-style:none;margin:1rem 0;padding:0;display:flex;flex-wrap:wrap;gap:.5rem}
.fr-tag{display:inline-block;padding:.25rem .75rem;border-radius:1rem;background:#e8edff;color:#000091;font-size:.875rem;text-decoration:none;border:0}
a.fr-tag,button.fr-tag{cursor:pointer}
button.fr-tag[aria-pressed=true]{background:#000091;color:#fff}
`,
  'download': `.fr-download{margin:1rem 0}
.fr-download__link{display:inline-block;padding:.5rem 0;color:#000091;text-decoration:underline}
.fr-download__name{font-weight:500}
.fr-download__meta{display:block;font-size:.75rem;color:#666}
`,
  'summary': `.fr-summary{background:#f6f6f6;padding:1rem 1.5rem;max-width:24rem}
.fr-summary__title{font-weight:700;margin:0 0 .5rem;font-size:.875rem}
.fr-summary__list{list-style:none;margin:0;padding:0}
.fr-summary__list li{border-top:1px solid #ddd;padding:.25rem 0;font-size:.875rem}
.fr-summary__list li:first-child{border-top:0}
`
};


// ─── Cost model (same calibration as the USWDS registry) ────────────────────

function costDefaults(bytes, requiresJs) {
  const estimatedTokens = Math.ceil(bytes / 4);
  let costTier;
  if (requiresJs === 'required') costTier = estimatedTokens > 2000 ? 'expensive' : 'moderate';
  else if (requiresJs === 'optional') costTier = 'moderate';
  else costTier = estimatedTokens > 1000 ? 'moderate' : 'cheap';
  const renderingTimeMs = requiresJs === 'required' ? 60 : requiresJs === 'optional' ? 35 : 15;
  const recommendedModel = costTier === 'expensive' ? 'sonnet' : 'haiku';
  return { costTier, estimatedTokens, renderingTimeMs, recommendedModel };
}

// ─── Recipe membership ───────────────────────────────────────────────────────

const recipeMembership = {};
try {
  const recipesDir = join(TILE_DIR, 'recipes');
  for (const item of readdirSync(recipesDir)) {
    if (!item.endsWith('.json') || item === 'index.json') continue;
    const recipe = JSON.parse(readFileSync(join(recipesDir, item), 'utf-8'));
    for (const c of recipe.components || []) {
      (recipeMembership[c.component] ||= []).push(recipe.recipe);
    }
  }
} catch {
  console.log('(no recipes yet — compositionRecipes skipped)');
}

// ─── Meta assembly ───────────────────────────────────────────────────────────

function buildMeta(component, variant, relPath, html) {
  const bytes = Buffer.byteLength(html, 'utf-8');
  const cost = costDefaults(bytes, component.requiresJs);
  const requiresJs = component.requiresJs;
  const isInteractive = (component.interaction || []).length > 0;

  const coord = {
    prerequisiteComponents: component.prerequisites || [],
    incompatibleWith: component.incompatibleWith || [],
    compositionCost: cost,
  };
  if (component.agentPromptSequence) coord.agentPromptSequence = component.agentPromptSequence;
  const memberOf = [...new Set(recipeMembership[component.dir] || [])];
  if (memberOf.length) coord.compositionRecipes = memberOf;

  const meta = {
    _schemaVersion: 2,
    discovery: {
      dsfrComponentType: component.dir,
      frClass: component.cls,
      section: component.section,
      variant: variant,
      requiresJs,
      interaction: component.interaction || [],
      a11y: {
        wcag21AA: true,
        keyboardNav: isInteractive,
        screenReader: true,
        reducedMotion: true,
        forcedColors: true,
        ariaAttributes: true,
      },
      govCompliance: COMPLIANCE,
      tier: 'curated',
      tags: component.tags,
      description: component.description,
      compliance: {
        nistControls: [],
        rgaa: true,
        wcag21AA: true,
        webAccessibilityDirective: true,
        piiHandling: component.pii || 'none',
        auditTrailCompatible: component.audit || false,
        dataMaskingCompatible: component.dir === 'text-input',
      },
      mobileUX: {
        touchTargetSize: isInteractive ? '44px' : 'n/a',
        requiredMinSpacing: '8px',
        orientationLocked: false,
        fullscreenSafe: true,
      },
    },
    selection: {
      useWhen: component.useWhen,
      avoidWhen: component.avoidWhen,
    },
    instruction: {
      agentPrompt: component.agentPrompt,
      relatedComponents: component.related || [],
    },
    coordination: coord,
    constraints: {
      preserve: component.preserve,
      editable: component.editable,
      limitations: component.limitations,
      portableInvariants: component.invariants,
    },
    supportedTokenProfiles: ['highContrast'],
    file: relPath,
    title: `${component.name} (${variant})`,
  };

  if (component.classMappingUswds) {
    meta.portability = {
      classMapping: { uswds: component.classMappingUswds },
    };
  }
  return meta;
}

// ─── Tile rendering ──────────────────────────────────────────────────────────

function renderTile(component, variant, relPath, markup) {
  const meta = buildMeta(component, variant.variant, relPath, markup);
  const description = `Système de Design de l'État ${component.name.toLowerCase()} demonstrating the ${variant.variant} variant.`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${component.name} (${variant.variant})</title>
<script type="application/json" id="dsfr-agent-meta">
${JSON.stringify(meta, null, 2)}
</script>
<style>${BASE_CSS}
${CSS[component.dir] || ''}
</style>
</head>
<body>
${markup}
<div class="cap">${component.dir} ${variant.variant}</div>
</body>
</html>
`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

let written = 0;
for (const component of inventory) {
  const variants = component.variants || [
    { file: 'default', variant: 'default', desc: component.description, markup: component.defaultMarkup },
  ];
  const dir = join(TILE_DIR, component.dir);
  mkdirSync(dir, { recursive: true });
  for (const variant of variants) {
    const markup = variant.markup ?? component.defaultMarkup;
    if (!markup) {
      console.error(`  ✗ ${component.dir}/${variant.file}: no markup`);
      continue;
    }
    const relPath = `${component.dir}/${variant.file}.html`;
    const outPath = join(TILE_DIR, relPath);
    if (!FORCE && existsSync(outPath)) continue; // hand-edited tiles survive re-runs
    writeFileSync(outPath, renderTile(component, variant, relPath, markup));
    written++;
    console.log(`  ✓ ${relPath}`);
  }
}
console.log(`\nWrote ${written} tiles (${inventory.length} components)`);
