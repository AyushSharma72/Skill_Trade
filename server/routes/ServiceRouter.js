const express = require("express");
const formidable = require("express-formidable");
const { 
  CreateService,
  GetAllServices,
  UpdateService,
  DeleteService,
  GetActiveServices,
} = require("../controllers/ServiceController");

const router = express.Router();
const isAdmin = require("../middleware/isAdmin");

router.post("/create_service", formidable(), isAdmin, CreateService);

router.get("/get_all_services", GetAllServices);

router.get("/get_active_services", GetActiveServices);

router.patch("/update_service/:id", formidable(), isAdmin, UpdateService);

router.delete("/delete_service/:id", isAdmin, DeleteService);

module.exports = router;
