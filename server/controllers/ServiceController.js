const ServiceModel = require("../modals/ServiceModel");
const fs = require("fs");

async function CreateService(req, resp) {
  try {
    const { serviceName, isActive, subServices } = req.fields;
    if (!serviceName || isActive === undefined) {
      return resp.status(400).send({
        success: false,
        error: "All fields are required",
      });
    }

    // Check if service with this name already exists
    const existingService = await ServiceModel.findOne({ serviceName });
    if (existingService) {
      return resp.status(409).send({
        success: false,
        error: "Service with this name already exists",
      });
    }

    const iconFile = req.files.icon;
    
    if (!iconFile || !iconFile.path) {
      return resp.status(400).send({
        success: false,
        error: "Icon file is required",
      });
    }
    // Read the file data
    const iconData = fs.readFileSync(iconFile.path);

    if (!iconData || iconData.length === 0) {
      return resp.status(400).send({
        success: false,
        error: "Icon file is empty",
      });
    }

    // Parse subServices if provided (as JSON string or array)
    let parsedSubServices = [];
    if (subServices) {
      if (Array.isArray(subServices)) {
        parsedSubServices = subServices;
      } else if (typeof subServices === 'string') {
        try {
          parsedSubServices = JSON.parse(subServices);
          if (!Array.isArray(parsedSubServices)) parsedSubServices = [parsedSubServices];
        } catch {
          parsedSubServices = [subServices];
        }
      }
    }
    const newService = new ServiceModel({
      serviceName,
      icon: {
        data: iconData,
        contentType: iconFile.type,
      },
      isActive,
      subServices: parsedSubServices
    });

    const result = await newService.save();

    if (!result) {
      return resp.status(500).send({
        success: false,
        error: "Failed to create service",
      });
    }
    resp.status(201).send({
      success: true,
      message: "Service created successfully",
    });

  } catch (error) {
    console.error("Error:", error); 
    resp.status(500).send({
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  }
}

async function GetAllServices(req, resp) {
  try {
    const services = await ServiceModel.find({});
    resp.status(200).send({
      success: true,
      data: services,
    });
  } catch (error) {
    resp.status(500).send({ success: false, error: "Internal server error" });
  }
}

// get only isActive=true services
async function GetActiveServices(req, resp) {
  try {
    const services = await ServiceModel.find({ isActive: true });
    resp.status(200).send({
      success: true,
      data:services.map(service => ({
        _id: service._id,
        serviceName: service.serviceName,
        subServices: service.subServices,
      })),
    });
  } catch (error) {
    resp.status(500).send({ success: false, error: "Internal server error" });
  }
}

async function UpdateService(req, resp) {
  try {
    const serviceId = req.params.id;
    const { serviceName, isActive, subServices } = req.fields;
    const iconFile = req.files.icon;

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return resp.status(404).send({ success: false, error: "Service not found" });
    }

    // Only check for duplicate name if name is being changed
    if (serviceName && serviceName !== service.serviceName) {
      const existingService = await ServiceModel.findOne({ serviceName });
      if (existingService) {
        return resp.status(409).send({
          success: false,
          error: "Service with this name already exists",
        });
      }
      service.serviceName = serviceName;
    }

    if (typeof isActive !== 'undefined') {
      service.isActive = isActive;
    }

    // Update subServices if provided
    if (typeof subServices !== 'undefined') {
      let parsedSubServices = [];
      if (Array.isArray(subServices)) {
        parsedSubServices = subServices;
      } else if (typeof subServices === 'string') {
        try {
          parsedSubServices = JSON.parse(subServices);
          if (!Array.isArray(parsedSubServices)) parsedSubServices = [parsedSubServices];
        } catch {
          parsedSubServices = [subServices];
        }
      }
      service.subServices = parsedSubServices;
    }

    // Only update icon if a new file is provided
    if (iconFile && iconFile.path) {
      try {
        const iconData = fs.readFileSync(iconFile.path);
        service.icon = {
          data: iconData,
          contentType: iconFile.type,
        };
      } catch (error) {
        return resp.status(500).send({ success: false, error: "Failed to process icon file" });
      }
    }

    const updated_service = await service.save();
    if (!updated_service) {
      return resp.status(500).send({ success: false, error: "Failed to update service" });
    }
    resp.status(200).send({ success: true, message: "Service updated successfully" });
  } catch (error) {
    resp.status(500).send({ success: false, error: "Internal server error" });
  }
}

async function DeleteService(req, resp) {
  try {
    const serviceId = req.params.id;
    const service = await ServiceModel.findByIdAndDelete(serviceId);
    if (!service) {
      return resp.status(404).send({ success: false, error: "Service not found" });
    }
    resp.status(200).send({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("DeleteService error:", error); // <-- Add this line
    resp.status(500).send({ success: false, error: "Internal server error" });
  }
}

module.exports = {
  CreateService,
  GetAllServices,
  GetActiveServices,
  UpdateService,
  DeleteService,
};