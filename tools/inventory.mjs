/**
 * DSFR AI Components — component inventory.
 *
 * Each component declares its variants (real DSFR `fr-` markup), metadata for
 * the v2 categorized schema, coordination, and compliance facts. The builder
 * (build-registry.mjs) turns this into self-contained tiles.
 *
 * Note: component metadata is written in English for agent consistency;
 * French class names (`fr-*`) are the authoritative identifiers and markup
 * labels are in French, as in the DSFR documentation.
 */

export const COMPLIANCE = ["RGAA 4.1", "WCAG 2.1 AA", "Directive (UE) 2016/2102"];

export const inventory = [
  // ─── FORMS ────────────────────────────────────────────────────────────────
  {
    dir: "button",
    name: "Button",
    frName: "Bouton",
    cls: "fr-btn",
    section: "forms",
    requiresJs: "no",
    interaction: ["click", "focus", "keyboard"],
    pii: "none",
    audit: false,
    useWhen: [
      "Primary action of a page (Valider, Continuer)",
      "Secondary/tertiary actions via fr-btn--secondary and fr-btn--tertiary"
    ],
    avoidWhen: ["Links between pages — use fr-link", "Too many buttons per view — one primary action"],
    agentPrompt: "Edit the label. Use fr-btn--secondary for secondary actions, fr-btn--tertiary for tertiary, fr-btn--icon-left/right with fr-icon-* classes for icons. Disabled: add fr-btn--disabled with disabled + aria-disabled.",
    preserve: [
      ".fr-btn class on a <button> element for form submission",
      "type='submit' inside forms",
      "fr-btn--disabled + disabled + aria-disabled for disabled state"
    ],
    editable: ["Label text", "Variant class (secondary, tertiary, icon placement)", "Icon class (fr-icon-*)"],
    limitations: ["One primary button per view", "Icon-only buttons require an accessible label"],
    invariants: ["Semantic <button> or <a> root element", "Accessible name preserved"],
    related: ["input", "error-summary-none-dsfr-uses-inline-errors"],
    classMappingUswds: { base: "usa-button", secondary: "usa-button usa-button--secondary", disabled: "usa-button" },
    classMappingGovuk: { base: "govuk-button", secondary: "govuk-button govuk-button--secondary", disabled: "govuk-button govuk-button--disabled" },
    tags: ["button", "bouton", "submit", "action", "cta"],
    description: "Primary, secondary, tertiary, and icon buttons (fr-btn).",
    variants: [
      {
        file: "default", variant: "primary",
        desc: "Primary button.",
        markup: `<button class="fr-btn" type="submit">Valider</button>`
      },
      {
        file: "secondary", variant: "secondary",
        desc: "Secondary button.",
        markup: `<button class="fr-btn fr-btn--secondary" type="button">Action secondaire</button>`
      },
      {
        file: "tertiary", variant: "tertiary",
        desc: "Tertiary button with outline.",
        markup: `<button class="fr-btn fr-btn--tertiary" type="button">Action tertiaire</button>`
      },
      {
        file: "icon-left", variant: "icon-left",
        desc: "Button with left icon.",
        markup: `<button class="fr-btn fr-icon-arrow-right-line fr-btn--icon-left" type="button">Continuer</button>`
      },
      {
        file: "disabled", variant: "disabled",
        desc: "Disabled button.",
        markup: `<button class="fr-btn fr-btn--disabled" type="button" disabled aria-disabled="true">Envoyer</button>`
      }
    ]
  },
  {
    dir: "input",
    name: "Text input",
    frName: "Champ de saisie",
    cls: "fr-input",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus"],
    pii: "accepts_input",
    audit: true,
    useWhen: [
      "Short free-text answers (nom, référence, adresse électronique)"
    ],
    avoidWhen: [
      "Longer answers — use textarea",
      "Dates with three fields — DSFR handles dates via native inputs with fr-input markup"
    ],
    agentPrompt: "Edit the label. Error state: fr-input-group--error on the group + fr-error-text paragraph (no aria-invalid needed — DSFR links via fr-error-text). Valid state: fr-input-group--valid + fr-valid-text.",
    preserve: [
      ".fr-input class on the input element",
      ".fr-input-group wrapper",
      "fr-label 'for' attribute matching the input id",
      "fr-error-text / fr-valid-text siblings for state messaging"
    ],
    editable: ["Label text", "Hint text (fr-hint-text)", "type attribute (text, email, tel)"],
    limitations: ["Do not use placeholder as a label substitute"],
    invariants: ["Semantic <input> element", "Label association via for/id"],
    related: ["button", "alert"],
    classMappingUswds: { base: "usa-input", error: "usa-input usa-input--error" },
    classMappingGovuk: { base: "govuk-input", error: "govuk-input govuk-input--error" },
    tags: ["input", "champ", "text", "form", "field"],
    description: "Text input with label, hint, error, and valid states (fr-input).",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Text input with label and hint.",
        markup: `<div class="fr-input-group">
  <label class="fr-label" for="text-input-example">
    Adresse électronique
    <span class="fr-hint-text">Format attendu : nom@domaine.fr</span>
  </label>
  <input class="fr-input" type="text" id="text-input-example" name="email" autocomplete="email">
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Text input in the error state.",
        markup: `<div class="fr-input-group fr-input-group--error">
  <label class="fr-label" for="text-input-error">
    Adresse électronique
  </label>
  <input class="fr-input" type="text" id="text-input-error" name="email" value="" aria-describedby="text-input-error-desc-error">
  <p id="text-input-error-desc-error" class="fr-error-text">
    Le format de l'adresse électronique est incorrect.
  </p>
</div>`
      },
      {
        file: "valid", variant: "valid",
        desc: "Text input in the valid state.",
        markup: `<div class="fr-input-group fr-input-group--valid">
  <label class="fr-label" for="text-input-valid">
    Adresse électronique
  </label>
  <input class="fr-input" type="text" id="text-input-valid" name="email" value="marie.dupont@gouv.fr" aria-describedby="text-input-valid-desc-valid">
  <p id="text-input-valid-desc-valid" class="fr-valid-text">
    Adresse électronique valide.
  </p>
</div>`
      }
    ]
  },
  {
    dir: "textarea",
    name: "Textarea",
    frName: "Zone de texte",
    cls: "fr-input",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Longer free-text answers (description, message, motif)"],
    avoidWhen: ["Single-line values — use input"],
    agentPrompt: "Adjust the rows attribute for height. Error state follows the same fr-input-group--error + fr-error-text pattern as inputs.",
    preserve: [".fr-input class on the textarea", ".fr-input-group wrapper", "fr-label 'for' association"],
    editable: ["Label text", "rows attribute"],
    limitations: ["Fixed height by rows"],
    invariants: ["Semantic <textarea> element", "Label association via for/id"],
    related: ["input", "button"],
    classMappingUswds: { base: "usa-textarea" },
    classMappingGovuk: { base: "govuk-textarea" },
    tags: ["textarea", "zone", "multiline", "form"],
    description: "Multi-line text input with label and error support (fr-textarea).",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Textarea with label.",
        markup: `<div class="fr-input-group">
  <label class="fr-label" for="textarea-example">
    Votre message
    <span class="fr-hint-text">Décrivez votre demande en quelques lignes.</span>
  </label>
  <textarea class="fr-input" id="textarea-example" name="message" rows="5"></textarea>
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Textarea in the error state.",
        markup: `<div class="fr-input-group fr-input-group--error">
  <label class="fr-label" for="textarea-error">
    Votre message
  </label>
  <textarea class="fr-input" id="textarea-error" name="message" rows="5" aria-describedby="textarea-error-desc-error"></textarea>
  <p id="textarea-error-desc-error" class="fr-error-text">
    Vous devez renseigner votre message.
  </p>
</div>`
      }
    ]
  },
  {
    dir: "select",
    name: "Select",
    frName: "Liste déroulante",
    cls: "fr-select",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "change"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Choosing one option from a short list"],
    avoidWhen: ["Long option lists — reconsider the question", "Multiple selections — use checkboxes"],
    agentPrompt: "Replace <option> values and text. Error state: fr-select-group--error + fr-error-text. Keep the first placeholder option ('Sélectionner une option').",
    preserve: [".fr-select class on the <select>", ".fr-select-group wrapper", "fr-label 'for' association"],
    editable: ["Label text", "Option list"],
    limitations: ["Native select — appearance varies by platform"],
    invariants: ["Semantic <select> with <option> children"],
    related: ["checkbox", "button"],
    classMappingUswds: { base: "usa-select" },
    classMappingGovuk: { base: "govuk-select" },
    tags: ["select", "liste", "dropdown", "form"],
    description: "Dropdown select with label and error support (fr-select).",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Select with label.",
        markup: `<div class="fr-select-group">
  <label class="fr-label" for="select-example">
    Votre région
  </label>
  <select class="fr-select" id="select-example" name="region">
    <option value="" selected disabled hidden>Sélectionner une option</option>
    <option value="idf">Île-de-France</option>
    <option value="bretagne">Bretagne</option>
    <option value="occitanie">Occitanie</option>
  </select>
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Select in the error state.",
        markup: `<div class="fr-select-group fr-select-group--error">
  <label class="fr-label" for="select-error">
    Votre région
  </label>
  <select class="fr-select" id="select-error" name="region" aria-describedby="select-error-desc-error">
    <option value="" selected disabled hidden>Sélectionner une option</option>
    <option value="idf">Île-de-France</option>
  </select>
  <p id="select-error-desc-error" class="fr-error-text">
    Vous devez sélectionner votre région.
  </p>
</div>`
      }
    ]
  },
  {
    dir: "checkbox",
    name: "Checkbox",
    frName: "Case à cocher",
    cls: "fr-checkbox-group",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Multiple selections from a set", "Single consent checkbox"],
    avoidWhen: ["Exactly one choice — use radio"],
    agentPrompt: "Edit labels and values. Group errors: fr-fieldset--error on the fieldset + fr-error-text. Individual hint text nests inside fr-label.",
    preserve: [
      "fieldset + fr-fieldset__legend structure for groups",
      "input/label pairing via for/id",
      "fr-fieldset__element wrapper per option"
    ],
    editable: ["Legend text", "Option labels and values"],
    limitations: ["Do not pre-check consent boxes"],
    invariants: ["fieldset/legend for groups", "Real <input type='checkbox'> elements"],
    related: ["radio", "button"],
    classMappingUswds: { base: "usa-checkbox__input", label: "usa-checkbox__label" },
    classMappingGovuk: { base: "govuk-checkboxes__input", label: "govuk-label govuk-checkboxes__label" },
    tags: ["checkbox", "case", "multiple", "form"],
    description: "Checkbox group with fieldset, legend, and error support.",
    defaultMarkup: `<div class="fr-checkbox-group fr-fieldset">
  <fieldset class="fr-fieldset" aria-labelledby="cb-legend cb-messages">
    <legend class="fr-fieldset__legend fr-text--regular" id="cb-legend">
      Quels sont les modes de transport que vous utilisez ?
    </legend>
    <div class="fr-fieldset__element">
      <input type="checkbox" id="cb-transport-1" name="transport-1">
      <label class="fr-label" for="cb-transport-1">Voiture</label>
    </div>
    <div class="fr-fieldset__element">
      <input type="checkbox" id="cb-transport-2" name="transport-2">
      <label class="fr-label" for="cb-transport-2">Transports en commun</label>
    </div>
    <div class="fr-fieldset__element">
      <input type="checkbox" id="cb-transport-3" name="transport-3">
      <label class="fr-label" for="cb-transport-3">Vélo</label>
    </div>
  </fieldset>
</div>`,
  },
  {
    dir: "radio",
    name: "Radio",
    frName: "Bouton radio",
    cls: "fr-radio-group",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Exactly one choice from a small set", "fr-radio-rich adds image/description per option"],
    avoidWhen: ["Multiple selections — use checkbox"],
    agentPrompt: "Edit labels and values. fr-radio-rich wraps options with fr-radio-rich__pictogram for illustrated choices. Group errors: fr-fieldset--error + fr-error-text.",
    preserve: [
      "fieldset + legend structure",
      "Same name attribute on all radios",
      "fr-radio-group / fr-radio-rich wrappers"
    ],
    editable: ["Legend text", "Option labels, values, pictograms"],
    limitations: ["fr-radio-rich pictograms need a light background"],
    invariants: ["fieldset/legend for the group", "Real <input type='radio'> elements"],
    related: ["checkbox", "button"],
    classMappingUswds: { base: "usa-radio__input", label: "usa-radio__label" },
    classMappingGovuk: { base: "govuk-radios__input", label: "govuk-label govuk-radios__label" },
    tags: ["radio", "single-choice", "form", "rich"],
    description: "Radio group with standard and rich (illustrated) variants.",
    defaultMarkup: `<div class="fr-radio-group">
  <fieldset class="fr-fieldset" aria-labelledby="rd-legend">
    <legend class="fr-fieldset__legend fr-text--regular" id="rd-legend">
      Êtes-vous inscrit sur les listes électorales ?
    </legend>
    <div class="fr-fieldset__element">
      <input type="radio" id="rd-yes" name="inscrit">
      <label class="fr-label" for="rd-yes">Oui</label>
    </div>
    <div class="fr-fieldset__element">
      <input type="radio" id="rd-no" name="inscrit">
      <label class="fr-label" for="rd-no">Non</label>
    </div>
  </fieldset>
</div>`,
  },
  {
    dir: "toggle",
    name: "Toggle switch",
    frName: "Interrupteur",
    cls: "fr-toggle",
    section: "forms",
    requiresJs: "no",
    interaction: ["click", "focus", "keyboard"],
    pii: "none",
    audit: false,
    useWhen: ["Instant on/off settings that apply immediately", "fr-toggle--label-left for settings lists"],
    avoidWhen: ["Actions requiring a separate submit — use checkbox + button", "Three-state choices"],
    agentPrompt: "Edit the label. data-fr-checked-label / data-fr-unchecked-label add state text. fr-toggle--bordered for bordered style.",
    preserve: [
      ".fr-toggle__input on the checkbox",
      "fr-toggle__label with for/id association",
      "data-fr-checked-label / data-fr-unchecked-label attributes when used"
    ],
    editable: ["Label text", "State labels", "Bordered modifier"],
    limitations: ["Never use for destructive actions without confirmation"],
    invariants: ["Real <input type='checkbox'> behind the switch"],
    related: ["checkbox"],
    classMappingUswds: { base: "usa-checkbox__input" },
    tags: ["toggle", "interrupteur", "switch", "settings"],
    description: "On/off toggle switch with optional state labels.",
    defaultMarkup: `<div class="fr-toggle">
  <input type="checkbox" class="fr-toggle__input" id="toggle-example" aria-describedby="toggle-example-hint">
  <label class="fr-toggle__label" for="toggle-example" data-fr-checked-label="Activé" data-fr-unchecked-label="Désactivé">
    Notifications par courriel
  </label>
  <p class="fr-hint-text" id="toggle-example-hint">Vous pouvez modifier ce choix à tout moment.</p>
</div>`,
  },
  {
    dir: "stepper",
    name: "Stepper",
    frName: "Indicateur d'étapes",
    cls: "fr-stepper",
    section: "forms",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Multi-step forms (title + 'Étape X sur Y' + progress bar)"],
    avoidWhen: ["Fewer than 3 steps — a simple title suffices"],
    agentPrompt: "Set data-fr-current-step and data-fr-steps on the steps div; edit the title and state text. Pair with back-link style navigation between steps.",
    preserve: [
      "data-fr-current-step / data-fr-steps attributes on .fr-stepper__steps",
      "h2 title with fr-stepper__state span"
    ],
    editable: ["Step title", "Current step and total"],
    limitations: ["Progress bar is CSS-driven from the data attributes"],
    invariants: ["Step count attributes remain in sync with the flow"],
    related: ["button", "input"],
    tags: ["stepper", "étapes", "progress", "multi-step"],
    description: "Multi-step progress indicator with title and step count.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Stepper at step 2 of 3.",
        markup: `<div class="fr-stepper">
  <h2 class="fr-stepper__title">
    Vos coordonnées
    <span class="fr-stepper__state">Étape 2 sur 3</span>
  </h2>
  <div class="fr-stepper__steps" data-fr-current-step="2" data-fr-steps="3"></div>
  <p class="fr-stepper__details">
    <span class="fr-text--bold">Étape suivante :</span> La vérification de votre dossier
  </p>
</div>`
      }
    ]
  },
  {
    dir: "upload",
    name: "File upload",
    frName: "Ajout de fichier",
    cls: "fr-upload",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Uploading documents (justificatifs, photos)"],
    avoidWhen: ["Users may not have the file ready — allow saving progress"],
    agentPrompt: "Edit the label. Error state: fr-upload-group--error + fr-error-text. State accepted formats and size limits in the hint.",
    preserve: [".fr-upload class on the input", ".fr-upload-group wrapper", "fr-label association"],
    editable: ["Label text", "Hint text", "accept attribute"],
    limitations: ["Native control — appearance varies by platform"],
    invariants: ["Semantic <input type='file'>", "Label association via for/id"],
    related: ["input"],
    classMappingUswds: { base: "usa-file-input" },
    classMappingGovuk: { base: "govuk-file-upload" },
    tags: ["file", "upload", "fichier", "form"],
    description: "File upload control with error state (fr-upload).",
    variants: [
      {
        file: "default", variant: "default",
        desc: "File upload with label and hint.",
        markup: `<div class="fr-upload-group">
  <label class="fr-label" for="upload-example">
    Ajouter un justificatif
    <span class="fr-hint-text">PDF, PNG ou JPG — 10 Mo maximum</span>
  </label>
  <input class="fr-upload" type="file" id="upload-example" name="justificatif" aria-describedby="upload-example-hint">
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "File upload in the error state.",
        markup: `<div class="fr-upload-group fr-upload-group--error">
  <label class="fr-label" for="upload-error">
    Ajouter un justificatif
  </label>
  <input class="fr-upload" type="file" id="upload-error" name="justificatif" aria-describedby="upload-error-desc-error">
  <p id="upload-error-desc-error" class="fr-error-text">
    Le fichier dépasse 10 Mo.
  </p>
</div>`
      }
    ]
  },
  {
    dir: "search",
    name: "Search bar",
    frName: "Barre de recherche",
    cls: "fr-search-bar",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus", "click"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Global or section-level content search"],
    avoidWhen: ["Filtering within a single page — use tags or links"],
    agentPrompt: "Set the form action. The visually-hidden label ('Rechercher') is mandatory. fr-search-bar--lg for hero placement.",
    preserve: [
      "form with role='search' behaviour via .fr-search-bar",
      "Visually-hidden label on the input",
      "fr-btn with search icon as submit"
    ],
    editable: ["Placeholder text", "Button label", "Size modifier"],
    limitations: ["The input needs an accessible name — keep the hidden label"],
    invariants: ["Input associated with a label", "Submit button inside the form"],
    related: ["table", "pagination"],
    classMappingUswds: { base: "usa-search" },
    classMappingGovuk: { base: "govuk-search" },
    tags: ["search", "recherche", "query"],
    description: "Search bar with hidden label and icon submit button.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Search bar.",
        markup: `<form class="fr-search-bar" role="search" action="#" method="get">
  <label class="fr-label" for="search-example">Recherche</label>
  <input class="fr-input" type="search" id="search-example" name="q" placeholder="Rechercher">
  <button class="fr-btn" title="Rechercher">Rechercher</button>
</form>`
      }
    ]
  },
  // ─── NAVIGATION ───────────────────────────────────────────────────────────
  {
    dir: "breadcrumb",
    name: "Breadcrumb",
    frName: "Fil d'Ariane",
    cls: "fr-breadcrumb",
    section: "navigation",
    requiresJs: "optional",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Sites deeper than two levels", "Collapses behind a 'Voir le fil d'Ariane' button on mobile (JS)"],
    avoidWhen: ["Top-level pages"],
    agentPrompt: "Edit the trail links. The last item uses aria-current='page' and is not a link. The mobile collapse needs the fr-breadcrumb__button + fr-collapse pair.",
    preserve: [
      "nav[role='navigation'] with aria-label",
      "ol list structure",
      "aria-current='page' on the last item"
    ],
    editable: ["Trail links"],
    limitations: ["Mobile collapse requires the DSFR collapse JS"],
    invariants: ["Breadcrumb navigation landmark labelled"],
    related: ["header", "footer"],
    classMappingUswds: { base: "usa-breadcrumb" },
    classMappingGovuk: { base: "govuk-breadcrumbs" },
    tags: ["breadcrumb", "fil", "ariane", "navigation", "hierarchy"],
    description: "Breadcrumb trail (fil d'Ariane) with mobile collapse.",
    defaultMarkup: `<nav role="navigation" class="fr-breadcrumb" aria-label="vous êtes ici :">
  <button class="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-1">Voir le fil d'Ariane</button>
  <div class="fr-collapse" id="breadcrumb-1">
    <ol class="fr-breadcrumb__list">
      <li>
        <a class="fr-breadcrumb__link" href="#">Accueil</a>
      </li>
      <li>
        <a class="fr-breadcrumb__link" href="#">Démarches</a>
      </li>
      <li>
        <a class="fr-breadcrumb__link" aria-current="page">Ma demande</a>
      </li>
    </ol>
  </div>
</nav>`,
  },
  {
    dir: "tabs",
    name: "Tabs",
    frName: "Onglets",
    cls: "fr-tabs",
    section: "navigation",
    requiresJs: "required",
    interaction: ["click", "focus", "keyboard"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Switching between related views of the same data"],
    avoidWhen: ["Splitting one continuous topic", "Content that must be printable in full"],
    agentPrompt: "Edit tab titles and panel content. The role='tablist'/'tab'/'tabpanel' wiring and keyboard navigation are JS-managed — keep ids and aria attributes paired.",
    preserve: [
      "role='tablist' / role='tab' / role='tabpanel' structure",
      "fr-tabs__panel--selected state class",
      "aria-selected + aria-controls pairing"
    ],
    editable: ["Tab titles", "Panel content"],
    limitations: ["All panels exist in the DOM — hidden ones stay accessible to screen readers via JS state only", "Keyboard arrows are JS-provided"],
    invariants: ["tab/tabpanel ARIA relationships intact"],
    related: ["accordion"],
    tags: ["tabs", "onglets", "content", "views"],
    description: "Tabbed content panels with full ARIA wiring (fr-tabs).",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Two-panel tab component.",
        markup: `<div class="fr-tabs">
  <ul class="fr-tabs__list" role="tablist" aria-label="Sections">
    <li role="presentation"><button id="tabpanel-1" class="fr-tabs__tab" aria-selected="true" role="tab" aria-controls="tabpanel-1-panel">Section 1</button></li>
    <li role="presentation"><button id="tabpanel-2" class="fr-tabs__tab" aria-selected="false" role="tab" aria-controls="tabpanel-2-panel" tabindex="-1">Section 2</button></li>
  </ul>
  <div class="fr-tabs__panel fr-tabs__panel--selected" role="tabpanel" id="tabpanel-1-panel" aria-labelledby="tabpanel-1" tabindex="0">
    <p class="fr-text--lg">Contenu de la première section.</p>
  </div>
  <div class="fr-tabs__panel" role="tabpanel" id="tabpanel-2-panel" aria-labelledby="tabpanel-2" tabindex="0">
    <p class="fr-text--lg">Contenu de la deuxième section.</p>
  </div>
</div>`
      }
    ]
  },
  {
    dir: "pagination",
    name: "Pagination",
    frName: "Pagination",
    cls: "fr-pagination",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Paginated result lists", "Sequential content pages"],
    avoidWhen: ["Question flows — use buttons instead"],
    agentPrompt: "Edit page links. aria-current='page' on the active page. First/last/prev/next need their modifier classes and accessible labels.",
    preserve: [
      "nav[role='navigation'] with aria-label='Pagination'",
      "aria-current='page' on the active page",
      "Modifier classes on first/prev/next/last links"
    ],
    editable: ["Page numbers", "hrefs", "First/last labels"],
    limitations: ["Keep total page count honest — no dead links"],
    invariants: ["Pagination landmark labelled"],
    related: ["table", "search"],
    tags: ["pagination", "pages", "results"],
    description: "Numbered pagination with first/prev/next/last controls.",
    defaultMarkup: `<nav role="navigation" class="fr-pagination" aria-label="Pagination">
  <ul class="fr-pagination__list">
    <li>
      <a class="fr-pagination__link fr-pagination__link--first" href="#" title="Première page">
        Première page
      </a>
    </li>
    <li>
      <a class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label" href="#" title="Page précédente">
        Page précédente
      </a>
    </li>
    <li>
      <a class="fr-pagination__link" aria-current="page" href="#" title="Page 1">1</a>
    </li>
    <li>
      <a class="fr-pagination__link" href="#" title="Page 2">2</a>
    </li>
    <li>
      <a class="fr-pagination__link" href="#" title="Page 3">3</a>
    </li>
    <li>
      <a class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label" href="#" title="Page suivante">
        Page suivante
      </a>
    </li>
  </ul>
</nav>`,
  },
  {
    dir: "skiplinks",
    name: "Skip links",
    frName: "Liens d'évitement",
    cls: "fr-skiplinks",
    section: "navigation",
    requiresJs: "optional",
    interaction: ["focus", "keyboard"],
    pii: "none",
    audit: false,
    useWhen: ["Every page — quick access to Contenu, Menu, Recherche"],
    avoidWhen: ["Never omit on DSFR services"],
    agentPrompt: "Anchor hrefs must target real ids on the page (menu, content, search). The list is hidden until keyboard focus via the fr-collapse mechanism.",
    preserve: [
      "nav with aria-label='Accès rapide'",
      "fr-skiplinks__list anchors targeting real ids"
    ],
    editable: ["Link text", "Anchor targets"],
    limitations: ["Targets must exist or the links are dead"],
    invariants: ["Quick-access landmark labelled"],
    related: ["header"],
    tags: ["skip", "évitement", "a11y", "keyboard"],
    description: "Keyboard skip links for quick access to page regions.",
    defaultMarkup: `<div class="fr-skiplinks">
  <nav class="fr-container" aria-label="Accès rapide">
    <ul class="fr-skiplinks__list">
      <li>
        <a class="fr-link" href="#contenu">Contenu</a>
      </li>
      <li>
        <a class="fr-link" href="#en-tete">En-tête</a>
      </li>
      <li>
        <a class="fr-link" href="#pied">Pied de page</a>
      </li>
    </ul>
  </nav>
</div>`,
  },
  {
    dir: "header",
    name: "Header",
    frName: "En-tête",
    cls: "fr-header",
    section: "navigation",
    requiresJs: "optional",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Every page — Marianne block, service title, operator logo, tools, and navigation"],
    avoidWhen: ["Do not nest forms inside the header"],
    agentPrompt: "Set the service name in fr-header__service-title and the description in fr-header__service-tagline. The Marianne block (République Française) is standard identity — keep it.",
    preserve: [
      "fr-header__brand with the Marianne logo block",
      "fr-header__service-title / __service-tagline structure",
      "header[role='banner'] semantics"
    ],
    editable: ["Service name", "Tagline", "Tool links", "Navigation links"],
    limitations: [
      "The Marianne identity block is reserved for French state services (agréments process)",
      "Menu toggle requires DSFR JS"
    ],
    invariants: ["Banner landmark", "Brand links to the service start page"],
    related: ["footer", "skiplinks", "breadcrumb"],
    tags: ["header", "en-tête", "marianne", "banner", "identity"],
    description: "DSFR header with Marianne block, service name, and tools.",
    defaultMarkup: `<header role="banner" class="fr-header" id="en-tete">
  <div class="fr-header__body">
    <div class="fr-container">
      <div class="fr-header__body-row">
        <div class="fr-header__brand fr-enlarge-link">
          <div class="fr-header__brand-top">
            <div class="fr-header__logo">
              <p class="fr-logo">
                République<br>Française
              </p>
            </div>
          </div>
          <div class="fr-header__service">
            <a href="#" title="Aller à la page d'accueil">
              <p class="fr-header__service-title">
                Nom du service
              </p>
            </a>
            <p class="fr-header__service-tagline">Baseline du service</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>`,
  },
  {
    dir: "footer",
    name: "Footer",
    frName: "Pied de page",
    cls: "fr-footer",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Every page — mandatory legal links (mentions légales, données personnelles, cookies) and licence mention"],
    avoidWhen: ["Do not place primary navigation here"],
    agentPrompt: "Edit the link lists. The footer carries the legal notice structure: fr-footer__bottom-copy with the licence mention and fr-footer__bottom-list with mandatory links.",
    preserve: [
      "fr-footer structure with brand, content, and bottom areas",
      "Licence mention (sauf mention contraire) text"
    ],
    editable: ["Link lists", "Partners section", "Licence text"],
    limitations: ["Mandatory legal links: mentions légales, données personnelles, gestion des cookies"],
    invariants: ["Contentinfo landmark"],
    related: ["header"],
    tags: ["footer", "pied", "legal", "licence"],
    description: "DSFR footer with mandatory legal links and licence.",
    defaultMarkup: `<footer class="fr-footer" role="contentinfo" id="pied">
  <div class="fr-container">
    <div class="fr-footer__body">
      <div class="fr-footer__brand fr-enlarge-link">
        <p class="fr-logo">République<br>Française</p>
      </div>
      <div class="fr-footer__content">
        <p class="fr-footer__content-desc">Description du service.</p>
      </div>
    </div>
    <div class="fr-footer__bottom">
      <ul class="fr-footer__bottom-list">
        <li class="fr-footer__bottom-item">
          <a class="fr-footer__bottom-link" href="#">Mentions légales</a>
        </li>
        <li class="fr-footer__bottom-item">
          <a class="fr-footer__bottom-link" href="#">Données personnelles</a>
        </li>
        <li class="fr-footer__bottom-item">
          <a class="fr-footer__bottom-link" href="#">Gestion des cookies</a>
        </li>
      </ul>
      <div class="fr-footer__bottom-copy">
        <p>Sauf mention contraire, tous les contenus de ce site sont sous <a href="#">licence etalab-2.0</a>.</p>
      </div>
    </div>
  </div>
</footer>`,
  },
  // ─── FEEDBACK ─────────────────────────────────────────────────────────────
  {
    dir: "alert",
    name: "Alert",
    frName: "Alerte",
    cls: "fr-alert",
    section: "feedback",
    requiresJs: "optional",
    interaction: ["focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Page-level information, success, warning, or error messages"],
    avoidWhen: ["Field-level errors — use fr-error-text", "Marketing content"],
    agentPrompt: "Variant classes: fr-alert--info / --success / --error / --warning. The dismissible close button (fr-alert__close) requires DSFR JS. Small variant: fr-alert--sm (title only).",
    preserve: [
      "fr-alert__title as a heading element (h3 default)",
      "Variant class conveying the message type",
      "fr-alert__close button structure when dismissible"
    ],
    editable: ["Title", "Body text", "Variant class"],
    limitations: ["Icon is fixed per variant", "Do not stack many alerts on one page"],
    invariants: ["Heading element inside the alert"],
    related: ["badge", "callout", "notice"],
    classMappingUswds: { base: "usa-alert", info: "usa-alert usa-alert--info", success: "usa-alert usa-alert--success", error: "usa-alert usa-alert--error", warning: "usa-alert usa-alert--warning" },
    classMappingGovuk: { base: "govuk-notification-banner", success: "govuk-notification-banner govuk-notification-banner--success" },
    tags: ["alert", "alerte", "info", "success", "error", "warning"],
    description: "Information, success, error, and warning alerts (fr-alert).",
    variants: [
      {
        file: "info", variant: "info",
        desc: "Information alert.",
        markup: `<div class="fr-alert fr-alert--info">
  <h3 class="fr-alert__title">Information</h3>
  <p>Une mise à jour du service aura lieu dimanche de 2h à 4h.</p>
</div>`
      },
      {
        file: "success", variant: "success",
        desc: "Success alert.",
        markup: `<div class="fr-alert fr-alert--success">
  <h3 class="fr-alert__title">Succès</h3>
  <p>Votre demande a bien été enregistrée.</p>
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Error alert.",
        markup: `<div class="fr-alert fr-alert--error">
  <h3 class="fr-alert__title">Erreur</h3>
  <p>Une erreur est survenue lors de l'envoi. Veuillez réessayer.</p>
</div>`
      },
      {
        file: "warning", variant: "warning",
        desc: "Warning alert.",
        markup: `<div class="fr-alert fr-alert--warning">
  <h3 class="fr-alert__title">Attention</h3>
  <p>Cette action est irréversible.</p>
</div>`
      }
    ]
  },
  {
    dir: "badge",
    name: "Badge",
    frName: "Badge",
    cls: "fr-badge",
    section: "feedback",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Short status or metadata labels (Nouveau, Brouillon, Actif)"],
    avoidWhen: ["Interactive elements — use tags with links/buttons", "Long text"],
    agentPrompt: "Colour variants convey severity: --success, --error, --warning, --info, --new. fr-badge--sm for small. Text always carries the meaning.",
    preserve: [".fr-badge on the element"],
    editable: ["Text", "Colour variant", "Size modifier"],
    limitations: ["Never rely on colour alone", "Do not overuse — badges lose meaning"],
    invariants: ["Text carries the meaning"],
    related: ["tag", "alert"],
    classMappingUswds: { base: "usa-tag" },
    classMappingGovuk: { base: "govuk-tag" },
    tags: ["badge", "status", "label", "severity"],
    description: "Status badges with severity colour variants (fr-badge).",
    defaultMarkup: `<p class="fr-badge fr-badge--success">Succès</p>
<p class="fr-badge fr-badge--error">Erreur</p>
<p class="fr-badge fr-badge--info">Information</p>
<p class="fr-badge fr-badge--warning">Attention</p>`,
  },
  {
    dir: "callout",
    name: "Callout",
    frName: "Mise en avant",
    cls: "fr-callout",
    section: "feedback",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Highlighting key information with an optional title, on a coloured background"],
    avoidWhen: ["Urgent warnings — use alert", "Inline emphasis — use highlight"],
    agentPrompt: "Edit the title (fr-callout__title as heading) and body. fr-callout--brown/--green-* etc. exist but default is the DSFR blue-grey. A button may be appended.",
    preserve: [".fr-callout structure with heading element"],
    editable: ["Title", "Body", "Optional button"],
    limitations: ["One callout per content section"],
    invariants: ["Heading element for the title"],
    related: ["highlight", "alert"],
    classMappingUswds: { base: "usa-summary-box" },
    classMappingGovuk: { base: "govuk-inset-text" },
    tags: ["callout", "mise", "avant", "emphasis"],
    description: "Highlighted key information block (fr-callout).",
    defaultMarkup: `<div class="fr-callout">
  <h4 class="fr-callout__title">Information importante</h4>
  <p class="fr-text--sm">
    Vous pouvez déposer votre dossier jusqu'au 30 juin. Passé ce délai, il sera automatiquement refusé.
  </p>
</div>`,
  },
  {
    dir: "highlight",
    name: "Highlight",
    frName: "Mise en exergue",
    cls: "fr-highlight",
    section: "feedback",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Emphasising a quote or key sentence within body text"],
    avoidWhen: ["Blocks needing a title — use callout"],
    agentPrompt: "Edit the text. fr-highlight--green-* / --brown-* variants change the left border colour.",
    preserve: [".fr-highlight left-border treatment"],
    editable: ["Text content", "Border colour variant"],
    limitations: ["Inline emphasis only — no title support"],
    invariants: ["Plain reading flow"],
    related: ["callout"],
    classMappingUswds: { base: "usa-alert" },
    classMappingGovuk: { base: "govuk-inset-text" },
    tags: ["highlight", "exergue", "quote", "emphasis"],
    description: "Left-bordered emphasis for key sentences (fr-highlight).",
    defaultMarkup: `<div class="fr-highlight">
  <p>Un impôt commun comprend l'impôt sur le revenu ainsi que la contribution à l'audiovisuel public.</p>
</div>`,
  },
  {
    dir: "notice",
    name: "Notice",
    frName: "Bandeau d'information",
    cls: "fr-notice",
    section: "feedback",
    requiresJs: "optional",
    interaction: ["click"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Site-wide notices above the header (maintenance, new version, weather alerts)"],
    avoidWhen: ["Page-level messages — use alert"],
    agentPrompt: "Variants: fr-notice--info, --warning, --alert (weather). The close button (fr-btn--close) requires DSFR JS.",
    preserve: [
      "fr-notice__body with title structure",
      "Placement above the header"
    ],
    editable: ["Title", "Body text"],
    limitations: ["One notice per page, above the header"],
    invariants: ["Notice precedes the header"],
    related: ["alert", "header"],
    tags: ["notice", "bandeau", "site-wide", "maintenance"],
    description: "Site-wide information banner placed above the header.",
    defaultMarkup: `<div class="fr-notice fr-notice--info">
  <div class="fr-notice__body">
    <p class="fr-notice__title">
      Maintenance programmée le dimanche de 2h à 4h
    </p>
  </div>
</div>`,
  },
  // ─── DATA DISPLAY ─────────────────────────────────────────────────────────
  {
    dir: "table",
    name: "Table",
    frName: "Tableau",
    cls: "fr-table",
    section: "data-display",
    requiresJs: "optional",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Tabular data with a genuine row/column relationship"],
    avoidWhen: ["Lists that could be markup lists", "Layout purposes"],
    agentPrompt: "Edit headers and cells. Caption is required. Bordered variants: fr-table--bordered; striped: fr-table--striped. Wrap wide tables in fr-table__wrapper for scrolling.",
    preserve: [
      "<caption> element (required)",
      "scope='col'/'row' on header cells",
      ".fr-table wrapper structure"
    ],
    editable: ["Caption text", "Headers and cells", "Bordered/striped modifiers"],
    limitations: ["Wide tables need the wrapper for horizontal scroll"],
    invariants: ["Caption present", "scope attributes on headers"],
    related: ["pagination", "search", "badge"],
    classMappingUswds: { base: "usa-table" },
    classMappingGovuk: { base: "govuk-table" },
    tags: ["table", "tableau", "data", "numbers"],
    description: "Accessible data table with caption, bordered and striped variants.",
    defaultMarkup: `<div class="fr-table">
  <table>
    <caption>Titre du tableau</caption>
    <thead>
      <tr>
        <th scope="col">Colonne 1</th>
        <th scope="col">Colonne 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Valeur 1</td>
        <td>Valeur 2</td>
      </tr>
      <tr>
        <td>Valeur 3</td>
        <td>Valeur 4</td>
      </tr>
    </tbody>
  </table>
</div>`,
  },
  {
    dir: "card",
    name: "Card",
    frName: "Carte (tuile)",
    cls: "fr-card",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Linking to content pages in grids (news, services, articles)"],
    avoidWhen: ["Action buttons — use fr-btn", "Tabular data — use fr-table"],
    agentPrompt: "The title link with fr-enlarge-link makes the whole card clickable. Add fr-card--horizontal for side-by-side layout, fr-card--download for download cards. Detail chips (fr-badge) go in fr-card__detail. Icon treatments (circular icon badges as seen on service-public.gouv.fr life-event cards) are site customizations — compose the icon inside fr-card__body above the title.",
    preserve: [
      "fr-card__title with fr-card__link inside (h3 default)",
      "fr-enlarge-link mechanism for whole-card click",
      "Body/media structure"
    ],
    editable: ["Title", "Description", "Detail badges", "Media", "Layout modifiers"],
    limitations: ["One primary link per card", "Keep descriptions short"],
    invariants: ["Single accessible name per card via the title link"],
    related: ["badge", "tag", "download"],
    classMappingUswds: { base: "usa-card" },
    classMappingGovuk: { base: "govuk-card" },
    tags: ["card", "carte", "tuile", "content", "grid"],
    description: "Content card with enlarged link (fr-card).",
    provenance: { observed: "2026-09-06", source: "https://www.service-public.gouv.fr/particuliers", method: "live-site observation" },
    defaultMarkup: `<div class="fr-card">
  <div class="fr-card__body">
    <div class="fr-card__content">
      <h3 class="fr-card__title">
        <a class="fr-card__link" href="#">Titre de la carte</a>
      </h3>
      <p class="fr-card__desc">Description courte du contenu proposé.</p>
    </div>
  </div>
</div>`,
    variants: [
      {
        file: "default", variant: "default",
        desc: "Standard card.",
        markup: `<div class="fr-card">
  <div class="fr-card__body">
    <div class="fr-card__content">
      <h3 class="fr-card__title">
        <a class="fr-card__link" href="#">Titre de la carte</a>
      </h3>
      <p class="fr-card__desc">Description courte du contenu proposé.</p>
    </div>
  </div>
</div>`
      },
      {
        file: "horizontal-media", variant: "horizontal-media",
        desc: "Horizontal card with image — the news-listing pattern used on service-public.gouv.fr.",
        markup: `<div class="fr-card fr-card--horizontal fr-enlarge-link">
  <div class="fr-card__media">
    <div class="fr-responsive-img-wrapper">
      <img class="fr-responsive-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%23e3e3fd'/%3E%3Ctext x='200' y='135' fill='%23000091' text-anchor='middle' font-size='18'%3EImage%3C/text%3E%3C/svg%3E" alt="">
    </div>
  </div>
  <div class="fr-card__body">
    <div class="fr-card__content">
      <h3 class="fr-card__title">
        <a class="fr-card__link" href="#">Ce qui change en septembre 2026</a>
      </h3>
      <p class="fr-card__desc">Retraite - Assurance chômage - Arrêt de travail.</p>
    </div>
  </div>
</div>`
      }
    ]
  },
  {
    dir: "follow",
    name: "Follow (newsletter + social)",
    frName: "Lettre d'information et réseaux sociaux",
    cls: "fr-follow",
    section: "feedback",
    requiresJs: "no",
    interaction: ["type", "click", "focus"],
    pii: "accepts_input",
    audit: false,
    useWhen: ["Newsletter subscription and social-media links at the bottom of content pages", "The service-public.gouv.fr home page pattern"],
    avoidWhen: ["Do not place before the main content", "Never collect emails without a data-protection notice"],
    agentPrompt: "The fr-follow block combines fr-follow__newsletter (label + fr-input + fr-btn) and fr-follow__social (fr-btns-group with fr-icon-* network buttons). Use both columns or a single one via the grid classes.",
    preserve: [
      "fr-follow wrapper with fr-follow__newsletter / fr-follow__social structure",
      "Newsletter form label association via for/id",
      "Social links carry accessible network names"
    ],
    editable: ["Newsletter title and text", "Social networks list", "Subscription action"],
    limitations: ["Newsletter endpoints must handle double opt-in", "Social button icons come from DSFR icon classes"],
    invariants: ["Email input labelled", "Social links have accessible names beyond the icon"],
    related: ["input", "button", "footer"],
    tags: ["follow", "newsletter", "social", "réseaux", "abonnement"],
    description: "Newsletter subscription and social-media follow block (fr-follow).",
    provenance: { observed: "2026-09-06", source: "https://www.service-public.gouv.fr/particuliers", method: "live-site observation" },
    variants: [
      {
        file: "newsletter", variant: "newsletter",
        desc: "Newsletter subscription block.",
        markup: `<div class="fr-follow">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <h2 class="fr-h5">Abonnez-vous à notre lettre d'information</h2>
        <p class="fr-text--sm">Recevez chaque semaine les actualités de vos droits et démarches.</p>
        <div class="fr-follow__newsletter">
          <form action="#" method="post">
            <label class="fr-label" for="follow-email">Votre adresse électronique</label>
            <input class="fr-input" type="email" id="follow-email" name="email" autocomplete="email">
            <button class="fr-btn" type="submit">S'abonner</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>`
      },
      {
        file: "social", variant: "social",
        desc: "Social-media follow links block.",
        markup: `<div class="fr-follow">
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <h2 class="fr-h5">Suivez-nous sur les réseaux sociaux</h2>
        <div class="fr-follow__social">
          <ul class="fr-btns-group">
            <li><a class="fr-btn fr-icon-facebook-circle-line" href="#" title="Facebook">Facebook</a></li>
            <li><a class="fr-btn fr-icon-linkedin-box-line" href="#" title="LinkedIn">LinkedIn</a></li>
            <li><a class="fr-btn fr-icon-youtube-line" href="#" title="YouTube">YouTube</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>`
      }
    ]
  },
  {
    dir: "tag",
    name: "Tag",
    frName: "Tag",
    cls: "fr-tag",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Labelling content, filtering, or interactive keyword selection"],
    avoidWhen: ["Status severity — use badge"],
    agentPrompt: "As <a> or <button> for interactive tags; <p>/<span> for static. fr-tag--sm for small. Active/selected: aria-pressed='true' + fr-tag--selected? (use aria-pressed on buttons).",
    preserve: [".fr-tag class", "Element semantics match interactivity (a/button/p)"],
    editable: ["Label text", "Size modifier"],
    limitations: ["Static tags must not look clickable — use <p> not <button>"],
    invariants: ["Element type matches interactivity"],
    related: ["badge", "card"],
    classMappingUswds: { base: "usa-tag" },
    classMappingGovuk: { base: "govuk-tag" },
    tags: ["tag", "label", "filter", "keyword"],
    description: "Interactive or static keyword tags (fr-tag).",
    defaultMarkup: `<ul class="fr-tags-group">
  <li><p class="fr-tag">Étiquette</p></li>
  <li><a class="fr-tag" href="#">Étiquette lien</a></li>
  <li><button class="fr-tag" aria-pressed="true">Sélectionné</button></li>
</ul>`,
  },
  {
    dir: "download",
    name: "Download",
    frName: "Téléchargement de fichier",
    cls: "fr-download",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "none",
    audit: false,
    useWhen: ["Linking to downloadable files with format and size metadata"],
    avoidWhen: ["Regular page links — use fr-link"],
    agentPrompt: "Edit the file name and meta (format — size). Keep the download attribute and the fr-download__meta visible — users must know the format and size before clicking.",
    preserve: [
      "download attribute on the link",
      "fr-download__meta with format and size",
      "fr-download__name visible text"
    ],
    editable: ["File name", "Meta text", "href"],
    limitations: ["Direct downloads only — no interstitial pages"],
    invariants: ["Format and size visible before download"],
    related: ["card"],
    tags: ["download", "téléchargement", "file"],
    description: "File download link with visible format and size metadata.",
    defaultMarkup: `<div class="fr-download">
  <a class="fr-download__link" href="#" download>
    <span class="fr-download__name">Nom du document</span>
    <span class="fr-download__meta">PDF — 120 Ko</span>
  </a>
</div>`,
  },
  {
    dir: "accordion",
    name: "Accordion",
    frName: "Accordéon",
    cls: "fr-accordion",
    section: "data-display",
    requiresJs: "required",
    interaction: ["click", "keyboard"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Several related content sections users read selectively", "FAQ-style content in limited vertical space"],
    avoidWhen: ["Single item — use native details instead", "Content users must read in full"],
    agentPrompt: "Each section is h3 > fr-accordion__btn + fr-collapse div. aria-expanded and the fr-collapse--expanded class are JS-managed — keep the id/aria-controls pairing.",
    preserve: [
      "h3 with nested fr-accordion__btn button",
      "aria-expanded / aria-controls pairing (JS-owned)",
      "fr-accordions-group wrapper for multiple sections"
    ],
    editable: ["Section titles", "Section content"],
    limitations: ["Content hidden until JS runs — keep a no-JS fallback in mind", "Do not nest accordions"],
    invariants: ["Button-in-heading pattern per section"],
    related: ["tabs", "highlight"],
    classMappingUswds: { base: "usa-accordion" },
    classMappingGovuk: { base: "govuk-accordion" },
    tags: ["accordion", "accordéon", "sections", "disclosure"],
    description: "Expandable content sections (fr-accordion, DSFR JS required).",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Accordion group with two sections.",
        markup: `<div class="fr-accordions-group">
  <section class="fr-accordion">
    <h3 class="fr-accordion__title">
      <button class="fr-accordion__btn" aria-expanded="true" aria-controls="accordion-1">Titre de la section 1</button>
    </h3>
    <div class="fr-collapse" id="accordion-1">
      <p class="fr-text--sm">Contenu de la première section.</p>
    </div>
  </section>
  <section class="fr-accordion">
    <h3 class="fr-accordion__title">
      <button class="fr-accordion__btn" aria-expanded="false" aria-controls="accordion-2">Titre de la section 2</button>
    </h3>
    <div class="fr-collapse" id="accordion-2">
      <p class="fr-text--sm">Contenu de la deuxième section.</p>
    </div>
  </section>
</div>`
      }
    ]
  },
  {
    dir: "summary",
    name: "Summary (table of contents)",
    frName: "Sommaire",
    cls: "fr-summary",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Long content pages — links to page sections (anchors)"],
    avoidWhen: ["Short pages"],
    agentPrompt: "Anchor links must match real section heading ids. Title 'Sommaire' is fixed vocabulary.",
    preserve: [
      "nav with aria-labelledby pointing at fr-summary__title",
      "ol structure with fr-summary__link anchors"
    ],
    editable: ["Anchor texts", "Anchor targets"],
    limitations: ["Anchors must resolve — sync with heading ids"],
    invariants: ["Landmark labelled via aria-labelledby"],
    related: ["breadcrumb"],
    tags: ["summary", "sommaire", "toc", "anchors"],
    description: "Table of contents with anchor links (fr-summary).",
    defaultMarkup: `<nav class="fr-summary" role="navigation" aria-labelledby="fr-summary-title">
  <p class="fr-summary__title" id="fr-summary-title">Sommaire</p>
  <ol class="fr-summary__list">
    <li>
      <a class="fr-summary__link" href="#section-1">Titre de la première section</a>
    </li>
    <li>
      <a class="fr-summary__link" href="#section-2">Titre de la deuxième section</a>
    </li>
  </ol>
</nav>`,
  }
];
