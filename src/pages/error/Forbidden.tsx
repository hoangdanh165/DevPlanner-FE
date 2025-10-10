import { CircularProgress, Box } from "@mui/material";

const Forbidden: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress /> : <div>Forbidden Page Content</div>
    </Box>
  );
};

export default Forbidden;
