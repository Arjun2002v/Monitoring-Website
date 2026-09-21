# Monitoring Website API

This project is a website uptime-monitoring API built with Express, PostgreSQL, Prisma, Redis, and BullMQ.

## How the application works

The application uses a queue worker instead of an in-process scheduler:

1. The API starts from `src/server.js` on port `5001`.
2. `POST /api/monitors` creates a monitor in PostgreSQL.
3. The controller adds a repeatable BullMQ job for that monitor using its interval.
4. Redis holds the `monitor-checks` queue.
5. `src/workers/monitor-worker.js` receives each job and checks the monitor URL.
6. The response time and HTTP status are stored in `MonitorCheck`.
7. The monitor status is updated to `UP` or `DOWN`.
8. A transition to `DOWN` creates an open `Incident`.
9. A transition from `DOWN` to `UP` resolves the open incident.

BullMQ repeatable jobs provide the default recurring execution. An in-process scheduler is also included for learning and can be enabled with `ENABLE_SCHEDULER=true`. Use only one approach at a time.

## Requirements

- Node.js 18 or newer
- Docker Desktop
- npm

## Setup

Install dependencies:

```bash
npm install
```

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

The services use these local ports:

- PostgreSQL: `localhost:5432`
- Redis: `localhost:6123` mapped to Redis container port `6379`

Set `.env` to point to the PostgreSQL database:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/monitor_uptime"
# Optional learning mode; omit this or set it to false to use BullMQ.
ENABLE_SCHEDULER=false
```

Generate Prisma Client and apply the schema:

```bash
npm run prisma:generate
npx prisma db push
```

Start the API:

```bash
npm start
```

Start the BullMQ worker in a second terminal:

```bash
npm run worker
```

The worker must remain running for queued website checks to execute.

### Scheduler learning mode

To study the simpler `setInterval` approach, set this in `.env`:

```env
ENABLE_SCHEDULER=true
```

Restart the API after changing the setting. In this mode, the API loads existing monitors at startup, checks each one immediately, and repeats checks using its interval. BullMQ jobs are not added for newly created monitors in this mode, so restart the API after creating a monitor. Do not run the BullMQ worker for the same monitors while scheduler mode is enabled, or checks will be duplicated.

## API endpoints

### Health check

```http
GET /api/health
```

### Create a monitor

```http
POST /api/monitors
Content-Type: application/json
```

```json
{
  "name": "Example website",
  "url": "https://example.com",
  "interval": 60
}
```

The interval is measured in seconds. Creating the monitor also creates its repeatable BullMQ check job.

### List monitors

```http
GET /api/monitors
```

### Check a website immediately

```http
POST /api/monitors/check
Content-Type: application/json
```

```json
{
  "monitorId": 1,
  "url": "https://example.com"
}
```

### Store an existing result

```http
POST /api/monitors/store
Content-Type: application/json
```

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

- `Monitor` stores the monitored URL, name, interval, current status, and creation time.
- `MonitorCheck` stores every check result, response time, HTTP status code, and timestamp.
- `Incident` stores an outage start time and remains open until `resolvedAt` is set.

## Project structure

```text
src/
  server.js                         Express API entry point
  prisma.js                         Prisma PostgreSQL client
  controllers/monitor.controllers.js API handlers and queue creation
  routes/monitor.routes.js          Monitor routes
  services/monitor.service.js       Checks and database operations
  services/monitor.schedular.js     Optional in-process learning scheduler
  queues/monitor-queue.js           BullMQ queue connection
  workers/monitor-worker.js         Check execution and incident handling
prisma/schema.prisma                Database schema
docker-compose.yml                  PostgreSQL and Redis services
```

## Useful commands

```bash
npm start                 # Start the API
npm run dev               # Start the API with Node watch mode
npm run worker            # Start the BullMQ worker
npm run prisma:generate  # Generate Prisma Client
npx prisma db push       # Apply the Prisma schema to PostgreSQL
```

## Current limitations

- Newly created repeatable jobs are added when the monitor is created; existing monitors need their jobs recreated if Redis data is cleared.
- The worker and API must both be running for automatic checks.
- Scheduler mode only loads monitors at API startup.
- Authentication and authorization are not implemented.
- Monitor deletion and repeatable-job cleanup are not implemented yet.

## Troubleshooting

If Redis reports `ECONNREFUSED`, start it with:

```bash
docker compose up -d redis
```

If Prisma reports a missing generated client:

```bash
npm run prisma:generate
```

JSON request bodies must use double-quoted property names and no trailing commas.
