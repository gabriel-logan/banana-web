# banana-web

Frontend for Banana Meeting Rooms.

## Responsibility

- Authenticate against `banana-auth-api`
- Consume `banana-reservations-api`
- Manage reservation creation, edition, deletion and batch deletion

## Tech Choices

- **React + Vite + TypeScript** because the challenge requires React and TypeScript, and this combination gives a fast development experience with type safety and low setup friction. I chose Vite over older bundlers like Webpack because it is simpler and faster for a small-to-medium frontend, which helps deliver more time on product behavior instead of tool configuration.
- **Axios** because the application needs explicit communication with two different backends, plus interceptors for attaching tokens and refreshing sessions. I chose it over using the native `fetch` API directly because Axios makes these cross-cutting concerns cleaner and more centralized without creating a large API abstraction layer.
- **TanStack Query** because reservations, rooms and branches are server state and benefit from caching, invalidation and loading/error management. I chose it over managing everything manually with `useEffect` and local component state because that tends to duplicate request logic and makes mutation synchronization harder as the app grows.
- **Zustand** because the frontend only needs lightweight global state for authentication and user preferences. I chose it over Redux because Redux would add more ceremony than value for this scope, and over storing everything in React Context because Zustand keeps shared state simpler and more ergonomic without extra provider nesting.
- **Multiform Validator** because the forms in this project need explicit validation rules with good control over edge cases and invalid states. I chose it because it is a library I created myself with a focus on more aggressive validation scenarios and stricter input testing, which fit well for login, registration and reservation flows where inconsistent input should be caught early in the frontend.
- **Tailwind CSS** because the UI needed to be delivered quickly while still allowing a custom visual identity. I chose it over component libraries like MUI or Ant Design because those would push the interface toward a more generic look, and over writing only handcrafted CSS because Tailwind speeds up composition while still leaving full control over layout and styling.

## Requirements

For local development:

- Node.js 22+
- pnpm

For Docker:

- Docker

## Environment Variables

Copy `.env.example` to `.env`.

```bash
cp .env.example .env
```

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

## Future Improvements

These are small improvements that would be interesting in a next iteration, but would add complexity beyond the current challenge scope:

- Add frontend automated tests for login, registration, reservation creation and deletion feedback flows.
- Improve session handling by consuming token expiration metadata directly from the auth API instead of relying on a local TTL strategy.
- Add filtering and pagination controls in the reservations list for larger datasets.
- Add more loading skeletons and optimistic UI behaviors for a smoother user experience during mutations.
