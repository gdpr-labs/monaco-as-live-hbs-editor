# Monaco Editor Next.js Demo

This project scaffolds a Next.js App Router playground for editing Handlebars templates with Monaco Editor and previewing the rendered output side by side.

## Features

- App Router layout using the latest Next.js 16 runtime.
- Monaco Editor configured for Handlebars syntax with a sample template.
- Live preview panel that compiles the template with sample data loaded from JSON.
- Tailwind CSS styling for both the editor shell and rendered preview.

## Getting Started

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open http://localhost:3000 to experiment with the split editor/preview experience.

## Linting

Run `npm run lint` to execute ESLint with the Next.js configuration.

## Notes

- The preview renders the template in the browser using the handlebars runtime.
- Edit [public/sampleData.hbs](public/sampleData.hbs) to change the default Handlebars template and [public/sampleContext.json](public/sampleContext.json) to update the preview context.
