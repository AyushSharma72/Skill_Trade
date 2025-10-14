import React, { useState } from "react";
import { Button, Drawer } from "antd";
import Link from "next/link";
import { Button as CustomButton } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa";
import { FaCodePullRequest } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import LogoutModal from "./LogoutModal";

const NavbarMenu = () => {
  const [open, setOpen] = useState(false);
  const [modal, setModalState] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleOpen = () => setModalState(true);
  const handleClose = () => setModalState(false);
  return (
    <>
      <LogoutModal modalState={modal} onClose={handleClose}></LogoutModal>
      <Button
        className="font-bold"
        closable="true"
        onClose={onClose}
        open={open}
        onClick={showDrawer}
      >
        My Account
      </Button>

      <Drawer title="Dashboard" closable="true" onClose={onClose} open={open}>
        <Link href="/user/User_Profile">
          <CustomButton className="w-full flex gap-2" onClick={onClose}>
            <FaRegUser /> Profile
          </CustomButton>
        </Link>
        <Link href="/user/view_request">
          <CustomButton className="w-full flex gap-2" onClick={onClose}>
            <FaCodePullRequest /> View Requests
          </CustomButton>
        </Link>

        <CustomButton
          className="w-full gap-2 flex"
          onClick={() => {
            onClose();
            handleOpen();
          }}
        >
          <TbLogout2 className="text-xl" /> Logout
        </CustomButton>
      </Drawer>
    </>
  );
};

export default NavbarMenu;
