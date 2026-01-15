# Veggie Rescue Server

Express + TypeScript API server for managing food donation pickups.

## Quick Start

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3000`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to dist/ |
| `npm start` | Run compiled server |
| `npm test` | Run tests with Vitest |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |

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

## Tech Stack

- **Runtime**: Node.js with ESM
- **Framework**: Express 5
- **Language**: TypeScript (ES2024)
- **Validation**: Zod
- **Testing**: Vitest + Supertest
- **Linting**: ESLint 9 (flat config) + Prettier
