const { Queue } = require("bullmq");

const monitorQueue = new Queue("monitor-checks", {
    connection: {
        host: "localhost",
        port: 6379
    }
});

const monitorFailed = new Queue("monitor-failed",{
    connection:{
        host:"localhost",
        port:6379
    }
})

const scheduleMonitor = async (monitor) => {
    await monitorQueue.upsertJobScheduler(
        `monitor-${monitor.id}`,
        {
            every: monitor.interval * 1000
        },
        {
            name: "check-website",
            data: {
                monitorId: monitor.id,
                url: monitor.url
            }
        }
    );
};

const removeMonitorSchedule = async (monitorId) => {
    await monitorQueue.removeJobScheduler(
        `monitor-${monitorId}`
    );
};

module.exports = {
    monitorQueue,
    scheduleMonitor,
    removeMonitorSchedule ,
    monitorFailed
};