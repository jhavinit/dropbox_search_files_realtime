import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * SearchBar component with material design and smooth animations
 * @param value - Current search query value
 * @param onChange - Callback function when search query changes
 */
const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search files..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "primary.main" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            "&:hover": {
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            },
            "&.Mui-focused": {
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            },
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
