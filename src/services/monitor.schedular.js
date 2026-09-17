

const startMonitoring = () => {

    setInterval(() => {
        console.log("Checking monitors...");
    }, 10000);

};

module.exports = {
    startMonitoring
};