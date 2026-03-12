## LexEstateCo

Full-stack real-estate marketplace where sellers list properties and buyers browse, filter, and save them. Built with a React + Vite frontend and an Express + Sequelize API backed by MySQL.

### Highlights

- Email/password auth with session kept in Redux state
- Property CRUD for sellers and public browsing for everyone
- Saved properties (favorites) per user
- Basic search/filtering on the home page

### Repository Layout

- [client/](client) – React + TypeScript app (Vite, Tailwind, Redux Toolkit, React Router)
- [server/](server) – Express API with Sequelize models and MySQL
- [docs/](docs) – Generated API docs (JSDoc/TypeDoc output)

### Tech Stack

- Frontend: React 18, TypeScript, Vite, Redux Toolkit, TailwindCSS
- Backend: Node.js, Express, Sequelize ORM, MySQL
- Tooling: Concurrent dev runner, JSDoc/TypeDoc for docs

### Prerequisites

- Node.js 18+ and npm
- MySQL running locally or accessible via network

### Environment Configuration

Create environment files before running the app.

**server/.env**

```
PORT=5000
DB_HOST=localhost
DB_USER=<your-db-username>
DB_PASSWORD=<your-db-password>
DB_NAME=<your-db-name>
```

**client/.env**

```
VITE_API_HOST=http://localhost
VITE_API_PORT=5000
```

> The frontend builds its API base URL from VITE_API_HOST and VITE_API_PORT (see [client/src/config/baseUrl.ts](client/src/config/baseUrl.ts)).

### Quick Start (Development)

```bash
# from repo root
npm install            # installs root dev tools (concurrently, docs tooling)
npm install --prefix server
npm install --prefix client

# start API + frontend together
npm run dev
```

The root dev script runs both servers concurrently (API on PORT, Vite on 5173 by default).

### Building and Running

- Frontend production build: `npm run build --prefix client`
- Frontend preview: `npm run preview --prefix client`
- API (dev with nodemon): `npm run dev --prefix server`
- API (production): `npm run start --prefix server`

### Application Flow (Frontend)

- Public routes: `/` (home with search + grid), `/login`, `/register`
- Authenticated route: `/account` with tabs for saved properties, user listings, listing form, and the My Audience placeholder
- Global state: user session ([client/src/state/user/userSlice.ts](client/src/state/user/userSlice.ts#L5-L34)) and modal state ([client/src/state/modal/modalSlice.ts](client/src/state/modal/modalSlice.ts#L5-L32)); store setup in [client/src/state/store.ts](client/src/state/store.ts#L1-L14)

### API Surface (Server)

**Users** (see [server/routes/users.js](server/routes/users.js#L16-L77))

- `GET /users/:id` – fetch user by id
- `GET /users?email=` – fetch user by email
- `POST /users/auth` – authenticate (email, password)
- `POST /users/register` – create user (password hashed with bcrypt)
- `PUT /users/change-password` – update password

**Properties** (see [server/routes/properties.js](server/routes/properties.js#L19-L74))

- `GET /properties/` – list all
- `GET /properties/:id` – fetch by id
- `GET /properties/seller-id/:sellerId` – list by seller
- `GET /properties/location/:location` – list by location
- `POST /properties/` – create
- `PUT /properties/:propertyId` – update
- `DELETE /properties/:propertyId` – delete

**Saved Properties** (see [server/routes/savedProperties.js](server/routes/savedProperties.js#L15-L65))

- `GET /saved-properties/:userId` – list saved property ids for a user
- `POST /saved-properties/check` – existence check
- `POST /saved-properties/` – save
- `DELETE /saved-properties/` – unsave

### Data Models

- Property: title, price, location, description, size, distance, sellerId, image_data (binary; currently expected by model) – defined in [server/models/Property.js](server/models/Property.js#L22-L99)
- User: firstName, lastName, email, password (hashed), phone – defined in [server/models/User.js](server/models/User.js#L19-L81)
- SavedProperty: userId + propertyId composite key – defined in [server/models/SavedProperty.js](server/models/SavedProperty.js#L19-L65)

### Notes and Tips

- MySQL tables are auto-synced on server start via Sequelize sync (see [server/server.js](server/server.js#L62-L74)). Ensure the configured database exists and the DB user has create/alter rights.
- The property model marks image_data as required, but the create endpoint does not yet upload images; set a database default or relax the column if you do not store images.
- Docs generation: `npm run docs` (root) to generate TypeDoc output for the server, or `npm run docs --prefix server` for JSDoc docs.

### Docker / Swarm

- Images: `lexstate_client:latest` (static SPA via Nginx), `lexstate_server:latest` (API), `mysql:8.0`.
- Stack file: [docker-stack.yml](docker-stack.yml) defines services, networks, and MySQL volume (`mysql_data`).
- Build locally before deploy (swarm won’t build):
  - `docker build -t lexstate_server:latest ./server`
  - `docker build -t lexstate_client:latest ./client`
- Deploy: `docker stack deploy -c docker-stack.yml lexstate`
- DB data persists via named volume; removing it will recreate schema on next deploy.
- Known issue: If client API env vars are missing/mis-set at build time, the SPA will call port 80 and get 405 from Nginx. Set `VITE_API_HOST` to the reachable API host (e.g., `http://<node-ip>`) and `VITE_API_PORT=5000` when building the client image.
