# Veggie Rescue

Rescuing vegetables, reducing waste.

A monorepo containing the Veggie Rescue web application and API server.

## Tech Stack

| Package | Technology |
|---------|------------|
| **web** | Next.js 16, React 19, TypeScript, SCSS modules |
| **server** | Express 5, TypeScript, Zod validation, Vitest |
| **shared-types** | Shared TypeScript types for Donation and API |

**Tooling**: Turborepo, npm workspaces, ESLint 9, Prettier

## Getting Started

```bash
# Install all dependencies
npm install

# Start both web and server in development
npm run dev

# Build all packages
npm run build

# Run all tests
npm run test

# Lint all packages
npm run lint
```

## Project Structure

```
veggie-rescue/
├── apps/
│   ├── web/                  # Next.js frontend (port 3001)
│   └── server/               # Express API server (port 3000)
├── packages/
│   └── shared-types/         # Shared TypeScript types
├── turbo.json                # Turborepo task configuration
├── tsconfig.base.json        # Shared TypeScript base config
├── package.json              # Root workspace configuration
└── .prettierrc               # Shared Prettier config
```

## Workspaces

### @veggie-rescue/web

Next.js 16 frontend with React 19 and SCSS modules.

```bash
# Run only the web app
npm run dev -w @veggie-rescue/web

# Build web app
npm run build -w @veggie-rescue/web
```

See [apps/web/](apps/web/) for frontend-specific details.

### @veggie-rescue/server

Express 5 API server for managing food donation pickups.

```bash
# Run only the server
npm run dev -w @veggie-rescue/server

# Run server tests
npm run test -w @veggie-rescue/server
```

See [apps/server/README.md](apps/server/README.md) for API documentation.

### @veggie-rescue/shared-types

Shared TypeScript types used by both web and server packages.

- `Donation` - Core donation entity type
- `DonationItem` - Individual items in a donation
- `CreateDonationInput` - Input validation schema
- `ApiResponse` - Standardized API response wrapper

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all packages |
| `npm run lint` | Lint all packages |
| `npm run test` | Run all tests |
| `npm run clean` | Remove build artifacts and node_modules |

## Configuration

| File | Purpose |
|------|---------|
| `turbo.json` | Turborepo task definitions and caching |
| `tsconfig.base.json` | Shared TypeScript compiler options |
| `.prettierrc` | Code formatting rules |
| `package.json` | Workspace definitions and root scripts |
