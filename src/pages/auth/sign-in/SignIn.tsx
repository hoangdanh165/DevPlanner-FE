import { Box, CircularProgress } from "@mui/material";

const SignIn: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress /> : <div>SignIn Page Content</div>
    </Box>
  );
};

export default SignIn;
