import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { style } from "../../_Arrays/Arrays";

const LogoutModal = ({ modalState, onClose }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("userCoordinates");
    router.push("/login");
  };

  return (
    <Modal
      open={modalState}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{ ...style, fontFamily: "Georgia, serif" }}
        className="w-full max-w-[500px] rounded-2xl "
      >
        <Typography
          id="modal-modal-title"
          sx={{ fontFamily: "Georgia, serif", fontWeight: "800", fontSize: "1.5rem" }}
          className=" text-black   pb-2 "
          variant="h6"
        >
          Confirm Logout
        </Typography>
        <hr />
        <Typography
          id="modal-description"
          sx={{ fontFamily: "Georgia, serif" }}
          className="text-gray-700 mb-6 pt-2 font-bold"
        >
          Are you sure you want to log out?
        </Typography>
        <div className="flex justify-end  gap-2 mt-6">
          <Button
            className=" mb-1 flex text-white  bg-red-500 hover:bg-red-400"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            Logout
          </Button>
          <Button className="" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
