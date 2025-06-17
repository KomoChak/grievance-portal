import React from "react";
import { Box, Typography, Link } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 2,
        px: 2,
        mt: "auto",
        backgroundColor: "#22223b",
        color: "#fff",
        textAlign: "center",
        position: "relative",
        bottom: 0,
        left: 0,
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Grievance Portal | Powered by Coal India Ltd.
      </Typography>
      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        For support, contact{" "}
        <Link href="mailto:support@coalindia.in" color="inherit" underline="always">
          support@coalindia.in
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;
