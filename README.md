# banana-web

Frontend for Banana Meeting Rooms.

## Responsibility

- Authenticate against `banana-auth-api`
- Consume `banana-reservations-api`
- Manage reservation creation, edition, deletion and batch deletion

## Tech Choices

- **React + Vite + TypeScript** for a fast frontend setup
- **Axios** for API calls
- **TanStack Query** for server state
- **Zustand** for auth and user preferences
- **Tailwind CSS** for UI styling

## Requirements

For local development:

- Node.js 22+
- pnpm

For Docker:

- Docker

## Environment Variables

Copy `.env.example` to `.env`.

| Variable                    | Description                                   |
| --------------------------- | --------------------------------------------- |
| `VITE_AUTH_API_URL`         | Base URL for the auth API                     |
| `VITE_RESERVATIONS_API_URL` | Base URL for the reservations API             |
| `VITE_SESSION_TTL_MINUTES`  | Frontend session TTL before refresh flow runs |

## Run

Option A: local development

```bash
pnpm install
pnpm dev
```

The app will be available at `http://localhost:5173`.

Option B: Docker

```bash
docker build -t banana-web .
docker run --rm -p 3000:80 banana-web
```

The app will be available at `http://localhost:3000`.

## Notes

- `banana-auth-api` and `banana-reservations-api` must be running first
- The two APIs must share the exact same `JWT_SECRET`
- The frontend automatically refreshes the session using the refresh token flow
