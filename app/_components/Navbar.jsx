"use client";
import { FaInfoCircle } from "react-icons/fa";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic"; // Import for dynamic imports
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useAuth } from "../_context/UserAuthContent";
import { Button } from "../../components/ui/button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FaHome, FaHandshake } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { TbHandClick } from "react-icons/tb";
import { GiArchiveRegister } from "react-icons/gi";
import { FiLogIn } from "react-icons/fi";
import { IoCall } from "react-icons/io5";

// Dynamically import components with ssr: false to prevent document not found errors
const LogoutModal = dynamic(() => import("./NavBarComponenets/LogoutModal"), {
  ssr: false,
});
const Menu2 = dynamic(() => import("../_components/NavBarComponenets/menu"), {
  ssr: false,
});
const WorkerMenu = dynamic(() => import("./NavBarComponenets/WorkerMenu"), {
  ssr: false,
});
const AdminMenu = dynamic(() => import("./NavBarComponenets/AdminMenu"), {
  ssr: false,
});
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Navbar = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [auth, setauth] = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modal, setModalState] = React.useState(false);
  const open2 = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleOpenModal = () => setModalState(true);
  const handleCloseModal = () => setModalState(false);

  const pathname = usePathname();
  return (
    <div className="bg-black flex justify-center text-white sticky top-0 z-[90] !font-serif">
      {/* navbar big screen  */}
      <div className="w-full xl:w-[95%] justify-between sm:flex hidden">
      <Link href="/">
        <Image
          src="/logo.png"
          className="w-[200px] h-[70px] cursor-pointer"
          alt="skill trade logo"
          width={200}
          height={70}
        ></Image>
      </Link>

        <div className="p-2 px-6 flex items-center justify-end gap-8 font-bold text-xl">

          {auth?.user?.role == 0 ? (
            <>
              <Link
                href="/"
                className={`${
                  pathname === "/" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className={`${
                  pathname === "/about-us" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                About
              </Link>
              <Link
                href="/user/create_request"
                className={`${
                  pathname === "/user/create_request" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Create request
              </Link>
              <Link
                href="/user/hire"
                className={`${
                  pathname === "/user/hire" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Hire
              </Link>
              <Link
                href="/contact-us"
                className={`${
                  pathname === "/contact-us" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Contact
              </Link>
              <Menu2 />
            </>
          ) : auth?.user?.role == 1 ? (
            <>
              <Link
                href="/"
                className={`${
                  pathname === "/" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className={`${
                  pathname === "/about-us" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                About
              </Link>
              <Link
                href="/worker/all_request"
                className={`${
                  pathname === "/worker/all_request" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                All Request
              </Link>
              <Link
                href="/worker/hire"
                className={`${
                  pathname === "/worker/hire" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Hiring Requests
              </Link>
              <Link
                href="/contact-us"
                className={`${
                  pathname === "/contact-us" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Contact
              </Link>
              <WorkerMenu />
            </>
          ) : auth?.user?.role == 2 ? (
            <>
              <Link
                href="/"
                className={`${
                  pathname === "/" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Home
              </Link>
               <Link
                href="/about-us"
                className={`${
                  pathname === "/about-us" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                About
              </Link>
              <Link
                href="/admin/verify_worker"
                className={`${
                  pathname === "/admin/verify_worker" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Verify Workers
              </Link>
              <AdminMenu />
            </>
          ) : (
            <>
              <Link
                href="/"
                className={`${
                  pathname === "/" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className={`${
                  pathname === "/about-us" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                About
              </Link>
              <Link
                href="/contact-us"
                className={`${
                  pathname === "/contact-us" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Contact
              </Link>
              <Link
                href="/register"
                className={`${
                  pathname === "/register" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Register
              </Link>
              <Link
                href="/login"
                className={`${
                  pathname === "/login" ? "border-b-2 " : ""
                } text-lg hover:text-gray-300 transition-colors`}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
      <LogoutModal modalState={modal} onClose={handleCloseModal}></LogoutModal>
      {/* small screen navbar */}
      <div className="sm:hidden">
        <Box className="flex justify-between z-15">
          <CssBaseline />
          <AppBar
            position="fixed"
            open={open}
            style={{
              backgroundColor: "#000000",
              backdropFilter: "blur(10px)",
            }}
          >
            <Toolbar className="flex justify-between">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  {
                    mr: 2,
                  },
                  open && { display: "none" },
                ]}
              >
                <MenuIcon />
              </IconButton>
              <Link href="/">
                <Image
                  src="/logo.png"
                  className="w-[200px] h-[70px]"
                  alt="Logo"
                  width={200}
                  height={70}
                />
              </Link>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {/* user  */}
              {auth?.user?.role === 0 && (
                <div className="flex flex-col gap-3">
                  {/* home  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/" className="m-auto flex items-center gap-2">
                        <ListItemIcon>
                          <FaHome />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  <hr></hr>
                  {/* about  */}
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleDrawerClose}>
                        <Link href="/about-us" className="m-auto flex items-center gap-2">
                          <ListItemIcon>
                            <FaInfoCircle />
                          </ListItemIcon>
                          <ListItemText primary="About" />
                        </Link>
                      </ListItemButton>
                    </ListItem>
                  {/* create request  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link
                        href="/user/create_request"
                        className="m-auto flex items-center gap-2"
                      >
                        <ListItemIcon>
                          <IoIosCreate />
                        </ListItemIcon>
                        <ListItemText primary="Create Request" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  <hr></hr>

                  {/* hire  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link
                        href="/user/hire"
                        className="m-auto flex items-center gap-2"
                      >
                        <ListItemIcon>
                          <FaHandshake />
                        </ListItemIcon>
                        <ListItemText primary="Hire" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  <hr></hr>
                  {/* dashboard  */}
                  <div className="flex justify-center ">
                    <Button
                      id="basic-button"
                      aria-controls={open2 ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open2 ? "true" : undefined}
                      onClick={handleClick}
                      className="w-[90%]"
                    >
                      My Account
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open2}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/user/User_Profile"> Profile</Link>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/user/view_request"> View Request</Link>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                          handleOpenModal();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              )}

              {/* worker  */}
              {auth?.user?.role === 1 && (
                <div className="flex flex-col gap-3">
                  {/* home  */}
                  <ListItem disablePadding>
                    <ListItemButton>
                      <Link
                        href="/"
                        className="m-auto flex items-center gap-2"
                        onClick={handleDrawerClose}
                      >
                        <ListItemIcon>
                          <FaHome />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  {/* about  */}
                   <ListItem disablePadding>
                    <ListItemButton>
                      <Link
                        href="/about-us"
                        className="m-auto flex items-center gap-2"
                        onClick={handleDrawerClose}
                      >
                        <ListItemIcon>
                          <FaInfoCircle />
                        </ListItemIcon>
                        <ListItemText primary="About" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  {/* all request  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link
                        href="/worker/all_request"
                        className="m-auto flex items-center gap-2"
                      >
                        <ListItemIcon>
                          <TbHandClick />
                        </ListItemIcon>
                        <ListItemText primary="All Requests" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  {/* hiring request  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link
                        href="/worker/hire"
                        className="m-auto flex items-center gap-2"
                      >
                        <ListItemIcon>
                          {" "}
                          <FaHandshake />
                        </ListItemIcon>
                        <ListItemText primary="Hiring Requests" />
                      </Link>
                    </ListItemButton>
                  </ListItem>

                  {/* dashboard  */}
                  <div className="flex justify-center ">
                    <Button
                      id="basic-button"
                      aria-controls={open2 ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open2 ? "true" : undefined}
                      onClick={handleClick}
                      className="w-[90%]"
                    >
                      My Account
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open2}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link
                          href={`/worker/worker_profile/${auth?.user?._id}`}
                        >
                          Profile
                        </Link>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/worker/requests">Assigned Requests</Link>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                          handleOpenModal();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              )}

              {/* admin  */}
              {auth?.user?.role === 2 && (
                <div className="flex flex-col gap-3">
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/" className="m-auto flex">
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="Home" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  {/* about */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/about-us" className="m-auto flex">
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary="About" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  {/* admin menu  */}
                  <div className="flex justify-center ">
                    <Button
                      id="basic-button"
                      aria-controls={open2 ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open2 ? "true" : undefined}
                      onClick={handleClick}
                      className="w-[90%]"
                    >
                      Admin Dashboard
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open2}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/admin/reports">View Reports</Link>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/admin/verify_worker">Verify Workers</Link>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                        }}
                      >
                        <Link href="/admin/service">View Services</Link>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleDrawerClose();
                          handleOpenModal();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              )}
              {/* not login  */}
              {!auth?.user && (
                <>
                  {/* home  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/" className="m-auto flex items-center gap-2">
                        <ListItemIcon>
                          {" "}
                          <FaHome />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  <hr></hr>
                  {/* about */}
                   <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link href="/about-us" className="m-auto flex items-center gap-2">
                        <ListItemIcon>
                          {" "}
                          <FaInfoCircle />
                        </ListItemIcon>
                        <ListItemText primary="About" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                  <hr></hr>
                  {/* register  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link
                        href="/register"
                        className="m-auto flex items-center gap-2"
                      >
                        <ListItemIcon>
                          <GiArchiveRegister />
                        </ListItemIcon>
                        <ListItemText primary="Register" />
                      </Link>
                    </ListItemButton>
                  </ListItem>

                  <hr></hr>

                  {/* login  */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link
                        href="/login"
                        className="m-auto flex items-center gap-2"
                      >
                        <ListItemIcon>
                          <FiLogIn />
                        </ListItemIcon>
                        <ListItemText primary="Login" />
                      </Link>
                    </ListItemButton>
                    {/* contact  */}
                  </ListItem>
                  <hr></hr>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerClose}>
                      <Link
                        href="/contact-us"
                        className="m-auto flex items-center gap-2"
                      >
                        <ListItemIcon>
                          {" "}
                          <IoCall />
                        </ListItemIcon>
                        <ListItemText primary="Contact" />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
            <Divider />
          </Drawer>
        </Box>
      </div>
    </div>
  );
};

export default Navbar;
