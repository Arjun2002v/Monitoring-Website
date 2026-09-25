const { Worker } = require("bullmq");

const {
    checkWebsite,
    storeResults,
    updateMonitorStatus,
    getMonitorsById,
    resolveOpenIncidents,
    incidentMonitor
} = require("../services/monitor.service");
const { monitorFailed } = require("../queues/monitor-queue");



const worker = new Worker(
    "monitor-checks",
    async (job) => {

        const { monitorId, url } = job.data;

        console.log(`Checking ${url}`);

        // 1. Check website
        const result = await checkWebsite(url);

        // Read the status saved before this check so transitions can be detected.
        const monitor = await getMonitorsById(monitorId);
        const oldStatus = monitor?.status;

        // 2. Store check result
        const savedResult = await storeResults(
            monitorId,
            result
        );

        // 3. Determine new status
        const newStatus = result.isUp ? "UP" : "DOWN";

        // 4. Update monitor status
        const updatedMonitor = await updateMonitorStatus(
            monitorId,
            newStatus
        );

        // 5. Compare monitor status
// DOWN → UP
let resolvedIncident = null;
if (oldStatus === "DOWN" && newStatus === "UP") {
 resolvedIncident = await resolveOpenIncidents(monitorId)
    // resolve incident
}

// UP → DOWN
let createdIncident = null;
if (oldStatus !== "DOWN" && newStatus === "DOWN") {
    // create incident
 createdIncident = await incidentMonitor(monitorId)
}


        console.log(
            "Saved result:",
            savedResult
        );

        console.log(
            "Updated monitor:",
            updatedMonitor
        );
        console.log("Created incident:", createdIncident);
        console.log("Resolved incident:", resolvedIncident);
    },
    {
        connection: {
            host: "127.0.0.1",
            port: 6123
        }
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", async (job, error) => {

    const failedJob = {
        jobId: job.id,
        url: job.data.url,
        attemptMade: job.attemptsMade,
        errorMessage: error.message
    };

    await monitorFailed.add(
        "failed-monitor",       
        failedJob
    )

    console.log(failedJob);
});
