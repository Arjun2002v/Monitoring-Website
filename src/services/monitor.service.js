const monitors = [];

const checkResults = [];

const createMonitor = (monitorData)=>{
    const newMonitor = {
        id:monitors.length +1,
        name:monitorData.name,
        url:monitorData.url
    }
    monitors.push(newMonitor)
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

const storeResults = (monitorId,result)=>{
    const results = {
        monitorsId:monitorId,
         isUp: result.isUp,
        responseTime: result.totalTime,
        statusCode: result.status,
        checkedAt: new Date()
    }
    checkResults.push(results)
    return results
}

const getMonitors = () =>{

    console.log(monitors)
    return monitors

}

module.exports={createMonitor,checkWebsite,storeResults,getMonitors}
