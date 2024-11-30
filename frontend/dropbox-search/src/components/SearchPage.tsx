import React, { useState, useEffect, useCallback } from 'react';
import {
  Stack,
  TextField,
  Box,
  Typography,
  Link,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Container
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import axios from 'axios';
import config from '../config/config';

interface SearchResult {
  filename: string;
  url: string;
  text: string;
}

const DEBOUNCE_DELAY = 500; // 500ms debounce delay

// Create API URL from config
const API_URL = `${config.apiUrl}:${config.apiPort}`;
console.log("API_URL", API_URL);

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (error) {
      setError('Failed to fetch search results');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial search on component mount
  useEffect(() => {
    handleSearch('');
  }, [handleSearch]);

  // Debounced search for user input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, handleSearch]);

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', overflow: 'hidden' }}>
      <Stack spacing={4} sx={{ height: '100%' }}>
        <Box sx={{ p: 3, backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            Dropbox Search
          </Typography>
          <TextField
            fullWidth
            size="medium"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          pb: 3,
          mx: -3, // Negative margin to counter Container padding
          px: 3,  // Add padding back to the scrollable content
          '::-webkit-scrollbar': {
            width: '8px',
          },
          '::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#666',
            },
          },
        }}>
          {isLoading ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {results.map((result, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      },
                      backgroundColor: 'white',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'primary.light',
                          color: 'primary.main',
                          mr: 2,
                        }}
                      >
                        <DescriptionIcon />
                      </Box>
                      <Typography
                        sx={{
                          flex: 1,
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {result.filename}
                      </Typography>
                      <Tooltip title="Open file">
                        <IconButton
                          component={Link}
                          href={result.url}
                          target="_blank"
                          rel="noopener"
                          size="small"
                          sx={{
                            ml: 1,
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                            },
                          }}
                        >
                          <OpenInNewIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Box sx={{ p: 2, backgroundColor: 'grey.50', flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: '1.5em',
                          height: '4.5em',
                        }}
                      >
                        {result.text}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          {!isLoading && results.length === 0 && searchQuery && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                color: 'text.secondary', 
                p: 4,
                backgroundColor: 'grey.50',
                borderRadius: 2,
                mt: 2
              }}
            >
              <Typography variant="h6">No results found</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Try adjusting your search terms
              </Typography>
            </Box>
          )}
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
};

export default SearchPage;
