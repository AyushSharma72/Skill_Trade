const RequestModal = require("../modals/RequestModal");
const WorkerModal = require("../modals/WorkerModal");
const vader = require("vader-sentiment");
const fs = require("fs").promises;
const mongoose = require("mongoose");

async function CreateRequest(req, resp) {
  try {
    const {
      user,
      service,
      serviceId,
      description,
      time,
      date,
      location,
      coordinates,
      pincode,
      city,
      workerid,
    } = req.fields;

    // Check if required fields are present
    if (
      !user ||
      !service ||
      !description ||
      !time ||
      !date ||
      !location ||
      !pincode ||
      !city
    ) {
      return resp.status(400).send({
        success: false,
        message: "All required fields must be provided",
      });
    }

    let geoCoordinates;

    // Check if coordinates are provided and valid
    if (coordinates) {
      const { latitude, longitude } = JSON.parse(coordinates);

      // Only set geoCoordinates if both latitude and longitude are valid numbers
      if (latitude && longitude) {
        geoCoordinates = [longitude, latitude];
      }
    }

    const requestData = {
      user,
      service,
      description,
      time,
      date,
      location,
      pincode,
      city,
    };
    if (serviceId && typeof serviceId === "string" && serviceId.trim() !== "") {
      requestData.serviceId = serviceId;
    }
    if (workerid && mongoose.Types.ObjectId.isValid(workerid)) {
      requestData.personalRequestTo = workerid;
    }
    if (geoCoordinates) {
      requestData.coordinates = {
        type: "Point",
        coordinates: geoCoordinates,
      };
    }

    const request = await new RequestModal(requestData).save();

    // Handle image upload
    if (req.files && req.files.image) {
      request.image.data = await fs.readFile(req.files.image.path);
      request.image.contentType = req.files.image.type;
      await fs.unlink(req.files.image.path);
      await request.save(); // Save the image
    }

    // add the request id to the worker for whome the request is created
    if (workerid && mongoose.Types.ObjectId.isValid(workerid)) {
      const worker = await WorkerModal.findById(workerid);
      if (worker) {
        worker.HireRequests.push(request?._id);
        await worker.save();
      }
    }

    return resp.status(201).send({
      success: true,
      message: "Request created successfully",
      request,
    });
    
  } catch (error) {
    console.error("Error creating request:", error);
    return resp.status(500).send({
      success: false,
      message: "Error creating request",
    });
  }
}

