import React from 'react';
import { AppBar, Toolbar, Stack, Typography } from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

/**
 * Header component for the search page
 * Displays the application title and logo in a fixed header
 */
const SearchHeader: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ minHeight: "64px !important" }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            px: { xs: 2, sm: 3 },
          }}
        >
          <CloudQueueIcon
            sx={{
              fontSize: "2rem",
              color: "primary.main",
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              color: "primary.main",
              flexGrow: 1,
            }}
          >
            Dropbox Search
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default SearchHeader;
