/**
 * Search page component for searching Dropbox files
 * Provides a modern, responsive interface for searching and viewing files
 */

import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Container,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { SearchResult } from "../types";
import { apiService } from "../services/api.service";
import { useDebounce } from "../hooks/useDebounce";
import { SortOrder } from "../enums/sort.enum";
import SearchHeader from "./SearchHeader";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import SearchResultList from "./SearchResultList";

// Debounce delay for search input to prevent excessive API calls
const DEBOUNCE_DELAY = 500;

type ViewMode = "card" | "list";

/**
 * Main search page component that orchestrates the search functionality
 * and manages the overall layout of the application
 */
const SearchPage: React.FC = () => {
  // State management for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  // Debounce search query to prevent too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleSortChange = (event: any) => {
    setSortOrder(event.target.value as SortOrder);
  };

  /**
   * Handles the search operation by calling the API and updating state
   * @param query - The search query string
   */
  const handleSearch = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.searchFiles(query, sortOrder);
        setResults(response.data);
      } catch (err) {
        setError("An unexpected error occurred");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [sortOrder]
  );

  // Effect to trigger search when debounced query or sort order changes
  React.useEffect(() => {
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, handleSearch]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <SearchHeader />

      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          px: { xs: 2, sm: 3 },
          flex: 1,
        }}
      >
        <Stack
          spacing={4}
          sx={{
            maxWidth: "960px",
            mx: "auto",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{
              color: "primary.main",
              fontWeight: 600,
              textAlign: "center",
              mb: 2,
            }}
          >
            Search Your Files
          </Typography>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,
              gap: 2,
              alignItems: "center",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="sort-order-label">Sort by Date</InputLabel>
              <Select
                labelId="sort-order-label"
                value={sortOrder}
                label="Sort by Date"
                onChange={handleSortChange}
              >
                <MenuItem value={SortOrder.DESC}>Newest First</MenuItem>
                <MenuItem value={SortOrder.ASC}>Oldest First</MenuItem>
              </Select>
            </FormControl>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="card" aria-label="card view">
                <ViewModuleIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {viewMode === "card" ? (
            <SearchResults
              results={results}
              isLoading={isLoading}
              error={error}
              searchQuery={searchQuery}
            />
          ) : (
            <SearchResultList
              results={results}
              isLoading={isLoading}
              error={error}
              searchQuery={searchQuery}
            />
          )}
        </Stack>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchPage;
