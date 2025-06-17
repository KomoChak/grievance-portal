import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const INDIGO = '#1A237E';
const WHITE = '#fff';

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        bgcolor: INDIGO,
        color: WHITE,
        borderBottom: '1px solid #e0e0e0',
        zIndex: 1300,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 70,
          px: { xs: 2, md: 4 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              color: WHITE,
              fontSize: { xs: 18, md: 22 },
              textAlign: 'center',
              width: '100%',
            }}
          >
            Coal India Grievance Portal
          </Typography>
        </Box>
      </Toolbar>;
    </AppBar>
  );
}
