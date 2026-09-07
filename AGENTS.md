# AGENTS.md — DSFR AI Components

## What This Is

A structured component knowledge base for AI coding agents building French state services with the Système de Design de l'État (DSFR). 39 component tiles across 27 component families, with categorized adaptation metadata (schema v2), coordination metadata, pattern recipes, and compliance facts (RGAA 4.1 / WCAG 2.1 AA / Directive (UE) 2016/2102).

Metadata is written in English for agent consistency; French class names (`fr-*`) are the authoritative identifiers, and tile markup labels are in French.

## How to Query This Registry

1. **Manifest:** https://raw.githubusercontent.com/ednark/dsfr-ai-components/main/agents.json
2. **Index:** https://raw.githubusercontent.com/ednark/dsfr-ai-components/main/infinite/components.index.json
3. **Facets:** https://raw.githubusercontent.com/ednark/dsfr-ai-components/main/infinite/facets.json
4. **Tile pattern:** https://raw.githubusercontent.com/ednark/dsfr-ai-components/main/infinite/{file}

## Workflow

1. Fetch the index (lean — discovery facets + lean summaries only)
2. Filter in code by section, dsfrComponentType, requiresJs, a11y, govCompliance, costTier, compositionRecipes
3. **Recipe check:** published patterns (formulaire-contact, confirmation-page, search-results, multi-step-form, content-page) — fetch `infinite/recipes/{name}.json` first
4. Fetch only the chosen tiles
5. Parse the `dsfr-agent-meta` JSON block inside each tile
6. Check `_schemaVersion` — v2 categories:
   - `discovery` — facets (index already carries them; compliance/mobileUX blocks are tile-side)
   - `selection` — `useWhen` / `avoidWhen`
   - `instruction` — `agentPrompt`
   - `coordination` — `compositionCost`, `agentPromptSequence`, `compositionRecipes` (DSFR controls embed their `fr-*-group` wrappers, so there is no external form-group prerequisite — unlike the GOV.UK registry)
   - `constraints` — `preserve` / `editable` / `limitations` / `portableInvariants`
   - `portability` — `classMapping` for uswds + govuk class substitution
7. Adapt within `constraints`; verify `constraints.preserve` in output

## DSFR-Specific Rules

- Error handling is **per field**: `fr-error-text` sibling + `fr-*-group--error` on the group — the DSFR has **no global error-summary component** (unlike GOV.UK/USWDS); do not invent one
- Valid state: `fr-input-group--valid` + `fr-valid-text`
- DSFR ships official light/dark themes (`data-fr-theme`) — `supportedTokenProfiles` includes darkMode on registry level
- Use RGAA 4.1 (built on WCAG 2.1 AA) — check `govCompliance`
- The Marianne identity block is reserved for French state services (agréments process)
- Icon classes (`fr-icon-*`) are DSFR-provided; never inline-icon the fr-btn

## Cross-Registry Transfer

- `portability.classMapping` covers uswds + govuk for simple cases (button, input, select, alert, table, breadcrumb, tag)
- `compatibility.json` holds family-level maps for both targets with mismatch notes (structural entries are advisory only)
- Validate output against `constraints.portableInvariants`

## MCP Server

`node _base/mcp/server.mjs` (or `npm run mcp`) — 9 tools: `search_components`, `get_component`, `list_facets`, `get_index`, `get_adapter`, `translate_component`, `get_recipe`, `query_compliance`, `get_versions`

CLI: `node _base/validate-registry.mjs` (lint), `--conformance .` (certification)


## Quality gates and declared gaps

Do not retrieve or deploy a component that:

- Has `costTier: "expensive"` unless the task explicitly requires the richer behavior
- Has `requiresJs: "required"` when the delivery context has no JavaScript
- Whose `constraints.knownLimitations` block the delivery context
- Implements a concept declared in `gaps` (registry.config.json) — use the gap's nearestAlternative; never invent component-style classes
- Needs layout or typography classes outside the tiles — use `infinite/core-classes.json`

Registry mandates that act as gates:

- Content labels are French; metadata is English — keep that split
- Errors are per-field (fr-error-text); there is no page-level error summary — do not invent one
- Check `govCompliance` (RGAA 4.1 / WCAG 2.1 AA / Directive (UE) 2016/2102)

## Constraint Priority

1. `constraints.preserve` — NEVER modify
2. `constraints.limitations` — respect
3. `instruction.agentPrompt` — adapt within boundaries
4. `constraints.editable` — prefer
