export const COMMON_SNIPPETS = [
  {
    id: "common:if",
    label: "{{#if condition}}",
    snippet: "{{#if condition}}\n  {{condition}}\n{{/if}}",
    detail: "Conditional block",
  },
  {
    id: "common:unless",
    label: "{{#unless condition}}",
    snippet: "{{#unless condition}}\n  {{condition}}\n{{/unless}}",
    detail: "Negated conditional",
  },
  {
    id: "common:with",
    label: "{{#with object}}",
    snippet: "{{#with object}}\n  {{this}}\n{{/with}}",
    detail: "Scope nested context",
  },
];
