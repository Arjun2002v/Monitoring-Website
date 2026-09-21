const monitorService = require("./monitor.service");

// Learning-only alternative to the BullMQ worker. Enable with:
// ENABLE_SCHEDULER=true
const startMonitoring = async () => {
    const monitors = await monitorService.getMonitors();

    for (const monitor of monitors) {
        const runCheck = async () => {
            try {
                // Check the website and save the response details.
                const result = await monitorService.checkWebsite(monitor.url);
                await monitorService.storeResults(monitor.id, result);

                // Compare the saved status with the new status.
                const oldStatus = monitor.status;
                const newStatus = result.isUp ? "UP" : "DOWN";
                await monitorService.updateMonitorStatus(monitor.id, newStatus);
                monitor.status = newStatus;

                // Create an incident when a monitor goes down.
                if (oldStatus !== "DOWN" && newStatus === "DOWN") {
                    await monitorService.incidentMonitor(monitor.id);
                }

                // Resolve the open incident when the monitor recovers.
                if (oldStatus === "DOWN" && newStatus === "UP") {
                    await monitorService.resolveOpenIncidents(monitor.id);
                }

                console.log(
                    `${monitor.name}: ${newStatus} - ${result.totalTime}ms`
                );
            } catch (error) {
                console.error(`Error checking ${monitor.name}:`, error.message);
            }
        };

        // Run once immediately, then repeat using the monitor's interval in seconds.
        await runCheck();
        setInterval(runCheck, Number(monitor.interval) * 1000);
    }
};

module.exports = { startMonitoring };
