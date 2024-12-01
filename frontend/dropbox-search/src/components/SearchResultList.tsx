import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Paper,
  IconButton,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";
import { SearchResult } from "../types";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ArticleIcon from "@mui/icons-material/Article";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmptyState from "./EmptyState";

interface SearchResultListProps {
  results: SearchResult[];
  isLoading?: boolean;
  error?: string | null;
  searchQuery?: string;
}

const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <PictureAsPdfIcon 
        sx={{
          color: "#f40f02" // PDF red color
        }}
      />;
    case 'docx':
    case 'doc':
      return <DescriptionIcon 
        sx={{
          color: "#2b579a" // Word blue color
        }}
      />;
    default:
      return <ArticleIcon 
        sx={{
          color: "#6e6e6e" // Default gray color
        }}
      />;
  }
};

const SearchResultList: React.FC<SearchResultListProps> = ({ 
  results, 
  isLoading = false,
  error = null,
  searchQuery = ""
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
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
    <Paper 
      elevation={0} 
      sx={{ 
        backgroundColor: "transparent",
        width: "100%",
        maxHeight: "calc(100vh - 280px)",
        overflow: "auto"
      }}
    >
      <List sx={{ p: 0 }}>
        {results.map((result) => (
          <ListItem
            key={result.filename}
            sx={{
              mb: 1,
              backgroundColor: "white",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="open"
                onClick={() => window.open(result.url, "_blank")}
              >
                <OpenInNewIcon />
              </IconButton>
            }
          >
            <ListItemIcon>
              {getFileIcon(result.filename)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    component="div"
                    sx={{
                      fontWeight: 500,
                      color: "primary.main",
                      "&:hover": {
                        color: "primary.dark"
                      }
                    }}
                  >
                    {result.filename}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(result.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Stack>
                </Box>
              }
              secondary={
                <Box
                  sx={{
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      maxHeight: "3em",
                      color: "text.secondary"
                    }}
                  >
                    {result.text}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SearchResultList;
