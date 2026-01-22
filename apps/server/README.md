# Veggie Rescue Server

Express + TypeScript API server for managing food donation pickups.

## Quick Start

From the monorepo root:

```bash
# Install dependencies (if not already done)
npm install

# Start server in development mode
npm run dev -w @veggie-rescue/server
```

Server runs at `http://localhost:3000`

## Scripts

Run from monorepo root with `-w @veggie-rescue/server`:

| Command | Description |
|---------|-------------|
| `npm run dev -w @veggie-rescue/server` | Start dev server with hot reload |
| `npm run build -w @veggie-rescue/server` | Compile TypeScript to dist/ |
| `npm start -w @veggie-rescue/server` | Run compiled server |
| `npm test -w @veggie-rescue/server` | Run tests with Vitest |
| `npm run lint -w @veggie-rescue/server` | Run ESLint |

Or run all packages together from root: `npm run dev`

## API Endpoints

### Health

- `GET /` - Welcome message
- `GET /health` - Health check

### Donations

- `GET /donations` - List all donations
- `GET /donations/:id` - Get donation by ID
- `POST /donations` - Create donation
- `PATCH /donations/:id` - Update donation
- `DELETE /donations/:id` - Delete donation

### Create Donation Example

```bash
curl -X POST http://localhost:3000/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorName": "John Doe",
    "donorEmail": "john@example.com",
    "items": [{"name": "Carrots", "quantity": 10, "unit": "lb"}],
    "pickupAddress": "123 Farm Road",
    "pickupDate": "2024-12-15T10:00:00.000Z"
  }'
```

## Project Structure

```
src/
├── __tests__/          # Test files
├── middleware/         # Express middleware
│   ├── errorHandler.ts # Centralized error handling
│   └── validate.ts     # Zod request validation
├── routes/             # Route handlers
├── services/           # Business logic
├── types/              # TypeScript types & Zod schemas
├── app.ts              # Express app setup
└── index.ts            # Server entry point
```

## Shared Types

This package uses `@veggie-rescue/shared-types` for core types:

- `Donation` - Core donation entity
- `DonationItem` - Items within a donation
- `CreateDonationInput` - Validated input schema
- `ApiResponse<T>` - Standardized response wrapper

## Tech Stack

- **Runtime**: Node.js with ESM
- **Framework**: Express 5
- **Language**: TypeScript (ES2024)
- **Validation**: Zod
- **Testing**: Vitest + Supertest
- **Linting**: ESLint 9 (flat config) + Prettier
