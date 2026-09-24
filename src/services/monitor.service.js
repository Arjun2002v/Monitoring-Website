// Shared Prisma client used for all monitor database operations.
const prisma = require("../prisma");
const { scheduleMonitor } = require("../queues/monitor-queue");





// Creates a monitor using the URL, display name, and check interval supplied by the client.
const createMonitor = async (monitorData) => {
    const newMonitor = await prisma.monitor.create({
        data: {
            name: monitorData.name,
            url: monitorData.url,
            interval: monitorData.interval
        }
    });

    await scheduleMonitor(newMonitor);

    return newMonitor;
};

// Checks whether a website is reachable and measures the request duration.
const checkWebsite = async (url) => {

    // Start timing immediately before the outbound request.
    const startTime = Date.now()

    try{

        const check = await fetch(url)

        // A successful HTTP response means the website is considered up.
        const totalTime = Date.now() - startTime

        return {
            isUp:check.ok,
        totalTime,
        status:check.status
        }


    } catch(error){
             // Network failures are returned as a down result instead of stopping the worker.
             const totalTime = Date.now() - startTime
             return {
            isUp:false,
            totalTime,
            status:null,
            error:error.message
            }


    }

    
}

const deleteMonitor = async (monitorId) => {
    await removeMonitorSchedule(monitorId);

    const deletedMonitor = await prisma.monitor.delete({
        where: {
            id: Number(monitorId)   
        }
    });

    return deletedMonitor;
};

// Stores one website check in the MonitorCheck table.
const storeResults =async (monitorId,result)=>{
    const results = await prisma.monitorCheck.create( {
        data:{

            // Convert request values to the numeric database types.
            monitorId :Number(monitorId),
             isUp: result.isUp,
            responseTime: result.totalTime,
            statusCode: result.status,
            checkedAt: new Date()
        }
    })

    return results
}

// Updates the monitor's latest overall status.
const updateMonitorStatus =async (monitorId,status)=>{

    const result = await prisma.monitor.update({
        where:{
            id:Number(monitorId)
        },
        data:{
            status:status
        }
    })
   

    return result
}
const updateMonitor = async (monitorId, monitorData) => {
    const updatedMonitor = await prisma.monitor.update({
        where: {
            id: Number(monitorId)
        },
        data: {
            name: monitorData.name,
            url: monitorData.url,
            interval: monitorData.interval
        }
    });

    await scheduleMonitor(updatedMonitor);

    return updatedMonitor;
};
// Retrieves a single monitor by its ID.
const getMonitorsById =async (id) =>{
    const result = await prisma.monitor.findUnique({
        where:{
            id:Number(id)
        }
    })
    return result
}

// Retrieves all monitors with the newest monitors first.
const getMonitors =async () =>{

   const result = await prisma.monitor.findMany({
    orderBy:{
        createdAt:"desc"
    }
   })
return result
}


// Creates an incident record for a monitor when it enters a down state.
const incidentMonitor = async (id) => {

    const result = await prisma.Incident.create({
        data:{
            monitorId:Number(id),
            resolvedAt:null
        }
    })

    return result

    
}

// Finds the open incident for a monitor, if one exists.
const getIncidentMonitors = async(id)=>{
    const result = await prisma.Incident.findFirst({
        where:{
            monitorId:Number(id),
            resolvedAt: null
        }
    })

    return result
}


// Marks the monitor's open incident as resolved when the website recovers.
const resolveOpenIncidents = async (monitorId) =>{
    const incidents = await getIncidentMonitors(monitorId)

    if(!incidents){
        return null
    }
    const result = await prisma.Incident.update({
        where:{
            id:incidents.id
        },
        data:{
            resolvedAt:new Date()
        }

    })
    return result
}


module.exports={createMonitor,checkWebsite,updateMonitor,storeResults,getMonitors,getMonitorsById,deleteMonitor, updateMonitorStatus,incidentMonitor,getIncidentMonitors,resolveOpenIncidents}
