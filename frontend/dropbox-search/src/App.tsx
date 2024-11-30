import React from 'react';
import { Container, Box, ThemeProvider, createTheme } from '@mui/material';
import SearchPage from './components/SearchPage';

// Create MUI theme
const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <SearchPage />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;