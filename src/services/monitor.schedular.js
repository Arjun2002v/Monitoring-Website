
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
                    
                    // Check the URL and persist the response details.
                    const result = await monitorService.checkWebsite(monitor.url)

                    await monitorService.storeResults(monitor.id,result)
                    
                    // Convert the boolean result into the monitor status used by the database.
                    const status = result.isUp ? "Up" :"Down"

                    await monitorService.updateMonitorStatus(status)

                    // Resolve or create incidents when the monitor changes state.
                    if(status==="Down" && monitor.status==="Up"){
                          await monitorService.resolveOpenIncidents(monitor.id)

                    }
                    if(status==="Up" && monitor.status==="Down"){
                        await monitorService.incidentMonitor(monitor.id)
                    }


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
             // Convert the configured interval from seconds to milliseconds.
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
