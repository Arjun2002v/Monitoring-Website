
// Service methods used to load monitors, check websites, and save results.
const monitorService = require("./monitor.service");


// Loads all configured monitors and starts a repeating check for each one.
const startMonitoring = async () => {

    try{
        // Each monitor gets its own interval based on its configured period.
        const monitors = await monitorService.getMonitors()
        for ( const monitor of monitors){
   console.log(
                `Starting monitor: ${monitor.name} every ${monitor.interval} seconds`
            );

            // A single check records the current status and response time.
            const runCheck = async () =>{
                try{
                    
                    const result = await monitorService.checkWebsite(monitor.url)

                    await monitorService.storeResults(monitor.id,result)


                        console.log(
                        `${monitor.name}: ${
                            result.isUp ? "UP" : "DOWN"
                        } - ${result.totalTime}ms`
                    );

             }catch(error){
                      console.error(
                        `Error checking ${monitor.name}:`,
                        error.message
                    );

             }
             // Convert the interval from seconds to milliseconds for setInterval.
             setInterval(
                runCheck,
                   monitor.interval * 1000
             )
            }
        }
    } catch(error){

          console.error(
                        `Error checking ${monitor.name}:`,
                        error.message
                    );

    }

 

};

module.exports = {
    startMonitoring
};
