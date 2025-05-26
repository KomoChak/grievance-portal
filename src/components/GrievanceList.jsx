import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import GrievanceCard from "./GrievanceCard";

export default function GrievanceList({ grievances }) {
  if (!grievances || grievances.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <img src="/no-data.svg" alt="No Data" style={{ height: 120, marginBottom: 24 }} />
        <Typography variant="h6" color="text.secondary">
          No grievances found.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {grievances.map((g) => (
        <Grid item xs={12} sm={6} md={4} key={g.id}>
          <GrievanceCard grievance={g} />
        </Grid>
      ))}
    </Grid>
  );
}
