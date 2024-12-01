/**
 * Root application component
 */

import React from 'react';
import { Container, Box, ThemeProvider, CssBaseline } from '@mui/material';
import SearchPage from './components/SearchPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
          <Container maxWidth="lg">
            <SearchPage />
          </Container>
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;