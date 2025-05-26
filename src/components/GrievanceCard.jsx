import React from "react";
import { Card, CardContent, Typography, Box, IconButton, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import StatusBadge from "./StatusBadge";

export default function GrievanceCard({ grievance }) {
  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight="bold">{grievance.subject}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {grievance.category} | {grievance.date}
            </Typography>
            <StatusBadge status={grievance.status} />
          </Box>
          <Box>
            <IconButton color="primary" href={`/grievances/${grievance.id}`}>
              <VisibilityIcon />
            </IconButton>
            <IconButton color="secondary">
              <DownloadIcon />
            </IconButton>
          </Box>
        </Stack>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {grievance.details ? (grievance.details.length > 100
            ? grievance.details.slice(0, 100) + "..."
            : grievance.details) : ""}
        </Typography>
      </CardContent>
    </Card>
  );
}
