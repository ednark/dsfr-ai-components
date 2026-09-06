# DSFR AI Components

Registre de composants IA pour le [Système de Design de l'État (DSFR)](https://www.systeme-de-design.gouv.fr) — 39 tuiles auto-contenues across 27 component families, for AI coding agents building French state services.

Implements the [ai-component-registry-spec](https://github.com/ednark/ai-component-registry-spec) protocol (submodule at `_base/`). Sibling to [uswds-ai-components](https://github.com/ednark/uswds-ai-components) and [govuk-ai-components](https://github.com/ednark/govuk-ai-components).

## Quick start (agents)

1. [agents.json](https://raw.githubusercontent.com/ednark/dsfr-ai-components/main/agents.json) — manifest
2. [components.index.json](https://raw.githubusercontent.com/ednark/dsfr-ai-components/main/infinite/components.index.json) — lean discovery index, filter in code
3. `infinite/{file}` — tile: source + embedded `dsfr-agent-meta`
4. [recipes](https://raw.githubusercontent.com/ednark/dsfr-ai-components/main/infinite/recipes/index.json) — DSFR patterns as atomic fetches

MCP: `npm run mcp` (9 tools). Validate: `node _base/validate-registry.mjs`.

## Coverage

**Forms:** button, input, textarea, select, checkbox, radio, toggle, stepper, upload, search
**Navigation:** breadcrumb, tabs, pagination, skiplinks, header, footer
**Feedback:** alert, badge, callout, highlight, notice
**Data display:** table, card, tag, download, summary (sommaire)

Recipes: formulaire-contact, confirmation-page, search-results, multi-step-form, content-page.

## Compliance metadata

All tiles carry `govCompliance: ["RGAA 4.1", "WCAG 2.1 AA", "Directive (UE) 2016/2102"]` plus per-tile `compliance` facts (PII handling, audit-trail) and `mobileUX` facts. DSFR-specific: no global error summary (per-field `fr-error-text`), official dark mode via `data-fr-theme` (registered as a `darkMode` token profile), FedRAMP fields intentionally omitted.

## Notes

- Metadata in English; `fr-*` class names authoritative; markup labels in French
- Tiles are original inline-CSS approximations, not copies of DSFR source
- The Marianne identity block is reserved for French state services (DSFR agréments process) — see the header/footer tiles
