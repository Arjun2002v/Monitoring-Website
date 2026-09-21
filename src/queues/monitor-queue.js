const { Queue } = require("bullmq");

const monitorQueue = new Queue("monitor-checks", {
    connection: {
        // Use IPv4 explicitly so Node does not try an unavailable IPv6 ::1 listener.
        host: "127.0.0.1",
        port: 6123
    }
});

module.exports = monitorQueue;
