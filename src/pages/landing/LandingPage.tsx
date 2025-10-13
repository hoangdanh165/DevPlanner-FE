"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Lightbulb,
  AutoAwesome,
  Rocket,
  Timeline,
  Search,
  Menu,
  ArrowForward,
  TrendingUp,
} from "@mui/icons-material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9333ea",
    },
    secondary: {
      main: "#ec4899",
    },
    background: {
      default: "#0a0a0a",
      paper: "#141414",
    },
    text: {
      primary: "#fafafa",
      secondary: "#a6a6a6",
    },
    divider: "#262626",
  },
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
  shape: {
    borderRadius: 16,
  },
});

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const features = [
    {
      icon: <Lightbulb sx={{ fontSize: 48 }} />,
      title: "AI-Powered Ideas",
      description:
        "Generate innovative project ideas tailored to your interests, skills, and goals using advanced AI models.",
      color: "#9333ea",
    },
    {
      icon: <Timeline sx={{ fontSize: 48 }} />,
      title: "Smart Planning",
      description:
        "Get detailed project roadmaps, timelines, and milestones automatically generated for your selected idea.",
      color: "#3b82f6",
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 48 }} />,
      title: "Intelligent Insights",
      description:
        "Receive AI-driven recommendations on technologies, resources, and best practices for your project.",
      color: "#ec4899",
    },
    {
      icon: <Rocket sx={{ fontSize: 48 }} />,
      title: "Fast Execution",
      description:
        "Transform ideas into actionable plans in minutes, not days. Start building immediately with confidence.",
      color: "#f59e0b",
    },
  ];

  const projectTypes = [
    "Web Applications",
    "Mobile Apps",
    "AI/ML Projects",
    "E-commerce",
    "SaaS Products",
    "Developer Tools",
    "Content Platforms",
    "Automation Tools",
  ];

  const stats = [
    { value: "10K+", label: "Ideas Generated", icon: <Lightbulb /> },
    { value: "5K+", label: "Projects Planned", icon: <Timeline /> },
    { value: "98%", label: "Success Rate", icon: <TrendingUp /> },
    { value: "24/7", label: "AI Availability", icon: <AutoAwesome /> },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: "rgba(10, 10, 10, 0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <Toolbar sx={{ py: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                  borderRadius: 2,
                  p: 0.8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AutoAwesome sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 800, color: "text.primary" }}
              >
                DevPlanner
              </Typography>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, mr: 2 }}>
              <Button sx={{ color: "text.primary", fontWeight: 500, px: 2 }}>
                Features
              </Button>
              <Button sx={{ color: "text.primary", fontWeight: 500, px: 2 }}>
                Pricing
              </Button>
              <Button sx={{ color: "text.primary", fontWeight: 500, px: 2 }}>
                Examples
              </Button>
            </Box>
            <Button
              variant="outlined"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: "text.primary",
                mr: 1.5,
                fontWeight: 600,
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "rgba(147, 51, 234, 0.1)",
                },
              }}
            >
              Log in
            </Button>
            <Button
              variant="contained"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                color: "white",
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 30px rgba(147, 51, 234, 0.4)",
                },
                transition: "all 0.3s",
              }}
            >
              Get Started
            </Button>
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                color: "text.primary",
              }}
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            pt: { xs: 16, md: 20 },
            pb: { xs: 12, md: 16 },
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Animated Gradient Orbs */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: `${20 + mousePosition.x * 0.02}%`,
              width: "600px",
              height: "600px",
              background:
                "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)",
              filter: "blur(80px)",
              pointerEvents: "none",
              transition: "all 0.3s ease-out",
              animation: "float 8s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-30px)" },
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "30%",
              right: `${10 + mousePosition.x * 0.015}%`,
              width: "500px",
              height: "500px",
              background:
                "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
              filter: "blur(80px)",
              pointerEvents: "none",
              transition: "all 0.3s ease-out",
              animation: "float 10s ease-in-out infinite",
              animationDelay: "2s",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "20%",
              left: `${30 + mousePosition.y * 0.01}%`,
              width: "400px",
              height: "400px",
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%)",
              filter: "blur(80px)",
              pointerEvents: "none",
              transition: "all 0.3s ease-out",
              animation: "float 12s ease-in-out infinite",
              animationDelay: "4s",
            }}
          />

          {/* Grid Pattern Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 4,
                  px: 3,
                  py: 1,
                  borderRadius: 10,
                  bgcolor: "rgba(147, 51, 234, 0.1)",
                  border: "1px solid rgba(147, 51, 234, 0.3)",
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      boxShadow: "0 0 0 0 rgba(147, 51, 234, 0.4)",
                    },
                    "50%": { boxShadow: "0 0 0 8px rgba(147, 51, 234, 0)" },
                  },
                }}
              >
                <AutoAwesome sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  Powered by Advanced AI
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" },
                  fontWeight: 900,
                  mb: 4,
                  lineHeight: 1.1,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  maxWidth: "1000px",
                  mx: "auto",
                  letterSpacing: "-0.02em",
                }}
                className="text-balance"
              >
                Transform Ideas Into Reality with AI
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "1.15rem", md: "1.4rem" },
                  color: "rgba(255, 255, 255, 0.7)",
                  mb: 6,
                  maxWidth: "750px",
                  mx: "auto",
                  lineHeight: 1.7,
                  fontWeight: 400,
                }}
                className="text-pretty"
              >
                Generate innovative project ideas and comprehensive plans
                powered by cutting-edge AI. From concept to execution in
                minutes.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2.5,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  mb: 8,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    background:
                      "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                    color: "white",
                    px: 5,
                    py: 2,
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: "none",
                    boxShadow: "0 10px 40px rgba(147, 51, 234, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                      transform: "translateY(-3px)",
                      boxShadow: "0 15px 50px rgba(147, 51, 234, 0.5)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  Start Creating Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    px: 5,
                    py: 2,
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: "none",
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.4)",
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      transform: "translateY(-3px)",
                      borderWidth: 2,
                    },
                    transition: "all 0.3s",
                  }}
                >
                  View Examples
                </Button>
              </Box>

              <Box sx={{ maxWidth: "700px", mx: "auto", mb: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Describe your project idea... (e.g., 'A mobile app for fitness tracking')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          sx={{
                            color: "rgba(255, 255, 255, 0.5)",
                            fontSize: 28,
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          size="medium"
                          endIcon={<AutoAwesome />}
                          sx={{
                            background:
                              "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                            color: "white",
                            px: 3,
                            py: 1,
                            fontWeight: 700,
                            textTransform: "none",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                            },
                          }}
                        >
                          Generate
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 4,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.3s",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(147, 51, 234, 0.5)",
                        boxShadow: "0 0 30px rgba(147, 51, 234, 0.2)",
                      },
                      "&.Mui-focused": {
                        bgcolor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(147, 51, 234, 0.8)",
                        boxShadow: "0 0 40px rgba(147, 51, 234, 0.3)",
                      },
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& input": {
                      color: "white",
                      py: 2.5,
                      fontSize: "1.05rem",
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {projectTypes.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      color: "rgba(255, 255, 255, 0.7)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      py: 2.5,
                      px: 1,
                      transition: "all 0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(147, 51, 234, 0.15)",
                        borderColor: "rgba(147, 51, 234, 0.5)",
                        color: "white",
                        transform: "translateY(-2px)",
                        boxShadow: "0 5px 20px rgba(147, 51, 234, 0.3)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            py: 0,
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
            sx={{
              maxWidth: "1000px", // Giới hạn chiều rộng cho cân đối
              mx: "auto",
            }}
          >
            {stats.map((stat, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                display="flex"
                justifyContent="center"
              >
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 260, // Giữ card đồng đều
                    textAlign: "center",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    p: 3,
                    transition: "all 0.4s",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "rgba(147, 51, 234, 0.5)",
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 20px 60px rgba(147, 51, 234, 0.3)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "rgba(147, 51, 234, 0.1)",
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      mb: 1,
                      background:
                        "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "2.5rem", md: "3rem" },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontWeight: 600,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Container
          maxWidth="xl"
          sx={{
            py: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 900,
                mb: 3,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              Powerful AI Features
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                maxWidth: "650px",
                mx: "auto",
                fontSize: "1.2rem",
                lineHeight: 1.6,
              }}
            >
              Everything you need to turn your vision into a well-planned
              project
            </Typography>
          </Box>

          {/* Grid 2x2 */}
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
            sx={{
              maxWidth: "1200px", // giữ khung gọn, căn giữa
            }}
          >
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key={index}
                display="flex"
                justifyContent="center"
              >
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 480,
                    height: "100%",
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.4s",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    textAlign: "center",
                    "&:hover": {
                      borderColor: feature.color,
                      transform: "translateY(-10px)",
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      boxShadow: `0 20px 60px ${feature.color}40`,
                      "& .feature-icon": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                      "&::before": {
                        opacity: 1,
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                      opacity: 0,
                      transition: "opacity 0.4s",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        color: feature.color,
                        mb: 3,
                        transition: "transform 0.4s",
                        fontSize: "3rem",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        mb: 2,
                        color: "white",
                        fontSize: "1.3rem",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        lineHeight: 1.8,
                        fontSize: "0.95rem",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* How It Works Section */}
        <Box
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.02)",
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
            py: 12,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  fontWeight: 800,
                  mb: 2,
                  color: "text.primary",
                }}
              >
                How It Works
              </Typography>
              <Typography variant="h6" sx={{ color: "text.secondary" }}>
                Three simple steps to your next great project
              </Typography>
            </Box>

            <Grid
              container
              spacing={6}
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              {[
                {
                  step: "01",
                  title: "Describe Your Vision",
                  description:
                    "Tell us about your interests, skills, and what you want to build. Our AI understands natural language.",
                },
                {
                  step: "02",
                  title: "Get AI Suggestions",
                  description:
                    "Receive multiple innovative project ideas tailored to your profile, complete with feasibility analysis.",
                },
                {
                  step: "03",
                  title: "Plan & Execute",
                  description:
                    "Select your favorite idea and get a comprehensive project plan with timelines, milestones, and resources.",
                },
              ].map((item, index) => (
                <Grid
                  item
                  xs={12}
                  md={4}
                  key={index}
                  display="flex"
                  justifyContent="center"
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      maxWidth: 300,
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        mb: 2,
                        color: "primary.main",
                        opacity: 0.3,
                        fontSize: "4rem",
                      }}
                    >
                      {item.step}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary", lineHeight: 1.7 }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Container maxWidth="md" sx={{ py: 16, textAlign: "center" }}>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 4,
              p: { xs: 6, md: 8 },
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "-50%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                height: "200%",
                background:
                  "radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 800,
                  mb: 3,
                  color: "text.primary",
                }}
              >
                Ready to Build Something Amazing?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  mb: 4,
                  maxWidth: "500px",
                  mx: "auto",
                }}
              >
                Join thousands of creators using AI to bring their ideas to life
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: "white",
                  color: "black",
                  px: 5,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "grey.200" },
                }}
              >
                Start Free Today
              </Button>
            </Box>
          </Box>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            py: 6,
            bgcolor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <AutoAwesome sx={{ color: "primary.main", fontSize: 28 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    DevPlanner
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Empowering creators with AI-driven project ideation and
                  planning.
                </Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
                >
                  Product
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button
                    sx={{
                      justifyContent: "flex-start",
                      color: "text.secondary",
                      p: 0,
                    }}
                  >
                    Features
                  </Button>
                  <Button
                    sx={{
                      justifyContent: "flex-start",
                      color: "text.secondary",
                      p: 0,
                    }}
                  >
                    Pricing
                  </Button>
                  <Button
                    sx={{
                      justifyContent: "flex-start",
                      color: "text.secondary",
                      p: 0,
                    }}
                  >
                    Examples
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
                >
                  Company
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button
                    sx={{
                      justifyContent: "flex-start",
                      color: "text.secondary",
                      p: 0,
                    }}
                  >
                    About
                  </Button>
                  <Button
                    sx={{
                      justifyContent: "flex-start",
                      color: "text.secondary",
                      p: 0,
                    }}
                  >
                    Blog
                  </Button>
                  <Button
                    sx={{
                      justifyContent: "flex-start",
                      color: "text.secondary",
                      p: 0,
                    }}
                  >
                    Careers
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
                >
                  Stay Updated
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  Get the latest AI features and project ideas
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Enter your email"
                    sx={{
                      flexGrow: 1,
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        "& fieldset": { borderColor: "divider" },
                      },
                      "& input": { color: "text.primary" },
                    }}
                  />
                  <Button variant="contained" sx={{ bgcolor: "primary.main" }}>
                    Subscribe
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                mt: 6,
                pt: 4,
                borderTop: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                © 2025 DevPlanner. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
