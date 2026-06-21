import type{ Request, Response } from "express";
import { ViolationModel } from "../models/Violation.js";
// Main Endpoints
export const getViolations = async(req:Request, res: Response)=>{
    try{
        const violations = await ViolationModel.find().sort({detectedAt: -1,});
        return res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            count: violations.length,
            data: violations,
        });
    } 
    catch (err) {
        console.error("Get Violations Error:", err);
        return res.status(500).json({
          success: false,   
          message: "Failed to fetch violations",
        });
    }
};
export const getViolationById = async ( req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const violation =
      await ViolationModel.findById(id)
        .lean();

    if (!violation) {
      return res.status(404).json({
        success: false,
        message:
          "Violation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: violation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch violation",
    });
  }
};
export const searchViolations = async (req: Request, res: Response) => {
    try {
      const query =
        String(req.query.q || "")
          .trim();

      if (!query) {
        return res.status(400).json({
          success: false,
          message:
            "Search query required",
        });
      }

      const results =
        await ViolationModel.find({
          $or: [
            {
              plateNumber: {
                $regex: query,
                $options: "i",
              },
            },

            {
              vehicleType: {
                $regex: query,
                $options: "i",
              },
            },

            {
              violationType: {
                $regex: query,
                $options: "i",
              },
            },
          ],
        })
          .sort({
            detectedAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        count:
          results.length,
        data: results,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Search failed",
      });
    }
};
export const updateViolationStatus = async (req: Request, res: Response )=> {
    try {
      const { id } =
        req.params;

      const { status } =
        req.body;

      const allowedStatuses =
        [
          "Pending",
          "Confirmed",
          "Dismissed",
        ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status",
        });
      }

      const updatedViolation =
        await ViolationModel.findByIdAndUpdate(
          id,
          {
            status,
          },
          {
            new: true,
          }
        ).lean();

      if (!updatedViolation) {
        return res.status(404).json({
          success: false,
          message:
            "Violation not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Status updated successfully",
        data:
          updatedViolation,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to update status",
      });
    }
  };


// Other endpoints
export const getOverview = async ( req: Request, res: Response ) => { 
    try { 
        const [ totalDetections, confirmedViolations, dismissedCases, confidenceData, ] = await Promise.all(
            [ ViolationModel.countDocuments(), 
            ViolationModel.countDocuments({ status: "Confirmed", }),
            ViolationModel.countDocuments({ status: "Dismissed", }), 
            ViolationModel.aggregate([ 
                { 
                    $group: { 
                        _id: null, 
                        avgConfidence: 
                        { 
                            $avg: "$confidence", 
                        }, 
                    }, 
                }, 
            ]), 
        ]); 
        return res.status(200).json(
            { success: true, 
                data: { totalDetections, confirmedViolations, dismissedCases, averageConfidence: confidenceData[0] ?.avgConfidence || 0, }, }
            ); 
    } 
    catch (error) { 
        console.error(error); 
        return res.status(500).json(
            { success: false, 
                message: "Failed to fetch overview", 
            }
        ); 
    } 
};
export const getViolationTrends = async ( req: Request, res: Response ) => { 
    try { 
        const trends = await ViolationModel.aggregate([ 
            { $group: { 
                _id: { 
                    $dateToString: { 
                        format: "%Y-%m-%d", 
                        date: "$detectedAt", 
                    }, 
                }, 
                count: { $sum: 1, }, 
            }, 
            }, 
            { 
                $sort: { _id: 1, }, 
            }, 
        ]); 
        const formattedTrends = trends.map(
          trend => ({
            date: trend._id,
            count: trend.count,
          })
        );
        return res.status(200).json({ 
            success: true, 
            data: formattedTrends, }); 
    } 
    catch (error) { 
        console.error(error); 
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch trends", 
        }); 
    } 
}; 
export const getViolationDistribution = async ( req: Request, res: Response ) => { 
    try { 
        const distribution = await ViolationModel.aggregate([ 
            { $group: { 
                _id: "$violationType", 
                count: { $sum: 1, }, 
                }, 
            }, 
        ]); 
        const formattedDistribution =
        distribution.map(item => ({
          type: item._id,
          count: item.count,
        }));
        return res.status(200).json(
            { 
                success: true, 
                data: formattedDistribution, 
            }
        ); 
    } 
    catch (error) { 
        console.error(error); 
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch distribution", }
        ); 
    } 
}; 
export const getRecentViolations = async ( req: Request, res: Response ) => { 
    try { 
        const data = await ViolationModel.find() .sort({ detectedAt: -1, }) .limit(20); 
        return res.status(200).json({ 
            success: true, 
            data, }
        ); 
    } 
    catch (error) { 
        console.error(error); 
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch recent activity", }
        ); 
    } 
}; 
 
export const getTopViolationTypes = async ( req: Request, res: Response ) => { 
    try { 
        const data = await ViolationModel.aggregate([ 
            { $group: { 
                _id: "$violationType", 
                count: { $sum: 1, }, 
                }, 
            }, 
            { 
                $sort: { count: -1, }, 
            }, 
            { $limit: 10, }, 
        ]); 
        return res.status(200).json(
            { 
                success: true, 
                data, 
            }
        ); 
    } 
    catch (error) { 
        console.error(error); 
        return res.status(500).json(
            { 
                success: false, 
                message: "Failed to fetch violation types", 
            }
        ); 
    } 
}; 
export const getRepeatOffenders = async ( req: Request, res: Response ) => { 
    try { 
        const offenders = await ViolationModel.aggregate([ 
            { $match: 
                { 
                    plateNumber: { $ne: "", }, 
                }, 
            }, 
            { $group: { 
                _id: "$plateNumber", 
                count: { $sum: 1, }, }, 
            },
            { 
                $sort: { count: -1, }, 
            }, 
            { $limit: 10, }, 
        ]); 
        return res.status(200).json(
            { 
                success: true, 
                data: offenders, 
            }
        ); 
    } 
    catch (error) { 
        console.error(error); 
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch offenders", 
        }); 
    } 
};
export const getTopLocations = async (req: Request, res: Response ) => {
    try {
      const locations =
        await ViolationModel.aggregate([
          {
            $group: {
              _id: "$location",
              count: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
          {
            $limit: 10,
          },
        ]);

      return res.status(200).json({
        success: true,
        data: locations.map(
          location => ({
            location:
              location._id,
            count:
              location.count,
          })
        ),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch locations",
      });
    }
  
};
