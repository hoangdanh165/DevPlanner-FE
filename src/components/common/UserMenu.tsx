import type React from "react";

import { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Person,
  Settings,
  Logout,
  Help,
  History,
  Home,
} from "@mui/icons-material";
import type { AuthData } from "@/types/all_types";
import useSignOut from "@/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";

interface UserMenuProps {
  user: AuthData | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavHistory = () => {
    navigate(paths.history);
  };

  const handleNavHome = () => {
    navigate(paths.main);
  };

  const handleNavUserProfile = () => {
    navigate(paths.user_profile);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(paths.landing_page);
    console.log("test");
  };
  // Get initials from name
  const getInitials = (name?: string | null) => {
    if (!name) return "GU"; // Guest
    return name
      .split(" ")
      .map((n) => n?.[0] ?? "")
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          p: 0,
          border: "2px solid transparent",
          transition: "all 0.3s",
          "&:hover": {
            borderColor: "rgba(147, 51, 234, 0.5)",
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
          },
        }}
      >
        <Avatar
          src={user?.avatar ?? undefined}
          sx={{
            width: 40,
            height: 40,
            background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          {getInitials(user?.fullName ?? "")}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              minWidth: 240,
              overflow: "visible",
              background: "rgba(20, 20, 20, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 1,
              mt: 1.5,
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              "& .MuiMenuItem-root": {
                px: 2,
                py: 1.5,
                borderRadius: 2,
                mx: 1,
                color: "rgba(255, 255, 255, 0.9)",
                transition: "all 0.2s",
                "&:hover": {
                  background: "rgba(147, 51, 234, 0.15)",
                  color: "#9333ea",
                },
              },
              "& .MuiListItemIcon-root": {
                color: "inherit",
                minWidth: 36,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 2, mb: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "white",
              mb: 0.5,
            }}
          >
            {user?.fullName ?? "Guest User"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.85rem",
            }}
          >
            {user?.email ?? "—"}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 1 }} />

        <MenuItem onClick={handleNavHome}>
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleNavHistory}>
          <ListItemIcon>
            <History fontSize="small" />
          </ListItemIcon>
          <ListItemText>History</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleNavUserProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <Help fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help & Support</ListItemText>
        </MenuItem>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

        <MenuItem
          onClick={handleSignOut}
          sx={{
            "&:hover": {
              background: "rgba(239, 68, 68, 0.15) !important",
              color: "#ef4444 !important",
            },
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
