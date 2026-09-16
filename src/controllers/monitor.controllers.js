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

    const monitor = monitorService({
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
 module.exports = {
    createMonitor,
};