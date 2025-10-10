import { Box, CircularProgress } from "@mui/material";

const NotFound: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress /> : <div>NotFound Page Content</div>
    </Box>
  );
};

export default NotFound;
