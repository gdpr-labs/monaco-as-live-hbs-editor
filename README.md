# Monaco Editor Next.js Demo

This project scaffolds a Next.js App Router playground for editing Handlebars templates with Monaco Editor and previewing the rendered output side by side.

## Features

- App Router layout using the latest Next.js 16 runtime.
- Monaco Editor configured for Handlebars syntax with a sample template.
- Live preview panel that compiles the template with sample data loaded from JSON.
- Material UI (MUI) styling with a custom dark theme and Geist font.
- Responsive layout with clean, modern design.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Material UI v7
- **Code Editor**: Monaco Editor
- **Template Engine**: Handlebars
- **Fonts**: Geist Sans & Geist Mono
- **Styling**: Emotion (CSS-in-JS)

## Getting Started

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open http://localhost:3000 to experiment with the split editor/preview experience.

## Linting

Run `npm run lint` to execute ESLint with the Next.js configuration.

## Notes

- The preview renders the template in the browser using the handlebars runtime.
- Edit [public/sampleData.hbs](public/sampleData.hbs) to change the default Handlebars template and [public/sampleContext.json](public/sampleContext.json) to update the preview context.
- Theme customization can be done in [app/theme.js](app/theme.js).
