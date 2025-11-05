const WorkerModal = require("../modals/WorkerModal");
const bcrypt = require("bcryptjs");
const UserModal = require("../modals/UserModal");
const ReportModal = require("../modals/ReportModal");
const RequestModal = require("../modals/RequestModal");
const fs = require("fs").promises;
const Tesseract = require("tesseract.js");
const redisClient = require("../config/redisClient");

async function RegisterWorker(req, resp) {
  try {
    const {
      Name,
      MobileNo,
      ServiceType,
      ServiceId,
      Password,
      Address,
      pincode,
      Email,
      Latitude,
      Longitude,
    } = req.body;

    if (
      !Name ||
      !MobileNo ||
      !ServiceType ||
      !ServiceId ||
      !Password ||
      !Address ||
      !pincode ||
      !Email
    ) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const WorkerMobileExists = await WorkerModal.findOne({ MobileNo });
    const userMobileExists = await UserModal.findOne({ MobileNo });
    if (WorkerMobileExists || userMobileExists) {
      return resp.status(409).send({
        success: false,
        message: "Mobile number already exists, please login",
      });
    }
    const WorkerEmailExists = await WorkerModal.findOne({ Email });
    const userEmailExists = await UserModal.findOne({ Email });
    if (WorkerEmailExists || userEmailExists) {
      return resp.status(409).send({
        success: false,
        message: "Email Id already exists, please login",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newWorker = new WorkerModal({
      Name,
      MobileNo,
      ServiceType,
      ServiceId,
      Password: hashedPassword,
      Address,
      pincode,
      Email,
      coordinates: {
        type: "Point",
        coordinates: [Longitude, Latitude],
      },
    });
    await newWorker.save();

    resp.status(201).send({
      success: true,
      message: "Account created succesfully",
    });
  } catch (error) {
    resp.status(500).send({ success: false, error: "Internal server error" });
  }
}

async function CheckCity(req, resp) {
  try {
    const { wid } = req.params;
    const city = await WorkerModal.find({ _id: wid }).select("city");

    if (city && city.length > 0) {
      return resp.status(200).send({
        success: true,
        message: "city exist",
      });
    } else {
      return resp.status(200).send({
        success: false,
        message: "city do not exist",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "internal server error ",
    });
  }
}

async function Report(req, resp) {
  try {
    const { wid, rid } = req.params;
    const issueType = req.body.issueType;
    console.log(issueType);
    if (!issueType) {
      return resp.status(400).send({
        success: false,
        message: "please select the issue",
      });
    }

    // Find the report by requestId
    const existingReport = await ReportModal.findOne({ requestId: rid });

    if (existingReport) {
      // Check if the worker has already reported this request
      const workerAlreadyReported = existingReport.Report.some(
        (report) => report.worker.toString() === wid
      );

      if (workerAlreadyReported) {
        return resp.status(400).send({
          success: false,
          message: "You have already reported this request",
        });
      }

      // Add the new report to the existing document
      existingReport.Report.push({
        worker: wid,
        issueType,
      });

      await existingReport.save();

      return resp.status(200).send({
        success: true,
        message: "Request reported",
      });
    } else {
      // Create a new report document if none exists for the requestId
      const newReport = await ReportModal({
        requestId: rid,
        Report: [
          {
            worker: wid,
            IssueType: issueType,
          },
        ],
      }).save();

      return resp.status(200).send({
        success: true,
        report: newReport,
        message: "Request reported",
      });
    }
  } catch (error) {
    console.error(error);
    return resp.status(500).send({
      message: "Internal server error",
    });
  }
}

async function AcceptRequest(req, resp) {
  try {
    const { wid, rid } = req.params;
    const { EstimatedPrice, description } = req.body;

    if (!wid || !rid) {
      return resp.status(400).send({
        success: false,
        message: "Worker ID or Request ID is missing.",
      });
    }
    if (!EstimatedPrice) {
      return resp.status(400).send({
        success: false,
        message: "Estimated price is missing.",
      });
    }

    const existingAcceptance = await RequestModal.findOne({
      _id: rid,
      "acceptedBy.worker": wid,
    });

    if (existingAcceptance) {
      return resp.status(400).send({
        success: false,
        message: "You have already accepted this request",
      });
    }
    const existingrequest = await RequestModal.findOne({ _id: rid });

    if (
      existingrequest.status === "Assigned" ||
      existingrequest.status === "Deleted" ||
      existingrequest.status === "Completed"
    ) {
      return resp.status(400).send({
        success: false,
        message: "This request cannot be accepted",
      });
    }
    let updatedRequest;
    let date = new Date();
    if (existingrequest.personalRequestTo) {
      updatedRequest = await RequestModal.findByIdAndUpdate(
        rid,
        {
          $push: {
            acceptedBy: {
              worker: wid,
              estimatedPrice: EstimatedPrice,
              priceJustification: description,
              acceptedAt: date,
            },
          },
          status: "Assigned",
          assignedTo: wid,
          confirmedAt: date,
        },
        { new: true }
      );
    } else {
      updatedRequest = await RequestModal.findByIdAndUpdate(
        rid,
        {
          $push: {
            acceptedBy: {
              worker: wid,
              estimatedPrice: EstimatedPrice,
              priceJustification: description,
              acceptedAt: date,
            },
          },
          status:
            existingrequest.status == "Pending"
              ? "Accepted"
              : existingrequest.status,
        },
        { new: true }
      );
    }

    if (!updatedRequest) {
      return resp.status(404).send({
        success: false,
        message: "Request not found.",
      });
    }

    return resp.status(200).send({
      success: true,
      message: "You accepted the request successfully.",
      request: updatedRequest,
    });
  } catch (error) {
    console.error(error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error.",
    });
  }
}

async function GetWorkerData(req, resp) {
  try {
    const { wid } = req.params;
    const cacheKey = `worker:${wid}`;

    //  Try to get from Redis
    const cachedWorker = await redisClient.get(cacheKey);
    if (cachedWorker) {
      console.log(" Cache hit for worker:", wid);
      return resp.status(200).send({
        success: true,
        worker: JSON.parse(cachedWorker),
        fromCache: true, // helpful for debugging
      });
    }

    //  If not found → fetch from MongoDB
    const worker = await WorkerModal.findOne({ _id: wid })
      .select("-Password -image -VerifyId")
      .populate({
        path: "Reviews.user",
        select: "Name",
      });

    if (!worker) {
      return resp.status(404).send({
        success: false,
        message: "Worker not found",
      });
    }

    //  Save to Redis (with expiry)
    await redisClient.setEx(cacheKey, 259200, JSON.stringify(worker)); // cache for 3 days

    console.log(" Cache miss — fetched from MongoDB and stored in Redis");

    return resp.status(200).send({
      success: true,
      worker,
      fromCache: false,
    });
  } catch (error) {
    console.error(" GetWorkerData error:", error);
    resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

// verify addhar function
const verifyAadharImage = async (imageBuffer) => {
  try {
    const result = await Tesseract.recognize(imageBuffer, "eng");

    const text = result.data.text.replace(/\s+/g, " ").toLowerCase();

    let score = 0;

    // 1. Aadhaar Number Check
    const aadhaarRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/;
    if (aadhaarRegex.test(text)) {
      score += 40;
    }

    // 2. Check for "Government of India"
    if (text.includes("government of india")) {
      score += 30;
    }

    // 3. Check for "Unique Identification Authority of India"
    if (text.includes("unique identification authority of india")) {
      score += 30;
    }

    return Math.min(score, 100); // Cap at 100
  } catch (error) {
    console.error("OCR Error:", error);
    return 0; // fallback score
  }
};

async function UpdateProfile(req, resp) {
  try {
    const { wid } = req.params;

    const worker = await WorkerModal.findById(wid);
    if (!worker) {
      return resp.status(404).send({
        success: false,
        message: "Worker not found",
      });
    }

    const { fields, files } = req;

    let updatedSubServices = worker.SubSerives;
    if (fields.SubServices) {
      try {
        updatedSubServices = JSON.parse(fields.SubServices);
        if (!Array.isArray(updatedSubServices)) {
          return resp.status(400).send({
            success: false,
            message: "Invalid format for SubServices",
          });
        }
      } catch (error) {
        return resp.status(400).send({
          success: false,
          message: "Error parsing SubServices",
        });
      }
    }
    const updatedData = {
      Name: fields.Name || worker.Name,
      MobileNo: fields.MobileNo || worker.MobileNo,
      ServiceType: fields.ServiceType || worker.ServiceType,
      Address: fields.address || worker.Address,
      pincode: fields.pincode || worker.pincode,
      city: fields.city || worker.city,
      SubServices: updatedSubServices,
    };

    const updatedWorker = await WorkerModal.findByIdAndUpdate(
      wid,
      updatedData,
      {
        new: true,
      }
    );

    const image = files.image;
    const vimage = files.vimage;

    if (image) {
      try {
        updatedWorker.image = {
          data: await fs.readFile(image.filepath || image.path),
          contentType: image.mimetype || image.type,
        };
      } catch (error) {
        return resp.status(400).send({
          success: false,
          message: "Image processing failed",
        });
      }
    }

    if (vimage) {
      try {
        const vimageBuffer = await fs.readFile(vimage.filepath || vimage.path);

        updatedWorker.VerifyId = {
          data: vimageBuffer,
          contentType: vimage.mimetype || vimage.type,
        };

        // Aadhar verification logic
        const confidenceScore = await verifyAadharImage(vimageBuffer);
        console.log("confidenceScore", confidenceScore);
        updatedWorker.Verified.verified =
          confidenceScore >= 80 ? "Verified" : "Pending";
      } catch (error) {
        return resp.status(400).send({
          success: false,
          message: "Verification image processing failed",
        });
      }
    }

    await updatedWorker.save();
    await redisClient.del(`worker:${wid}`);

    console.log(" Redis cache invalidated for worker:", wid);
    
    return resp.status(200).send({
      success: true,
      message: "Worker updated successfully",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function GetWorkerImage(req, resp) {
  try {
    const worker = await WorkerModal.findById(req.params.wid).select("image");

    if (!worker || !worker.image || !worker.image.data) {
      return resp.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    resp.set("Content-Type", worker.image.contentType);
    return resp.status(200).send(worker.image.data);
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Error fetching image",
    });
  }
}

async function GetWorkerAcceptedRequest(req, resp) {
  try {
    const { wid } = req.params;
    const { pagenumber } = req.query;

    if (!wid) {
      return resp.status(400).json({ message: "Worker ID is required" });
    }

    const page = parseInt(pagenumber, 10) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalRequests = await RequestModal.countDocuments({
      status: { $nin: "Completed" },
      acceptedBy: { $elemMatch: { worker: wid } },
    });

    const response = await RequestModal.find({
      status: { $nin: "Completed" }, // Exclude requests with status "Completed"
      acceptedBy: { $elemMatch: { worker: wid } },
    })
      .select("service location date status user  acceptedBy")
      .skip(skip)
      .limit(limit)
      .sort({ "acceptedBy.0.acceptedAt": -1 });

    if (response.length === 0) {
      return resp
        .status(404)
        .json({ message: "No requests found for this worker" });
    }

    return resp.status(200).json({
      success: true,
      data: response,
      totalPages: Math.ceil(totalRequests / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    return resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

const GetWorkerAssignedRequest = async (req, resp) => {
  try {
    const { wid } = req.params;
    const page = parseInt(req.query.pagenumber) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    if (!wid) {
      return resp
        .status(400)
        .json({ success: false, error: "Worker ID is required" });
    }

    const totalRequests = await RequestModal.countDocuments({
      assignedTo: wid,
    });

    const requests = await RequestModal.find({
      assignedTo: wid,
      status: "Assigned",
    })
      .select("service location date status user confirmedAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalRequests / limit);

    return resp.status(200).json({
      success: true,
      data: requests,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching assigned requests:", error);
    return resp
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

const GetWorkerCompletedRequest = async (req, resp) => {
  try {
    const { wid } = req.params;
    const page = parseInt(req.query.pagenumber) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    if (!wid) {
      return resp
        .status(400)
        .json({ success: false, error: "Worker ID is required" });
    }

    const totalRequests = await RequestModal.countDocuments({
      assignedTo: wid,
    });

    const requests = await RequestModal.find({
      assignedTo: wid,
      status: "Completed",
    })
      .select("service location date status user confirmedAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalRequests / limit);

    return resp.status(200).json({
      success: true,
      data: requests,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching assigned requests:", error);
    return resp
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

async function UnassignRequest(req, resp) {
  try {
    const { reason, date } = req.body;
    const { rid, wid } = req.params;

    // Validate inputs
    if (!reason || !date) {
      return resp.status(400).send({
        message: "Reason and date are required for unassigning the request",
        success: false,
      });
    }

    // Find request and worker
    const request = await RequestModal.findOne({ _id: rid });
    const worker = await WorkerModal.findOne({ _id: wid });

    if (!request || !worker) {
      return resp.status(404).send({
        message: "Either request or worker not found",
        success: false,
      });
    }
    const existingUnassignedRequest = worker.UnAssignedRequest.find(
      (unassigned) => unassigned.request.toString() === rid
    );

    if (existingUnassignedRequest) {
      return resp.status(400).send({
        message: "This request has already been unassigned for this worker",
        success: false,
      });
    }
    request.acceptedBy = request.acceptedBy.filter(
      (entry) => entry.worker.toString() !== wid
    );
    request.confirmedAt = null;
    request.assignedTo = null;
    if (request.acceptedBy.length === 0) {
      request.status = "Pending";
    } else {
      request.status = "Accepted";
    }

    let currentdate = new Date();
    worker.UnAssignedRequest.push({
      request: rid,
      unassignReason: reason,
      unassignedAt: currentdate,
      unAssignedBy: 1,
    });

    await request.save();
    await worker.save();

    return resp.status(200).send({
      message: "Unassigned successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in UnassignRequest:", error);
    return resp.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
}

async function RecommandedForYou(req, resp) {
  try {
    const { wid } = req.params;

    const worker = await WorkerModal.findById(wid).select(
      "pincode city ServiceType"
    );

    if (!worker) {
      return resp.status(404).send({
        success: false,
        message: "Worker not found",
      });
    }

    const query = {
      status: { $nin: ["Completed", "Deleted"] },
      service: worker.ServiceType,
      $or: [{ pincode: worker.pincode }, { city: worker.city }],
    };

    const requests = await RequestModal.find(query).select("-image");

    if (requests.length > 0) {
      return resp.status(200).send({
        success: true,
        requests,
      });
    } else {
      return resp.status(200).send({
        success: true,
        message: "No requests found",
      });
    }
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

async function CheckBan(req, resp) {
  try {
    const { wid } = req.params;
    const worker = await WorkerModal.findById(wid).select("Banned");
    if (!worker) {
      return resp.status(400).send({
        message: "no such worker found",
        success: false,
      });
    }
    return resp.status(200).send({
      worker,
    });
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      message: "internal server error",
      success: false,
    });
  }
}

async function GetHiringRequest(req, resp) {
  try {
    const { wid } = req.params;
    let { page = 1, limit = 5 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const worker = await WorkerModal.findById(wid).select("HireRequests");

    if (!worker || !worker.HireRequests.length) {
      return resp.status(404).send({
        success: false,
        message: "No requests found",
      });
    }

    // for pagination
    const totalRequests = worker.HireRequests.length;
    const totalPages = Math.ceil(totalRequests / limit);

    const paginatedRequestsIds = worker.HireRequests.slice(
      (page - 1) * limit,
      page * limit
    );

    const paginatedRequests = await RequestModal.find({
      _id: { $in: paginatedRequestsIds },
    })
      .select("description time status location user coordinates")
      .populate({
        path: "user",
        select: "Name MobileNo",
      });

    return resp.status(200).send({
      success: true,
      hiringRequests: paginatedRequests,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching hiring requests:", error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  RegisterWorker,
  CheckCity,
  Report,
  AcceptRequest,
  GetWorkerData,
  UpdateProfile,
  GetWorkerImage,
  GetWorkerAcceptedRequest,
  GetWorkerAssignedRequest,
  GetWorkerCompletedRequest,
  UnassignRequest,
  RecommandedForYou,
  CheckBan,
  GetHiringRequest,
};
