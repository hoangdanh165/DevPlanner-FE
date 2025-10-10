import { CircularProgress, Box } from "@mui/material";

const LandingPage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress /> : <div>LandingPage Page Content</div>
    </Box>
  );
};

export default LandingPage;
