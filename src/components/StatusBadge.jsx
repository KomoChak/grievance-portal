import React from "react";
import { Chip } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const STATUS_MAP = {
  Pending: { color: "warning", icon: <HourglassEmptyIcon fontSize="small" /> },
  Resolved: { color: "success", icon: <CheckCircleIcon fontSize="small" /> },
  Rejected: { color: "error", icon: <ErrorOutlineIcon fontSize="small" /> },
};

export default function StatusBadge({ status }) {
  const { color, icon } = STATUS_MAP[status] || { color: "default", icon: null };
  return (
    <Chip
      icon={icon}
      label={status}
      color={color}
      variant="outlined"
      sx={{ fontWeight: "bold", minWidth: 100 }}
    />
  );
}
