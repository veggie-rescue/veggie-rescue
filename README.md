# Veggie Rescue

Rescuing vegetables, reducing waste.

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Sass/SCSS modules
- **Build**: Static export with React Compiler

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build static site to `out/` |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint and Stylelint |
| `npm run lint:fix` | Fix linting issues |
| `npm run clean` | Remove build artifacts and node_modules |

## Project Structure

```
src/
  app/
    layout.tsx      # Root layout
    page.tsx        # Home page
    globals.scss    # Global styles
    page.module.scss
types/
  scss.d.ts         # SCSS module type declarations
public/             # Static assets
```

## Configuration

- `next.config.ts` - Next.js config (static export, React Compiler)
- `tsconfig.json` - TypeScript config
- `eslint.config.ts` - ESLint flat config
- `stylelint.config.mjs` - Stylelint for SCSS
- `postcss.config.js` - PostCSS with autoprefixer
