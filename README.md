## LexEstateCo

A full-stack real-estate marketplace — sellers list properties, buyers browse/filter/save them, and both sides can message each other and book tours. React + Vite on the frontend, Express + Sequelize (MySQL) on the backend. Started as a way to properly learn how a full app fits together end to end, so some corners are more polished than others.

### What's actually in here

- Email/password auth, JWT-based (token issued on login/register, verified on every write)
- Property listings: create/edit/delete for the owner only, public browsing for everyone, image uploads
- Saved properties (favorites) per user
- Tour requests — buyers ask to view a property, sellers accept/reject, buyers can cancel
- In-app messaging per property between buyer and seller
- Notifications for the above (new request, request updated, etc.)
- A tiny `/stats` endpoint (user/property counts + an in-memory feedback rating, resets on server restart — not trying to be a real analytics pipeline)
- Global color tokens in Tailwind (`primary` / `secondary` / `background`) so the whole theme can be re-skinned from one config file instead of hunting down every `blue-500`

### Tech stack

- **Client**: React 18, TypeScript, Vite, Redux Toolkit, React Router, TailwindCSS
- **Server**: Node/Express, Sequelize, MySQL, JWT, bcrypt, multer for uploads
- **Testing**: Jest (server, unit + an integration suite that spins up a real throwaway MySQL container), Vitest + React Testing Library (client)
- **CI**: GitHub Actions runs both test suites + a production build on push/PR

### Layout

```
client/src/
  components/   grouped by domain: property, layout, messaging, tour-requests, common
  hooks/        same grouping — most components lean on a hook for data/state
  pages/        route-level components
  sections/     bigger page chunks (hero, feature sections, etc.)
  state/        redux slices (user, tab, lang — that's it now, modal state got folded into components)

server/
  routes/       one file per resource, auth middleware applied per-route
  controllers/  business logic + ownership checks
  models/       Sequelize models
  middlewares/  requireAuth / assertSelf
  test/         integration test harness (spins up its own MySQL container)
```

Nothing too clever — it's a pretty standard REST API with a normal-shaped React app on top.

### Getting set up

You need Node 18+ (I run this through nvm) and either a local MySQL instance or the Docker setup below.

**server/.env**

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=<your-db-username>
DB_PASSWORD=<your-db-password>
DB_NAME=<your-db-name>
JWT_SECRET=<anything-long-and-random>
```

**client/.env**

```
VITE_API_HOST=http://localhost
VITE_API_PORT=5000
```

Then:

```bash
npm install --prefix server
npm install --prefix client
npm run dev   # from the repo root, runs both concurrently
```

API lands on `PORT` (5000 by default), Vite dev server on `5173` with hot reload for anything client-side, including Tailwind changes — no rebuild needed for that, just don't run it through Docker while you're iterating (see Docker section below).

### Testing

```bash
npm test --prefix server              # unit tests, mocked Sequelize
npm run test:integration --prefix server   # real MySQL in a throwaway docker container, needs Docker running
npm test --prefix client              # Vitest + RTL
```

The integration suite exists because mocks will happily accept a query with the wrong column name and just return whatever you told them to — which is exactly how a real bug slipped through earlier (a saved-property lookup querying `userId`/`propertyId` against columns actually named `user_id`/`property_id`, silently always returning "not saved"). Worth having both layers.

### API surface (quick reference)

| Resource | Routes | Auth |
|---|---|---|
| Auth | `POST /auth/login`, `POST /auth/register` | public |
| Users | `GET /users/`, `GET /users/:id`, `GET /users/email/search`, `PUT /users/change-password` | change-password only |
| Properties | `GET /properties/`, `GET /properties/:id`, `GET /properties/seller-id/:sellerId`, `GET /properties/location/:location`, `POST /properties/`, `PUT /properties/:propertyId`, `DELETE /properties/:propertyId`, `POST /properties/:propertyId/images` | reads public, writes require auth + ownership |
| Saved properties | `GET /saved-properties/:userId`, `POST /saved-properties/check`, `POST /saved-properties/`, `DELETE /saved-properties/` | auth required |
| Tour requests | `POST /tour-requests/`, `GET /tour-requests/requester/:requesterId`, `GET /tour-requests/seller/:sellerId`, `GET /tour-requests/requester/:requesterId/property/:propertyId`, `PUT /tour-requests/:id/status` | auth required |
| Conversations | `POST /conversations/start`, `GET /conversations/user/:userId`, `GET /conversations/property/:propertyId/user/:userId`, `GET /conversations/:conversationId/messages/:userId`, `POST /conversations/:conversationId/messages` | auth required |
| Notifications | `GET /notifications/:ownerId`, `DELETE /notifications/:ownerId`, `DELETE /notifications/:ownerId/:notificationId` | auth required |
| Stats | `GET /stats/`, `POST /stats/feedback` | public |

"Auth required" means a valid bearer token; most of these also check that the token's user actually owns the thing they're trying to touch (can't edit someone else's listing just because you're logged in).

### Data models

- **User** — first/last name, email, hashed password, phone
- **Property** — title, price, location, neighborhood, zip code, description, size, image refs, seller (FK to User)
- **SavedProperty** — user + property, basically a favorites join table
- **TourRequest** — property, seller, requester, requested time, status (pending/accepted/rejected/canceled)
- **Conversation** / **Message** — one conversation per buyer+property, messages belong to a conversation
- **Notification** — owner, title, description, type

### Docker Compose

- `docker compose up --build` spins up MySQL + the API + the client (served as a static build via nginx)
- Client on `http://localhost:8080`, API on `http://localhost:5000`
- The client's API URL is baked in at build time (see `client/Dockerfile`), so if you change `VITE_API_HOST`/`VITE_API_PORT` you need to rebuild that image, not just restart it
- This is the "does it actually work end to end" setup, not a dev loop — for actually iterating on the UI, run `npm run dev --prefix client` locally against the dockerized API instead, you'll get instant hot reload instead of a multi-second rebuild every time

### Known rough edges

- No pagination on `GET /properties/` — fine for a demo dataset, would matter at real scale
- The stats/feedback rating is in-memory and resets whenever the server restarts
- Bundle size warning on client build (one big chunk, ~660kb) — haven't bothered code-splitting yet
- No refresh tokens — JWT is a flat 7-day expiry, you just get logged out and have to log back in
