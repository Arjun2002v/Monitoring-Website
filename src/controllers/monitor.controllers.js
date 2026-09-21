const monitorService = require("../services/monitor.service")
const monitorQueue = require("../queues/monitor-queue")


const createMonitor = async (req,res)=>{
    const{url,name,interval} = req.body;

    try{
           if(!url||!name||!interval){
        return res.status(400).json({
                        success: false,
                message: "Name, URL and interval are required",
        })


    }

    const monitor = await monitorService.createMonitor({
        url,name,interval
    })

    // BullMQ replaces the old scheduler by running checks repeatedly for this monitor.
    await monitorQueue.add(
        "check-website",
        { monitorId: monitor.id, url: monitor.url },
        { repeat: { every: Number(interval) * 1000 } }
    )
    return res.status(201).json({
        success:true,
        message:"Monitor Uploaded SuccessFully",
        data:monitor
    })

    }
   catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

 }

 const checkWebsite = async (req,res) =>{
    const {url,monitorId } = req.body || {}
    console.log(url)

    try{
         if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL not found"
            });
        }

    const result = await monitorService.checkWebsite(url)

    const storeResults = await monitorService.storeResults(monitorId,result)

    res.status(200).json({
        success:true,
        message:"Response time found",
        data:storeResults

    })

    }catch(error){
               res.status(500).json({
            success:false,
            message:error.message
        })

    }
  
 }

 const storeResults = async (req, res) => {
    const { monitorId, result } = req.body || {};

    if (!result || typeof result !== "object") {
        return res.status(400).json({
            success: false,
            message: "A result object is required"
        });
    }

    const storedResult = await monitorService.storeResults(monitorId, result);
    return res.status(201).json({
        success: true,
        data: storedResult
    });
 };

 const getAllMonitors = async (_,res)=>{
    try{
         const result = await monitorService.getMonitors()
         res.status(200).json({
            message:result,
            success:"true"
         })

    }catch(error){
        res.status(500).json({
               success:"false",
            message:error
        })

    }
   

 }

 module.exports = {
    createMonitor,
    checkWebsite,
    storeResults,
    getAllMonitors
};
