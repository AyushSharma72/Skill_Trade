"use client";
import React from "react";
import Modal from "@mui/material/Modal";

const ModalComponent = ({ handleClose, open, ModalType, id, email }) => {
  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalType
          handleClose={handleClose}
          rid={id}
          email={email}
         
        />
      </Modal>
    </div>
  );
};

export default ModalComponent;
