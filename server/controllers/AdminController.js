const WorkerModal = require("../modals/WorkerModal");
const ReportModal = require("../modals/ReportModal");
const RequestModal = require("../modals/RequestModal");
const cron = require("node-cron");

async function GetVerifyingRequest(req, resp) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const skip = (page - 1) * limit;

    const requests = await WorkerModal.find({ "Verified.verified": "Pending" })
      .skip(skip)
      .limit(limit);

    const totalRequests = await WorkerModal.countDocuments({
      "Verified.verified": "Pending",
    });

    if (requests && requests.length > 0) {
      return resp.status(200).send({
        success: true,
        requests,
        totalPages: Math.ceil(totalRequests / limit),
      });
    } else {
      return resp.status(404).send({
        success: false,
        message: "No request found",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

async function GetVerifyId(req, resp) {
  try {
    const request = await WorkerModal.findById(req.params.wid).select(
      "VerifyId"
    );

    if (!request || !request.VerifyId || !request.VerifyId.data) {
      return resp.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    resp.set("Content-Type", request.VerifyId.contentType);
    return resp.status(200).send(request.VerifyId.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    return resp.status(500).send({
      success: false,
      message: "Error fetching image",
      error,
    });
  }
}

async function rejectVerificationRequest(req, resp) {
  try {
    const { wid } = req.params;
    const { reason } = req.body;
    const worker = await WorkerModal.findById(wid);
    if (!worker) {
      return resp.status(404).send({
        message: "worker not found",
        success: false,
      });
    }
    worker.Verified.verified = "Rejected";
    worker.Verified.rejectedReason = reason;
    worker.Verified.rejectionDate = new Date();
    await worker.save();
    resp.status(200).send({
      message: "request rejected",
      success: true,
    });
  } catch (error) {
    resp.status(500).send({
      message: "internal server error",
      success: false,
    });
  }
}

async function VerifyWorker(req, resp) {
  try {
    const { wid } = req.params;
    const worker = await WorkerModal.findById(wid);
    if (!worker) {
      return resp.status(404).send({
        success: false,
        message: "Worker not found",
      });
    }

    worker.Verified.verified = "Verified";
    worker.save();

    return resp.status(200).send({
      success: true,
      message: "Worker verifed",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "intenral server error",
    });
  }
}

async function GetReport(req, resp) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 7;
    const skip = (page - 1) * limit;

    const reports = await ReportModal.find()
      .populate("Report.worker", "Name _id")
      .skip(skip)
      .limit(limit);

    if (!reports || reports.length === 0) {
      return resp.status(404).send({
        success: false,
        message: "No requests found",
      });
    }

    const totalRequests = await ReportModal.countDocuments({});
    const totalPages = Math.ceil(totalRequests / limit);

    return resp.status(200).send({
      success: true,
      reports,
      totalPages,
    });
  } catch (error) {
    console.error("Error in GetReport:", error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

async function DeleteRequest(req, resp) {
  try {
    const { rid } = req.params;
    const request = await RequestModal.findById(rid);
    if (!request) {
      return resp.status(404).send({
        success: false,
        message: "Request not found",
      });
    }
    request.status = "Deleted";
    request.ReportedInfo.Deleted = true;
    await request.save();
    return resp.status(200).send({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    console.error("Error in DeleteRequest:", error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

async function InformUser(req, resp) {
  try {
    const { rid } = req.params;
    const { info } = req.body;
    const request = await RequestModal.findById(rid);
    if (!request) {
      return resp.status(404).send({
        success: false,
        message: "Request not found",
      });
    }
    if (request.ReportedInfo.Info) {
      return resp.status(400).send({
        success: true,
        message: "user already informed",
      });
    }
    request.ReportedInfo.Info = info;
    await request.save();
    return resp.status(200).send({
      success: true,
      message: "informed the user succesfully",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

async function ApproveRequest(req, resp) {
  try {
    const { rid } = req.params;
    const report = await ReportModal.deleteOne({ requestId: rid });
    const request = await RequestModal.findById(rid);
    if (!report) {
      resp.status(404).send({
        success: false,
        message: "Report not found",
      });
    }
    if (!request) {
      resp.status(404).send({
        success: false,
        message: "Request not found",
      });
    }
    request.ReportedInfo = null;
    request.save();

    resp.status(200).send({
      success: true,
      message: "request approved",
    });
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
}

async function RejectReviewRequest(req, resp) {
  try {
    const { rid } = req.params;
    // const { info } = req.body;
    const report = await ReportModal.findOne({ requestId: rid });
    const request = await RequestModal.findById(rid);
    if (!report) {
      resp.status(404).send({
        success: false,
        message: "Report not found",
      });
    }
    if (!request) {
      resp.status(404).send({
        success: false,
        message: "Request not found",
      });
    }
    report.ReviewRequested = false;
    // request.ReportedInfo.Info = info;
    request.ReportedInfo.Review = false;
    await request.save();
    await report.save();

    resp.status(200).send({
      success: true,
      message: "request rejected",
    });
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
}

const getWorkersWithUnAssignedRequests = async (req, resp) => {
  try {console.log("hit")
    const page = parseInt(req.params.page, 5) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Query to get workers with unassigned requests
    const workers = await WorkerModal.find({
      UnAssignedRequest: {
        $elemMatch: { unAssignedBy: 1, markAsValid: false },
      },
      "Banned.ban": false,
    })
      .select("Name UnAssignedRequest Banned")
      .skip(skip)
      .limit(limit).lean();

    const totalWorkers = await WorkerModal.countDocuments({
      UnAssignedRequest: {
        $elemMatch: { unAssignedBy: 1, markAsValid: false },
      },
      "Banned.ban": false,
    });

    if (workers.length === 0) {
      return resp.status(200).send({
        success: true,
        message: "No workers found with unassigned requests.",
      });
    }

    return resp.status(200).send({
      success: true,
      data: workers,
      currentPage: page,
      totalPages: Math.ceil(totalWorkers / limit),
    });
  } catch (error) {
    console.error("Error fetching workers:", error);
    return resp.status(500).send({
      success: false,
      message: "An error occurred while fetching workers.",
    });
  }
};

async function BanWorker(req, resp) {
  try {
    const { wid } = req.params;
    const worker = await WorkerModal.findById(wid);
    if (!worker) {
      return resp.status(400).send({
        success: false,
        message: "No such worker found",
      });
    }

    const tilldate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    worker.Banned.ban = true;
    worker.Banned.tillDate = tilldate;
    await worker.save();
    return resp.status(200).send({
      success: true,
      message: "the worker was banned is 3 days",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
}

async function ValidateUnassignedRequest(req, resp) {
  try {
    const { rid } = req.params;
    const worker = await WorkerModal.findOneAndUpdate(
      { "UnAssignedRequest.request": rid },
      { $set: { "UnAssignedRequest.$.markAsValid": true } },
      { new: true }
    );
    if (!worker) {
      return resp.status(404).send({
        success: false,
        message: "Request not found",
      });
    }

    return resp.status(200).send({
      success: true,
      message: "request marked as valid",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
}

// remove the ban after 3 days automatically
const removeExpiredBans = async () => {
 try {
    const currentDate = new Date();

    const result = await WorkerModal.updateMany(
      {
        "Banned.ban": true,
        "Banned.tillDate": { $lte: currentDate },
      },
      {
        $set: {
          "Banned.ban": false,
          "Banned.tillDate": null,
        },
      }
    );

    console.log(`[${new Date().toISOString()}] Unbanned ${result.modifiedCount} workers.`);
  } catch (error) {
    console.error("Cron job error:", error);
  }
};

// run the unban function everyday 10 am
cron.schedule("0 10 * * *", removeExpiredBans, {
  timezone: "Asia/Kolkata",
});

module.exports = {
  VerifyWorker,
  GetVerifyingRequest,
  GetVerifyId,
  rejectVerificationRequest,
  GetReport,
  DeleteRequest,
  InformUser,
  ApproveRequest,
  RejectReviewRequest,
  getWorkersWithUnAssignedRequests,
  BanWorker,
  ValidateUnassignedRequest,
};
