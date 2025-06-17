// src/components/admin/Dashboard/RecentActivity.jsx
import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";

export default function RecentActivity({ data }) {
  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      {data.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No recent activity to display.
        </Typography>
      ) : (
        <List dense>
          {data.map((activity, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={activity.message}
                secondary={new Date(activity.timestamp).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
