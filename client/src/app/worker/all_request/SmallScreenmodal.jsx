"use client";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { marks, style } from "../../_Arrays/Arrays";

const SmallScreenmodal = ({
  open,
  handleClose,
  handleServiceTypeChange,
  ServiceType,
  handleChange,
  Disabled,
  checkedValues,
  distance,
  setDistance,
}) => {
  const [services, setServices] = React.useState([]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/services/get_active_services`);
      const result = await response.json();

      if (result.success && result.data) {
        const options = result.data.map(service => ({
          value: service._id,
          label: service.serviceName,
        }));

        setServices(options);
      } else {
        toast('Using sample data - API returned no data');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast('Using sample data - API not available');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="w-[350px]">
        <div className="w-full flex flex-col gap-4">
          {/* Service Type */}
          <div>
            <p className="font-semibold text-lg">Service Type</p>
            <Select
              required
              onValueChange={handleServiceTypeChange}
              value={ServiceType}
            >
              <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="Select a Service" />
              </SelectTrigger>
              <SelectContent portal={true} className="z-[1500]">
                {services.map((service) => (
                  <SelectItem key={service.value} value={service.label}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => handleServiceTypeChange("")}
              className="mt-2 w-full"
            >
              Clear Filter
            </Button>
          </div>

          {/* Location & Distance */}
          <div className="border-t border-gray-300 pt-4">
            <p className="font-semibold text-lg">Location</p>
            {/* <FormControlLabel
              name="nearBy"
              control={<Checkbox />}
              checked={checkedValues.nearBy}
              onChange={handleChange}
              label="Near By"
            /> */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-sm text-gray-600">Distance range in kms</p>
              <Box sx={{ width: "100%" }}>
                <Slider
                  aria-label="Distance"
                  value={distance}
                  onChange={(event, newValue) => setDistance(newValue)}
                  valueLabelDisplay="auto"
                  shiftStep={30}
                  step={5}
                  marks={marks}
                  min={0}
                  max={20}
                />
              </Box>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setDistance(5)}
              >
                Reset Distance
              </Button>
            </div>

            <FormControlLabel
              name="yourCity"
              control={<Checkbox disabled={Disabled} />}
              checked={checkedValues.yourCity}
              onChange={handleChange}
              label="Your City"
            />
            {Disabled && (
              <p className="text-red-600 text-sm">
                Update your city to enable this filter
              </p>
            )}
          </div>

          {/* Close Button */}
          <Button onClick={handleClose} className="mt-4 w-full">
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default SmallScreenmodal;
