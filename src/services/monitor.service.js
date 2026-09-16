const monitors = [];

const createMonitor = (monitorData)=>{
    const newMonitor = {
        id:monitors.length -1,
        name:monitorData.name,
        url:monitorData.url
    }
    monitors.push(newMonitor)
    return newMonitor
}

module.exports={createMonitor}