import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";

interface TabsSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "tasks", label: "Tasks" },
  { id: "docs", label: "Docs" },
];

export function TabsSection({ activeTab, onTabChange }: TabsSectionProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Tabs Navigation */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => onTabChange(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                label={tab.label}
                value={tab.id}
                sx={{ textTransform: "none", fontWeight: 500 }}
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1, bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
            {/* Header with icon and regenerate button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h4">📋</Typography>
                <Typography variant="h6" fontWeight={600}>
                  Overview
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                sx={{ textTransform: "none" }}
              >
                Regenerate
              </Button>
            </Box>

            {/* Content */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.7 }}
            >
              This project aims to help users track their fitness goals with
              AI-powered insights and personalized recommendations. The
              application will provide workout tracking, nutrition monitoring,
              and progress analytics to help users achieve their health
              objectives.
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                Save Project
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                Export
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
