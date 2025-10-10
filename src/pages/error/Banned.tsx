import { Box, CircularProgress } from "@mui/material";

const Banned: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress /> : <div>Banned Page Content</div>
    </Box>
  );
};

export default Banned;
