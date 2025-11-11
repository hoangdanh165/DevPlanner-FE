import type { FC } from "react";
import { Box, FormControl, Select, MenuItem, Typography } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { useGeneration } from "@/contexts/GenerationContext";

interface VersionSelectorProps {
  onChangeVersion: (version: number) => void;
}

const VersionSelector: FC<VersionSelectorProps> = ({ onChangeVersion }) => {
  const { state } = useGeneration();
  const {
    currentVersion = 0,
    availableVersions = [],
    global: isRegenerating,
  } = state;

  const versions = Array.from(
    new Set(
      [...availableVersions, currentVersion].filter(
        (v): v is number => typeof v === "number" && v > 0
      )
    )
  ).sort((a, b) => a - b);

  if (versions.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1,
        }}
      >
        <HistoryIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }} />
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}
        >
          No version generated
        </Typography>
      </Box>
    );
  }

  const handleChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    if (value && value !== currentVersion) {
      onChangeVersion(value);
    }
  };

  // Đảm bảo Select luôn có giá trị hợp lệ
  const selectValue =
    versions.includes(currentVersion) && currentVersion > 0
      ? currentVersion
      : versions[versions.length - 1];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <FormControl
        size="small"
        sx={{
          minWidth: 90,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            fontSize: 13,
            color: "#fff",
          },
          "& .MuiSvgIcon-root": {
            fontSize: 18,
          },
        }}
      >
        <Select<number>
          labelId="version-select-label"
          value={selectValue}
          onChange={handleChange}
          disabled={isRegenerating}
          sx={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: 2,
            "& fieldset": {
              borderColor: "rgba(255,255,255,0.18)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(168,85,247,0.8)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(236,72,153,0.9)",
            },
          }}
        >
          {versions.map((v) => (
            <MenuItem key={v} value={v}>
              v{v}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default VersionSelector;
