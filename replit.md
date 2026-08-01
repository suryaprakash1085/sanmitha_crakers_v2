# Sanmitha Crackers – Fireworks E-Commerce App

## Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express 5 (TypeScript, MVC pattern)
- **Database**: MySQL (Knex ORM, migrations in `server/migrations/`)
- **Auth**: JWT (`jsonwebtoken` + `bcryptjs`)

## Project Structure
```
client/          React frontend (pages, components, hooks, context)
server/          Express backend (routes, controllers, models, middleware)
shared/          Types shared between client and server
server.mjs       cPanel production entry point (import built server)
```

## Running on Replit (Development)
```
pnpm dev      # Starts Vite dev server on port 5000 (frontend + API together)
```
The Vite dev server proxies `/api/*` requests to the embedded Express app.

**Note:** `DATABASE_HOST` must be your actual MySQL server's public hostname or IP.
On Replit, `localhost` has no MySQL — set the host to your cPanel/remote server address.
The app frontend loads fully on Replit; only API calls that need the DB will error until
a real MySQL host is configured.

## Building for cPanel (Production)
```
npm run build    # Compiles client → dist/spa/ and server → dist/server/node-build.mjs
```
After building, cPanel starts `server.mjs`, which imports the compiled server.

## Environment Variables
| Key               | Description                        |
|-------------------|------------------------------------|
| DATABASE_HOST     | MySQL host (your remote/cPanel host, NOT localhost on Replit) |
| DATABASE_PORT     | MySQL port (3306)                  |
| DATABASE_NAME     | Database name                      |
| DATABASE_USER     | Database user                      |
| DATABASE_PASSWORD | Database password (secret)         |
| JWT_SECRET        | JWT signing secret (secret)        |
| PORT              | Server port (cPanel: 3001)         |
| NODE_ENV          | `development` or `production`      |

## Design Theme
- **User-facing pages**: White / light theme with festive pink-purple-orange gradient accents
- **3D animations**: Hero section has orbiting 3D ring animation (`Hero3D` component) + Tilt3D on cards
- **Admin panel**: White with purple/violet accents (unchanged)
- Key component files for design: `client/index.css`, `client/components/Layout.tsx`, `client/components/Navbar.tsx`, `client/components/Hero3D.tsx`

## Database
```
npm run db:migrate   # Run all pending migrations
npm run db:rollback  # Roll back last migration batch
npm run db:seed      # Seed the database
```

## cPanel Deployment
1. Upload project files to `sanmitha.suriyadev.xyz/`
2. In cPanel Node.js app: set startup file to `server.mjs`
3. Click **Run NPM Install**
4. Open cPanel terminal and run: `npm run build`
5. Click **Restart** in cPanel

## User Preferences
- Keep existing project structure and stack.
- User-side uses white/light theme with 3D animations.
