# Monitoring Website API

This project is the backend for a website uptime-monitoring application. It uses Express for the HTTP API, PostgreSQL for persistence, and Prisma as the database client.

## Current process

1. The server starts from `src/server.js` on port `5001` by default.
2. Express enables CORS and JSON request parsing.
3. Monitor routes are mounted at `/api/monitors`.
4. A monitor can be created with a name, URL, and checking interval.
5. A website check sends a request to the supplied URL and measures the response time.
6. The check result is stored in the `MonitorCheck` table and linked to the monitor.
7. The scheduler currently runs every 10 seconds and only logs `Checking monitors...`; automatic monitor checks are not implemented yet.

## Requirements

- Node.js 18 or newer
- Docker Desktop, or a local PostgreSQL  database
- npm

## Setup

Install dependencies:

```bash
npm install
```

Start PostgreSQL with Docker:

```bash
docker compose up -d
```

Set `DATABASE_URL` in `.env`. For the included Docker configuration, use:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/monitor_uptime"
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Create or update the database schema as needed with Prisma:

```bash
npx prisma db push
```

Start the API:

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

The API is available at `http://localhost:5001`.

## API endpoints

### Health check

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

### Create a monitor

```http
POST /api/monitors
Content-Type: application/json
```

Request body:

```json
{
  "name": "Example website",
  "url": "https://example.com",
  "interval": 60
}
```

### List monitors

```http
GET /api/monitors
```

### Check a website

```http
POST /api/monitors/check
Content-Type: application/json
```

Request body:

```json
{
  "monitorId": 1,
  "url": "https://example.com"
}
```

The API checks the URL, measures the response time, and stores the result for the supplied monitor.

### Store an existing result

```http
POST /api/monitors/store
Content-Type: application/json
```

Request body:

```json
{
  "monitorId": 1,
  "result": {
    "isUp": true,
    "totalTime": 120,
    "status": 200
  }
}
```

## Database models

- `Monitor` stores the monitored URL, name, interval, status, and creation time.
- `MonitorCheck` stores each check result, including uptime status, response time, HTTP status code, and timestamp.

Each monitor can have many check results. Deleting a monitor also deletes its checks.

## Project structure

```text
src/
  server.js                         Express application entry point
  prisma.js                         Prisma PostgreSQL client
  controllers/monitor.controllers.js
                                    HTTP request handlers
  routes/monitor.routes.js          Monitor API routes
  services/monitor.service.js       Database and website-check logic
  services/monitor.schedular.js     Current scheduler placeholder
prisma/schema.prisma                Database schema
docker-compose.yml                  PostgreSQL container configuration
```

## Current limitations

- The scheduler does not yet load monitors or run checks automatically.
- Monitor status is not updated after a check.
- The API currently expects a valid existing `monitorId` when storing a result.
- Authentication and authorization are not implemented.
- The database must be running before monitor creation or result storage can work.

## Troubleshooting

If Prisma reports that `.prisma/client/default` cannot be found, regenerate the client:

```bash
npm run prisma:generate
```

If the server reports invalid JSON, remove trailing commas and use double-quoted property names. For example, this is valid:

```json
{
  "name": "Example website",
  "url": "https://example.com",
  "interval": 60
}
```
