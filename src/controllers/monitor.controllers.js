const monitorService = require("../services/monitor.service")


const createMonitor = async (req,res)=>{
    const{url,name,interval} = req.body;

    try{
           if(!url||!name||!interval){
        return res.status(400).json({
                        success: false,
                message: "Name, URL and interval are required",
        })


    }

    const monitor = monitorService.createMonitor({
        url,name,interval
    })
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

 const storeResults = (req, res) => {
    const { monitorId, result } = req.body || {};

    if (!result || typeof result !== "object") {
        return res.status(400).json({
            success: false,
            message: "A result object is required"
        });
    }

    const storedResult = monitorService.storeResults(monitorId, result);
    return res.status(201).json({
        success: true,
        data: storedResult
    });
 };

 const getAllMonitors = (_,res)=>{
    try{
         const result = monitorService.getMonitors()
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
const deleteMonitorController = async (req, res) => {
    try {
        const deletedMonitor = await monitorService.deleteMonitor(req.params.id);

        res.json({
            success: true,
            data: deletedMonitor
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete monitor"
        });
    }
};

const updateMonitorController = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedMonitor = await monitorService.updateMonitor(
            id,
            req.body
        );

        res.json({
            success: true,
            data: updatedMonitor
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update monitor"
        });
    }
};

 module.exports = {
    createMonitor,
    checkWebsite,
    storeResults,
    getAllMonitors,
    deleteMonitorController,
    updateMonitorController
    
};
