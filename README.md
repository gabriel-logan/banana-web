# banana-web

Frontend — React + Vite + TypeScript.

## Environment Variables

| Variable                    | Description               |
| --------------------------- | ------------------------- |
| `VITE_AUTH_API_URL`         | Auth API base URL         |
| `VITE_RESERVATIONS_API_URL` | Reservations API base URL |

## Run with Docker

```bash
docker build -t banana-web .
docker run -p 3000:80 banana-web
```

Access at `http://localhost:3000`

## Development

```bash
pnpm install
pnpm dev
```
