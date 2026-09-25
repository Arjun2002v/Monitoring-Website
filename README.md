# Monitoring Website API

This project is a website uptime-monitoring API built with Express, PostgreSQL, Prisma, Redis, and BullMQ.

## How the application works

The application supports two monitoring modes. BullMQ is the default; the in-process scheduler is available as a learning alternative.

### Default BullMQ flow

1. The API starts from `src/server.js` on port `5001`.
2. `POST /api/monitors` creates a monitor in PostgreSQL.
3. The monitor service adds a repeatable BullMQ job for that monitor using its interval.
4. Redis holds the `monitor-checks` queue and its recurring jobs.
5. `src/workers/monitor-worker.js` receives each job and checks the monitor URL.
6. The response time and HTTP status are stored in `MonitorCheck`.
7. The monitor status is updated to `UP` or `DOWN`.
8. A transition to `DOWN` creates an open `Incident`.
9. A transition from `DOWN` to `UP` resolves the open incident.
10. If a BullMQ job fails, its job ID, URL, attempt count, and error message are
    added to the `monitor-failed` queue for separate failure handling.

BullMQ repeatable jobs provide the default recurring execution. Use this mode for normal operation.

## Requirements

- Node.js 18 or newer
- Docker Desktop
- npm

## Setup

Install dependencies:

```bash
npm install
```

Start PostgreSQL and Redis for BullMQ mode:

```bash
docker compose up -d
```

The services use these local ports:

- PostgreSQL: `localhost:5432`
- Redis: `localhost:6123` mapped to Redis container port `6379`

Set `.env` to point to the PostgreSQL database. Scheduler mode is disabled by default:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/monitor_uptime"
# Set to true only when using the learning scheduler instead of BullMQ.
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

The worker must remain running for queued website checks to execute. Redis must also be running.

### Scheduler learning mode

To study the simpler `setInterval` approach, set this in `.env`:

```env
ENABLE_SCHEDULER=true
```

Restart the API after changing the setting. In this mode, the API loads existing monitors at startup, checks each one immediately, and repeats checks using its interval. PostgreSQL is required, but Redis and the BullMQ worker are not. BullMQ jobs are not added for newly created monitors in this mode, so restart the API after creating a monitor. Do not run the BullMQ worker for the same monitors while scheduler mode is enabled, or checks will be duplicated.

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

The interval is measured in seconds. In BullMQ mode, creating the monitor also creates its repeatable check job. In scheduler mode, the monitor is picked up after the API restarts.

### List monitors

```http
GET /api/monitors
```

### Update a monitor

```http
PUT /api/monitors/:id
Content-Type: application/json
```

```json
{
  "name": "Updated website name",
  "url": "https://example.com",
  "interval": 120
}
```

Updating a monitor also refreshes its recurring BullMQ schedule.

### Delete a monitor

```http
DELETE /api/monitors/:id
```

Deleting a monitor removes its recurring BullMQ schedule and its database record.
Related checks and incidents are removed by the database relationship cascade.

### Check a website immediately

```http
POST /api/monitors/check
Content-Type: application/json
```

This endpoint checks the URL and stores a result immediately. Automatic status and incident transitions are handled by the BullMQ worker or learning scheduler.

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
  controllers/monitor.controllers.js API handlers
  routes/monitor.routes.js          Monitor routes
  services/monitor.service.js       Checks and database operations
  services/monitor.schedular.js     Optional in-process learning scheduler
  queues/monitor-queue.js           BullMQ check and failed-job queues
  workers/monitor-worker.js         Check, incident, and failure handling
prisma/schema.prisma                Database schema
docker-compose.yml                  PostgreSQL and Redis services
```

## Useful commands

```bash
npm start                 # Start the API
npm run dev               # Start the API with Node watch mode
npm run worker            # Start the BullMQ worker
npm run prisma:generate   # Generate Prisma Client
npx prisma db push        # Apply the Prisma schema to PostgreSQL
```

## Current limitations

- Newly created repeatable jobs are added when the monitor is created; existing monitors need their jobs recreated if Redis data is cleared.
- BullMQ mode requires the API, Redis, and worker to be running.
- The Docker setup exposes Redis on host port `6123`; the worker uses that port, while the queue producer currently uses `localhost:6379`. Align those queue connection settings when running the BullMQ API flow with Docker.
- Scheduler mode only loads monitors at API startup.
- The immediate `/api/monitors/check` endpoint stores a check but does not update monitor status or create or resolve incidents.
- Authentication and authorization are not implemented.
- Failed jobs are copied to `monitor-failed`, but no consumer is implemented for that queue yet.

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
