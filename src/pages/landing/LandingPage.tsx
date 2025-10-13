import type React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Stack,
} from "@mui/material";
import {
  PlayArrow,
  Code,
  Speed,
  AutoAwesome,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";

interface LandingProps {
  // onGetStarted: () => void;
}

const LandingPage: React.FC<LandingProps> = ({}) => {
  const features = [
    {
      icon: <AutoAwesome sx={{ fontSize: 40 }} />,
      title: "AI-Powered Planning",
      description:
        "Generate comprehensive project plans instantly with advanced AI that understands your development needs.",
    },
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: "Tech Stack Recommendations",
      description:
        "Get intelligent suggestions for the best technologies and frameworks for your specific project requirements.",
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: "Rapid Iteration",
      description:
        "Iterate on your project plans quickly with real-time updates and intelligent refinements.",
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      title: "Task Breakdown",
      description:
        "Automatically break down complex projects into manageable tasks with clear priorities and timelines.",
    },
  ];

  const stats = [
    { value: "10x", label: "Faster Planning" },
    { value: "500+", label: "Projects Created" },
    { value: "95%", label: "Time Saved" },
    { value: "50+", label: "Tech Stacks" },
  ];

  const companies = ["Netflix", "Spotify", "Airbnb", "Uber", "Stripe"];

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "#ffffff",
        backgroundImage: 'url("/homepage-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        bgcolor: "#000000", // fallback color
      }}
    >
      {/* Navigation */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: "transparent", borderBottom: "1px solid #1a1a1a" }}
      >
        <Toolbar
          disableGutters
          sx={{
            py: 1,
            px: { xs: 2, sm: 3, md: 6 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo nằm sát trái */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src="/logo-darkmode.png"
              alt="DevPlanner Logo"
              sx={{
                height: { xs: 88, sm: 96, md: 104 },
                maxWidth: { xs: 200, sm: 220, md: 280 },
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Menu + Sign In */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Stack direction="row" spacing={3} sx={{ mr: 3 }}>
              <Button
                color="inherit"
                sx={{ textTransform: "none", color: "#a1a1aa" }}
              >
                Features
              </Button>
              <Button
                color="inherit"
                sx={{ textTransform: "none", color: "#a1a1aa" }}
              >
                Pricing
              </Button>
              <Button
                color="inherit"
                sx={{ textTransform: "none", color: "#a1a1aa" }}
              >
                Docs
              </Button>
            </Stack>
            <Button
              variant="outlined"
              onClick={() => navigate(paths.sign_in)}
              sx={{
                textTransform: "none",
                borderColor: "#27272a",
                color: "#ffffff",
                "&:hover": { borderColor: "#3f3f46", bgcolor: "#18181b" },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", py: { xs: 8, md: 16 } }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              mb: 3,
              background:
                "linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
            }}
          >
            AI FOR DEVELOPERS
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              mb: 3,
              maxWidth: "900px",
              mx: "auto",
            }}
          >
            Plan your projects at the speed of thought
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#a1a1aa",
              fontSize: { xs: "1rem", md: "1.25rem" },
              fontWeight: 400,
              lineHeight: 1.6,
              mb: 5,
              maxWidth: "700px",
              mx: "auto",
            }}
          >
            Transform your ideas into detailed project plans with AI. Get tech
            stack recommendations, task breakdowns, and timelines in seconds.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              // onClick={onGetStarted}
              sx={{
                bgcolor: "#ffffff",
                color: "#000000",
                textTransform: "none",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                "&:hover": { bgcolor: "#e5e5e5" },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PlayArrow />}
              sx={{
                borderColor: "#27272a",
                color: "#ffffff",
                textTransform: "none",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                "&:hover": { borderColor: "#3f3f46", bgcolor: "#18181b" },
              }}
            >
              Watch Demo
            </Button>
          </Stack>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            py: 8,
            borderTop: "1px solid #1a1a1a",
            borderBottom: "1px solid #1a1a1a",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
            sx={{ maxWidth: 900 }}
          >
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#a1a1aa" }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Social Proof */}
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{
              color: "#71717a",
              mb: 4,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Trusted by developers at
          </Typography>
          <Stack
            direction="row"
            spacing={6}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
          >
            {companies.map((company) => (
              <Typography
                key={company}
                variant="h6"
                sx={{ color: "#52525b", fontWeight: 600 }}
              >
                {company}
              </Typography>
            ))}
          </Stack>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 12 }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Everything you need to plan
            </Typography>
            <Typography variant="h6" sx={{ color: "#a1a1aa", fontWeight: 400 }}>
              Powerful features to streamline your development workflow
            </Typography>
          </Box>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
          >
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                key={index}
                sx={{ display: "flex" }}
              >
                <Card
                  sx={{
                    bgcolor: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    borderRadius: 2,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "stretch",
                    height: "100%",
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: "#3f3f46",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Box sx={{ color: "#6366f1", mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, mb: 2, color: "#ddddddff" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#a1a1aa", lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 12, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              mb: 3,
            }}
          >
            Ready to accelerate your workflow?
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#a1a1aa", mb: 5, fontWeight: 400 }}
          >
            Join thousands of developers who plan smarter with AI
          </Typography>
          <Button
            variant="contained"
            size="large"
            // onClick={onGetStarted}
            sx={{
              bgcolor: "#6366f1",
              color: "#ffffff",
              textTransform: "none",
              px: 5,
              py: 2,
              fontSize: "1.125rem",
              fontWeight: 600,
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            Proceed Your Idea Now
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ borderTop: "1px solid #1a1a1a", py: 6 }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={6}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                DevPlanner
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a" }}>
                AI-powered project planning assitant for modern developers
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Product
              </Typography>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  Features
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  Pricing
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  Changelog
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Resources
              </Typography>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  Documentation
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  API Reference
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  Guides
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Company
              </Typography>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  About
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  Blog
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  Careers
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Legal
              </Typography>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  Privacy
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#71717a",
                    cursor: "pointer",
                    "&:hover": { color: "#a1a1aa" },
                  }}
                >
                  Terms
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: "1px solid #1a1a1a",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#52525b" }}>
              © 2025 DevPlanner. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
