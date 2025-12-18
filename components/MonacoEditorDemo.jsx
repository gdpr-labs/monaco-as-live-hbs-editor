'use client';

import Editor from "@monaco-editor/react";

export const DEFAULT_TEMPLATE = `{{!-- Example Handlebars template --}}
<section class="hero">
  <h1>{{title}}</h1>
  {{#if subtitle}}
    <p class="subtitle">{{subtitle}}</p>
  {{/if}}

  <ul class="feature-list">
    {{#each features}}
      <li>{{this}}</li>
    {{/each}}
  </ul>

  {{#if cta}}
    <a class="hero__cta" href="{{cta.href}}">{{cta.label}}</a>
  {{/if}}
</section>
`;

export const MonacoEditorDemo = ({
  height = "60vh",
  language = "handlebars",
  value = DEFAULT_TEMPLATE,
  onChange
}) => (
  <Editor
    height={height}
    defaultLanguage={language}
    language={language}
    path="template.hbs"
    value={value}
    onChange={(nextValue) => onChange?.(nextValue ?? "")}
    theme="vs-dark"
    options={{
      minimap: { enabled: false },
      fontSize: 14,
      automaticLayout: true,
      scrollBeyondLastLine: false
    }}
  />
);
