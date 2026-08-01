# Backend Setup (MVC + MySQL)

## Architecture

```
Client (React admin pages) → fetch("/api/...")
        ↓
server/routes      → server/controllers   → server/models   → MySQL (knex)
```

- **routes/** – URL → controller mapping (`/api/products`, `/api/orders`, ...)
- **controllers/** – request/response handling, validation
- **models/** – all knex/MySQL queries (CRUD)
- **middleware/auth.middleware.ts** – JWT check (`requireAuth`, `requireAdmin`)
- **migrations/** + **seeds/** – schema + starter data

## 1. Install new dependencies

```bash
pnpm install
# (adds bcryptjs, jsonwebtoken + their @types, already in package.json)
```

## 2. Configure `.env`

```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=firecrackers_shop
JWT_SECRET=some-long-random-string
```

Create the database first:
```sql
CREATE DATABASE firecrackers_shop;
```

## 3. Run migrations + seed data

```bash
pnpm db:migrate
pnpm db:seed
```

This creates: `categories`, `products`, `services`, `users`, `orders`, `company_settings`,
and seeds them with the same demo data the UI used to show as mock data — including a
default admin login:

```
email: admin@firecrackers.com
password: admin123
```

## 4. Run the app

```bash
pnpm dev
```

Vite serves the SPA and mounts the Express app on the same port (see `vite.config.ts`),
so the admin panel at `/admin` now talks to real `/api/...` endpoints instead of local
mock state.

## API summary

| Resource   | Routes                                                              | Auth        |
|------------|----------------------------------------------------------------------|-------------|
| Auth       | `POST /api/auth/login`, `POST /api/auth/signup`, `GET /api/auth/me`  | signup/login open |
| Categories | `GET/POST /api/categories`, `PUT/DELETE /api/categories/:id`         | writes = admin |
| Products   | `GET/POST /api/products`, `PUT/DELETE /api/products/:id`             | writes = admin |
| Services   | `GET/POST /api/services`, `PUT/DELETE /api/services/:id`             | writes = admin |
| Orders     | `GET /api/orders`, `POST /api/orders`, `PUT /api/orders/:id/status`  | list/update = admin |
| Users      | `GET/POST /api/users`, `PUT/DELETE /api/users/:id`                   | admin only |
| Company    | `GET /api/company`, `PUT /api/company`                               | write = admin |
| Email (SMTP) | `GET/POST/PUT /api/email-settings`, `POST /api/email-settings/test`, `POST /api/email-settings/send-test`| admin only |
| Dashboard  | `GET /api/dashboard/stats`                                           | admin only |
| Reports    | `GET /api/reports/summary?from&to&status&category`                   | admin only |

The admin panel (`useAdminAuth`) now stores a real JWT in `localStorage` (`admin_token`)
issued by `/api/auth/login`, and every admin page (`Categories`, `Products`, `Services`,
`Orders`, `Users`, `Company`, `Dashboard`, `Report`) fetches/writes through `client/lib/api.ts`.
