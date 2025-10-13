import { Box, Container, TextField, Button, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
}

export function InputSection({
  value,
  onChange,
  onGenerate,
}: InputSectionProps) {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, fontWeight: 500 }}
        >
          What project are you planning?
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your project idea..."
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.default",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={onGenerate}
            endIcon={<PlayArrowIcon />}
            sx={{ minWidth: 140, textTransform: "none", fontWeight: 500 }}
          >
            Generate
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
