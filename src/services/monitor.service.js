const prisma = require("../prisma");





const createMonitor = async (monitorData)=>{
    const newMonitor =  await prisma.monitor.create(  {
     data:{
        name:monitorData.name,
        url:monitorData.url,
        interval:monitorData.interval
     }
    })

    return newMonitor
}

const checkWebsite = async (url) => {

    const startTime = Date.now()

    try{

        const check = await fetch(url)

        const totalTime = Date.now() - startTime

        return {
            isUp:check.ok,
        totalTime,
        status:check.status
        }


    } catch(error){
             const totalTime = Date.now() - startTime
             return {
            isUp:false,
            totalTime,
            status:null,
            error:error.message
            }


    }

    
}

const storeResults =async (monitorId,result)=>{
    const results = await prisma.monitorCheck.create( {
        data:{

            monitorId :Number(monitorId),
             isUp: result.isUp,
            responseTime: result.totalTime,
            statusCode: result.status,
            checkedAt: new Date()
        }
    })

    return results
}

const getMonitorsById =async (id) =>{
    const result = await prisma.monitor.findUnique({
        where:{
            monitorId:Number(id)
        }
    })
    return result
}

const getMonitors =async () =>{

   const result = await prisma.monitor.findMany({
    orderBy:{
        createdAt:"desc"
    }
   })
return result
}

module.exports={createMonitor,checkWebsite,storeResults,getMonitors,getMonitorsById}
