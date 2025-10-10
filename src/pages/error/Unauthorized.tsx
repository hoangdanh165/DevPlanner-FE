import { Box, CircularProgress } from "@mui/material";

const Unauthorized: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress /> : <div>Unauthorized Page Content</div>
    </Box>
  );
};

export default Unauthorized;
