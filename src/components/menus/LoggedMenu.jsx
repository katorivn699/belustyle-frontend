import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { LuMousePointerClick } from "react-icons/lu";
import { TbRosetteDiscount } from "react-icons/tb";
import { Link } from "react-router-dom";
import userDefault from "../../assets/images/userdefault.webp";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const LoggedMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const authUser = useAuthUser();

  // Hàm mở menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  // Hàm đóng menu
  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setAnchorEl(null);
  };

  const profileImageUrl = `${authUser.userImage}?t=${new Date().getTime()}`;

  return (
    <>
      {/* IconButton để mở menu */}
      <IconButton
        aria-controls={isMenuOpen ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <img
          src={profileImageUrl ? profileImageUrl : userDefault}
          className="rounded-full w-6 md:w-8 h-6 md:h-8 object-cover"
          loading="eager"
          alt="Profile"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = userDefault;
          }}
        />
      </IconButton>

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            borderRadius: 8,
            minWidth: 220, 
          },
        }}
        MenuListProps={{
          sx: {
            maxHeight: "400px",
            overflowY: "auto",
          },
        }}
      >
        <MenuItem
          component={Link}
          to="/user/information"
          onClick={handleMenuClose}
        >
          <ListItemIcon sx={{ fontSize: "1.75rem", minWidth: "40px" }}>
            <FaRegUserCircle className="text-3xl" />
          </ListItemIcon>
          <ListItemText primary="Account Settings" />
        </MenuItem>

        <MenuItem component={Link} to="/user/orders" onClick={handleMenuClose}>
          <ListItemIcon sx={{ fontSize: "1.75rem", minWidth: "40px" }}>
            <LuMousePointerClick className="text-3xl" />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </MenuItem>

        <MenuItem component={Link} to="/user/discounts" onClick={handleMenuClose}>
          <ListItemIcon sx={{ fontSize: "1.75rem", minWidth: "40px" }}>
            <TbRosetteDiscount className="text-3xl" />
          </ListItemIcon>
          <ListItemText primary="Discounts" />
        </MenuItem>

        <MenuItem component={Link} to="/logout" onClick={handleMenuClose}>
          <ListItemIcon sx={{ fontSize: "1.75rem", minWidth: "40px" }}>
            <IoLogOutOutline className="text-3xl" />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default LoggedMenu;
