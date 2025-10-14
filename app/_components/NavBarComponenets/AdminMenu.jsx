import React, { useState } from "react";
import { Button, Drawer } from "antd";
import Link from "next/link";
import { Button as CustomButton } from "@/components/ui/button";
import { TbMessageReport } from "react-icons/tb";
import { TbLogout2 } from "react-icons/tb";
import LogoutModal from "./LogoutModal";
import { useAuth } from "../../_context/UserAuthContent";
import { SiTicktick } from "react-icons/si";

const AdminMenu = () => {
  const [open, setOpen] = useState(false);
  const [modal, setModalState] = useState(false);
  const [auth, SetAuth] = useAuth();

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
        Admin Dashboard
      </Button>

      <Drawer
        title=" Admin Dashboard"
        closable="true"
        onClose={onClose}
        open={open}
      >

        <Link href="/admin/reports">
          <CustomButton
            className="w-full flex gap-2 items-center"
            onClick={onClose}
          >
            <TbMessageReport className="text-lg" />
            Reports
          </CustomButton>
        </Link>
        <Link href="/admin/UnasssignedByWorker">
          <CustomButton
            className="w-full flex gap-2 items-center"
            onClick={onClose}
          >
            <TbMessageReport className="text-lg" />
            Unassigned Request
          </CustomButton>
        </Link>
        <Link href="/admin/service">
          <CustomButton
            className="w-full flex gap-2 items-center"
            onClick={onClose}
          >
            <TbMessageReport className="text-lg" />
            Service 
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

export default AdminMenu;