async function GetUserRequest(req, resp) {
  try {
    const { id, page } = req.params;

    const totalRequests = await RequestModal.countDocuments({ user: id });

    // Fetch the requests for the current page
    const requests = await RequestModal.find({ user: id })
      .select("service location date status user")
      .limit(5)
      .skip((page - 1) * 5)
      .sort({ createdAt: -1 });

    if (requests && requests.length) {
      return resp.status(200).send({
        success: true,
        totalRequests,
        requests,
      });
    } else {
      return resp.status(404).send({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in API",
    });
  }
}

async function GetSingleUserRequest(req, resp) {
  try {
    const { rid } = req.params;
    const requestdetails = await RequestModal.findById(rid)
      .select("-image") // Exclude the "image" field
      .populate("user", "Name") // Populate the "user" field with the "Name" field only
      .populate("assignedTo", "Name"); // Populate the "assignedTo" field with the "Name" field only

    if (requestdetails) {
      return resp.status(200).send({
        success: true,
        requestdetails,
      });
    } else {
      return resp.status(400).send({
        success: false,
        message: "No request found",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "No request found",
    });
  }
}

async function GetRequestPhotoController(req, resp) {
  try {
    const request = await RequestModal.findById(req.params.rid).select("image");

    if (!request || !request.image || !request.image.data) {
      return resp.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    resp.set("Content-Type", request.image.contentType);
    return resp.status(200).send(request.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    return resp.status(500).send({
      success: false,
      message: "Error fetching image",
      error,
    });
  }
}

async function EditRequestController(req, resp) {
  try {
    const { date, time, address, pincode } = req.fields;
    const { rid } = req.params;
    const request = await RequestModal.findById(rid);
    if (request) {
      const updatedRequest = await RequestModal.findByIdAndUpdate(
        rid,
        {
          date: date || request.date,
          time: time || request.time,
          location: address || request.location,
          pincode: pincode || request.pincode,
        },
        { new: true }
      );
      await updatedRequest.save();

      return resp.status(200).send({
        success: true,
        message: "request updated",
      });
    } else {
      return resp.status(404).send({
        success: false,
        message: "request not found ",
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(400).send({
      success: false,
      message: "Error in Updation",
    });
  }
}

async function GetAllRequests(req, resp) {
  try {
    const pagenumber = req.params.pagenumber;

    const totalrequests = await RequestModal.countDocuments({
      status: { $in: ["Accepted", "Pending"] },
    });
    const currentDate = new Date();
    const requests = await RequestModal.find({
      status: { $in: ["Accepted", "Pending"] },
      date: { $gte: currentDate },
      personalRequestTo: { $exists: false },
    })
      .select("service location date status user coordinates")
      .skip((pagenumber - 1) * 5)
      .limit(5);

    if (requests && requests.length >= 1) {
      return resp.status(200).send({
        totalrequests,
        requests,
        success: true,
      });
    } else {
      return resp.status(200).send({
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({
      success: false,
      message: "internal server error",
    });
    {
    }
  }
}

async function UpdateRequestPhoto(req, resp) {
  try {
    const requestId = req.params.rid;
    const request = await RequestModal.findById(requestId);

    if (!request) {
      return resp.status(404).json({ message: "Request not found" });
    }
    if (req.files && req.files.image) {
      request.image.data = await fs.readFile(req.files.image.path);
      request.image.contentType = req.files.image.type;
      await fs.unlink(req.files.image.path);
      await request.save();
      return resp
        .status(200)
        .json({ message: "Photo updated successfully", request });
    } else {
      return resp.status(400).json({ message: "No image file provided" });
    }
  } catch (error) {
    console.log(error);
    console.error("Error updating request photo:", error);
    return resp.status(500).json({ message: "Internal server error" });
  }
}

async function GetWhoAcceptedRequest(req, resp) {
  try {
    const { rid, page } = req.params;
    const requests = await RequestModal.find(
      {
        _id: rid,
        status: { $in: ["Accepted", "Assigned", "Completed", "Deleted"] },
      },
      "acceptedBy"
    )
      .populate("acceptedBy.worker", "Name")
      .populate("assignedTo", "_id")
      .populate("status")
      .limit(5)
      .skip((page - 1) * 5);

    if (!requests || requests.length === 0) {
      return resp.status(404).json({
        success: false,
        message: "No accepted or confirmed requests found for this request.",
      });
    }
    return resp
      .status(200)
      .send({ success: true, requests, total: requests.length });
  } catch (error) {
    console.error("Error fetching accepted or confirmed requests:", error);
    return resp
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function DeleteRequest(req, resp) {
  try {
    const { rid } = req.params;
    const response = await RequestModal.findOne({ _id: rid });

    if (response) {
      response.status = "Deleted";
      response.deletedAt = new Date();
      await response.save();

      resp.status(200).send({
        success: true,
        message: "Request deleted successfully",
      });
    } else {
      resp.status(400).send({
        success: false,
        message: "Request not found",
      });
    }
  } catch (error) {
    console.error(error);
    resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

async function AssignRequest(req, resp) {
  try {
    const { wid, rid } = req.params;
    const { date } = req.body;

    if (!wid || !rid) {
      return resp.status(400).send({
        success: false,
        message: "Worker ID and Request ID are required",
      });
    }

    const request = await RequestModal.findById(rid);

    if (!request) {
      return resp.status(404).send({
        success: false,
        message: "Request not found",
      });
    }

    request.assignedTo = wid;
    request.confirmedAt = date;
    request.status = "Assigned";

    await request.save();

    return resp.status(200).send({
      success: true,
      message: "Request assigned successfully",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

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

    worker.UnAssignedRequest.push({
      request: rid,
      unassignReason: reason,
      unassignedAt: new Date(),
      unAssignedBy: 0,
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

async function RequestCompleted(req, resp) {
  try {
    const { rid, wid, uid } = req.params;
    const { stars, comment, price } = req.body;

    if (!rid || !wid || !uid) {
      return resp.status(400).send({
        success: false,
        message: "Request ID, Worker ID, or User ID is missing",
      });
    }
    if (!stars || !comment || !price) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Fetch request and worker details
    const request = await RequestModal.findById(rid);
    if (!request) {
      return resp
        .status(404)
        .send({ success: false, message: "Request not found" });
    }
    if (request.status === "Completed") {
      return resp
        .status(400)
        .send({ success: false, message: "Request was already completed" });
    }

    const worker = await WorkerModal.findById(wid);
    if (!worker) {
      return resp
        .status(404)
        .send({ success: false, message: "Worker not found" });
    }

    // Perform Sentiment Analysis on Comment
    const sentimentScores =
      vader.SentimentIntensityAnalyzer.polarity_scores(comment);
    const sentimentScore = sentimentScores.compound;

    request.status = "Completed";
    request.actualPrice = price;
    request.completedAt = new Date();
    await request.save();

    worker.TotalStars = worker.TotalStars || 0;
    worker.TotalStars += stars;

    worker.OverallRaitngs = worker.TotalStars / (worker.Reviews.length + 1);

    const totalReviews = worker.Reviews.length + 1; // Including the new review
    worker.overAllSentimentScore =
      ((worker.overAllSentimentScore || 0) * (totalReviews - 1) +
        sentimentScore) /
      totalReviews;

    // Add new review with sentiment score
    worker.Reviews.push({
      stars,
      comment,
      sentimentScore, // Store the compound sentiment score
      user: uid,
      date: new Date(),
    });

    worker.CompletedRequest += 1;
    await worker.save();

    return resp.status(200).send({
      success: true,
      message: "Request was completed",
    });
  } catch (error) {
    console.error(error);
    return resp
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
}

async function FilterRequests(req, resp) {
  try {
    const { wid } = req.params;
    const { ServiceType, maxDistance, yourCity, lat, lon } = req.query;

    const worker = await WorkerModal.findById(wid).select("pincode city");

    if (!worker) {
      return resp.status(404).send({
        success: false,
        message: "Worker not found",
      });
    }

    let query = {
      status: { $nin: ["Completed", "Deleted"] },
    };

    if (ServiceType) {
      query.service = ServiceType;
    }
    if (yourCity === "true" && worker.city) {
      query.city = worker.city;
    }

    let requests;
    const maxDistanceInMeters = (maxDistance || 5) * 1000; // Default to 5km

    // Check if lat and lon are provided and valid
    if (lat && lon) {
      const parsedLat = parseFloat(lat);
      const parsedLon = parseFloat(lon);

      if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
        console.log("Using coordinates:", parsedLat, parsedLon);

        requests = await RequestModal.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [parsedLon, parsedLat],
              },
              distanceField: "distance",
              maxDistance: maxDistanceInMeters,
              spherical: true,
              query: {
                "coordinates.coordinates": { $exists: true, $ne: null },
              },
              key: "coordinates",
            },
          },
          { $match: query },
          { $project: { image: 0 } }, // Exclude image field
        ]);
      }
    }

    // If no valid coordinates or no results, fallback to pincode
    if (!requests || requests.length === 0) {
      if (worker.pincode) {
        query.pincode = worker.pincode;
        requests = await RequestModal.find(query).select("-image");
      } else {
        return resp.status(400).send({
          success: false,
          message: "Worker location data is missing",
        });
      }
    }

    return resp.status(200).send({
      success: true,
      requests,
      message:
        requests.length > 0 ? "All requests fetched" : "No requests found",
    });
  } catch (error) {
    console.error("Error in FilterRequests:", error);
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  CreateRequest,
  GetUserRequest,
  GetSingleUserRequest,
  GetRequestPhotoController,
  EditRequestController,
  GetAllRequests,
  FilterRequests,
  UpdateRequestPhoto,
  GetWhoAcceptedRequest,
  DeleteRequest,
  AssignRequest,
  UnassignRequest,
  RequestCompleted,
};
