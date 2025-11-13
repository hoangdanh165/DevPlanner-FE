"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  Dialog,
  TextField,
} from "@mui/material";
import {
  Edit,
  Cancel,
  Mail,
  Phone,
  CalendarMonth,
  AccountBox,
  Person2,
  LocationOn,
  AccessTime,
} from "@mui/icons-material";
import UserMenu from "@/components/common/UserMenu";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useToast } from "@/contexts/ToastProvider";

interface UserData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  email_verified: boolean;
  avatar?: string;
}

interface UserProfileData {
  display_name: string;
  preferred_stack: string;
  skill_level: "beginner" | "intermediate" | "advanced" | "expert";
  timezone: string;
  ai_temperature: number;
  created_at: string;
}

const USER_PROFILE_ENDPOINT = "api/v1/users/profile/";

export default function UserProfilePage() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userProfileData, setUserProfileData] =
    useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "#3b82f6";
      case "intermediate":
        return "#8b5cf6";
      case "advanced":
        return "#a855f7";
      case "expert":
        return "#ec4899";
      default:
        return "#a855f7";
    }
  };

  const getSkillLevelLabel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(USER_PROFILE_ENDPOINT);
        const responseData = res.data.data;

        // Extract user data (full_name, email, phone, address, avatar)
        const user: UserData = {
          full_name: responseData.full_name || "",
          email: responseData.email || "",
          phone: responseData.phone || "",
          address: responseData.address || "",
          email_verified: responseData.email_verified || false,
          avatar: responseData.avatar,
        };

        // Extract profile data from nested profile object
        const profile: UserProfileData = {
          display_name: responseData.profile?.display_name || "",
          preferred_stack: Array.isArray(responseData.profile?.preferred_stack)
            ? responseData.profile.preferred_stack.join(", ")
            : responseData.profile?.preferred_stack || "",
          skill_level: (responseData.profile?.skill_level || "intermediate") as
            | "beginner"
            | "intermediate"
            | "advanced"
            | "expert",
          timezone: responseData.profile?.timezone || "",
          ai_temperature: responseData.profile?.ai_temperature || 0.5,
          created_at:
            responseData.profile?.created_at || new Date().toISOString(),
        };

        setUserData(user);
        setUserProfileData(profile);
      } catch (error) {
        console.log(error);
        showToast("Failed to load user profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [axiosPrivate, showToast]);

  // Safe fallback values to avoid null reference errors
  const displayData = {
    fullName: userData?.full_name || "Unknown User",
    email: userData?.email || "N/A",
    phone: userData?.phone || "N/A",
    address: userData?.address || "N/A",
    avatar: userData?.avatar || "N/A",
    emailVerified: userData?.email_verified || false,
  };

  const profileData = {
    skillLevel: userProfileData?.skill_level || "Unknown",
    preferredStack: userProfileData?.preferred_stack || "Unknown",
    aiTemperature: userProfileData?.ai_temperature ?? 0.5,
    timezone: userProfileData?.timezone || "UTC",
    createdAt: userProfileData?.created_at || new Date().toISOString(),
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #000000, #0a0a0a)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated gradient orbs */}
      <Box
        sx={{
          position: "fixed",
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 20s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translate(0, 0)" },
            "50%": { transform: "translate(-100px, 100px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 15s ease-in-out infinite reverse",
        }}
      />

      {/* Header */}
      <Box
        sx={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          background: "rgba(0, 0, 0, 0.5)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
                }}
              >
                <AccountBox />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                User Profile
              </Typography>
            </Box>
            <UserMenu user={auth} />
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 6, position: "relative", zIndex: 1 }}>
        {/* Profile Header Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)",
                }}
              >
                {displayData.avatar}
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {displayData.fullName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  />
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Active
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Button
              startIcon={isEditing ? <Cancel /> : <Edit />}
              onClick={() => setEditDialogOpen(true)}
              sx={{
                color: "#a855f7",
                borderColor: "rgba(168, 85, 247, 0.3)",
                border: "1px solid",
                "&:hover": {
                  borderColor: "#a855f7",
                  background: "rgba(168, 85, 247, 0.1)",
                },
              }}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </Box>
        </Paper>

        {/* Contact Information */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 600,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Mail sx={{ color: "#a855f7" }} />
            Contact Information
          </Typography>

          <Grid container spacing={3}>
            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  background: "rgba(168, 85, 247, 0.05)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    mb: 1,
                  }}
                >
                  Email Address
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: "white", fontWeight: 500 }}>
                    {displayData.email}
                  </Typography>
                  {displayData.emailVerified && (
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        background: "rgba(16, 185, 129, 0.2)",
                        border: "1px solid rgba(16, 185, 129, 0.5)",
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        color: "#10b981",
                        fontWeight: 600,
                      }}
                    >
                      Verified
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  background: "rgba(168, 85, 247, 0.05)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    mb: 1,
                  }}
                >
                  Phone Number
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone sx={{ color: "#a855f7", fontSize: "1.2rem" }} />
                  <Typography sx={{ color: "white", fontWeight: 500 }}>
                    {displayData.phone}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3,
                  background: "rgba(168, 85, 247, 0.05)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    mb: 1,
                  }}
                >
                  Location
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ color: "#a855f7", fontSize: "1.2rem" }} />
                  <Typography sx={{ color: "white", fontWeight: 500 }}>
                    {displayData.address}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Developer Profile */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 600,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Person2 sx={{ color: "#a855f7" }} />
            Developer Profile
          </Typography>

          <Grid container spacing={3}>
            {/* Skill Level */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  background: "rgba(168, 85, 247, 0.05)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    mb: 1,
                  }}
                >
                  Skill Level
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      background: `${getSkillLevelColor(
                        profileData.skillLevel
                      )}20`,
                      border: `1px solid ${getSkillLevelColor(
                        profileData.skillLevel
                      )}50`,
                      borderRadius: 1,
                      color: getSkillLevelColor(profileData.skillLevel),
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    {getSkillLevelLabel(profileData.skillLevel)}
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* AI Temperature */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  background: "rgba(168, 85, 247, 0.05)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    mb: 1,
                  }}
                >
                  AI Temperature
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography
                    sx={{ color: "white", fontWeight: 600, fontSize: "1.2rem" }}
                  >
                    {profileData.aiTemperature}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {profileData.aiTemperature < 0.5
                      ? "Conservative"
                      : profileData.aiTemperature < 0.8
                      ? "Balanced"
                      : "Creative"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Preferred Tech Stack */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3,
                  background: "rgba(168, 85, 247, 0.05)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    mb: 2,
                  }}
                >
                  Preferred Tech Stack
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  {profileData.preferredStack.split(", ").map((tech, index) => (
                    <Box
                      key={index}
                      sx={{
                        px: 2.5,
                        py: 1,
                        background:
                          "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: 2,
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      {tech}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Timezone */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3,
                  background: "rgba(168, 85, 247, 0.05)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    mb: 1,
                  }}
                >
                  Timezone
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime sx={{ color: "#a855f7", fontSize: "1.2rem" }} />
                  <Typography sx={{ color: "white", fontWeight: 500 }}>
                    {profileData.timezone}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Member Since */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3,
                  background: "rgba(168, 85, 247, 0.05)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.85rem",
                    mb: 1,
                  }}
                >
                  Member Since
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarMonth
                    sx={{ color: "#a855f7", fontSize: "1.2rem" }}
                  />
                  <Typography sx={{ color: "white", fontWeight: 500 }}>
                    {new Date(profileData.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.4)",
                background: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Download Data
          </Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
              "&:hover": {
                boxShadow: "0 6px 30px rgba(59, 130, 246, 0.6)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(20, 20, 30, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: 600, mb: 3 }}
          >
            Edit Profile
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Full Name"
              defaultValue={displayData.fullName}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(168, 85, 247, 0.5)",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.5)",
                  opacity: 1,
                },
              }}
            />
            <TextField
              label="Email"
              defaultValue={displayData.email}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(168, 85, 247, 0.5)",
                  },
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setEditDialogOpen(false)}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                }}
                onClick={() => setEditDialogOpen(false)}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
