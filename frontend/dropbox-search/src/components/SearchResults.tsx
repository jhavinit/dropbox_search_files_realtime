import React from 'react';
import { Box, Grid, CircularProgress, Typography } from '@mui/material';
import { SearchResult } from '../types';
import SearchResultCard from './SearchResultCard';
import EmptyState from './EmptyState';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

/**
 * Component to display search results in a responsive grid
 * Handles loading, error, and empty states
 */
const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  searchQuery,
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (results.length === 0) {
    return <EmptyState searchQuery={searchQuery} />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "calc(100vh - 280px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
          backgroundColor: "#f5f5f5",
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: "4px",
          backgroundColor: "rgba(0,0,0,.2)",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(0,0,0,.3)",
        },
      }}
    >
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          mt: 0,
          pb: 3, 
          mb: 2  
        }}
      >
        {results.map((result) => (
          <Grid item xs={12} sm={6} md={4} key={result.filename}>
            <SearchResultCard result={result} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchResults;
