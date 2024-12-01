import React from "react";
import { Stack, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

interface EmptyStateProps {
  searchQuery: string;
}

/**
 * Shared component for displaying empty state messages
 * Used in both grid and list views
 */
const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery }) => {
  if (!searchQuery) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        sx={{
          py: 8,
          color: "text.secondary"
        }}
      >
        <Typography>Enter a search term to begin</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{
        py: 8,
        color: "text.secondary"
      }}
    >
      <SearchOffIcon sx={{ fontSize: 48 }} />
      <Typography variant="h6">
        No results found for "{searchQuery}"
      </Typography>
      <Typography variant="body2">
        Try adjusting your search terms
      </Typography>
    </Stack>
  );
};

export default EmptyState;
