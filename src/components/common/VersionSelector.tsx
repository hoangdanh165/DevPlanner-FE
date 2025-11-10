import type { FC } from "react";
import { Box, FormControl, Select, MenuItem, Typography } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

interface VersionSelectorProps {
  currentVersion?: string | null;
  availableVersions?: string[];
  onChangeVersion: (version: string) => void;
  loading?: boolean;
}

const VersionSelector: FC<VersionSelectorProps> = ({
  currentVersion,
  availableVersions = [],
  onChangeVersion,
  loading = false,
}) => {
  const versions = Array.from(
    new Set(
      [...availableVersions, currentVersion]
        .filter(Boolean)
        .map((v) => String(v))
    )
  );

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

  const handleChange = (event: any) => {
    const value = event.target.value as string;
    if (value && value !== currentVersion) {
      onChangeVersion(value);
    }
  };

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
        <Select
          labelId="version-select-label"
          value={currentVersion || versions[0]}
          onChange={handleChange}
          disabled={loading}
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
          {versions
            .sort((a, b) => {
              const na = parseInt(a.slice(1)) || 0;
              const nb = parseInt(b.slice(1)) || 0;
              return na - nb;
            })
            .map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default VersionSelector;
