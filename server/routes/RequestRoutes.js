const express = require("express");
const {
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
} = require("../controllers/RequestController");
const formidable = require("express-formidable");

const router = express.Router();

router.post("/CreateRequest", formidable(), CreateRequest);

router.get("/GetUserRequest/:id/:page", GetUserRequest);

router.get("/GetSingleUserRequest/:rid", GetSingleUserRequest);

router.get("/GetRequestPhotoController/:rid", GetRequestPhotoController);

router.post("/EditRequest/:rid", formidable(), EditRequestController);

router.get("/Allrequests/:pagenumber", GetAllRequests);

router.get("/Filterrequest/:wid", FilterRequests);

router.post("/UpdateRequestPhoto/:rid", formidable(), UpdateRequestPhoto);

router.get("/GetWhoAcceptedRequest/:rid/:page", GetWhoAcceptedRequest);

router.delete("/DeleteRequest/:rid", DeleteRequest);

router.put("/AssignRequest/:rid/:wid", AssignRequest);

router.post("/Unassignrequest/:rid/:wid", UnassignRequest);

router.post("/RequestCompleted/:rid/:uid/:wid", RequestCompleted);


module.exports = router;
