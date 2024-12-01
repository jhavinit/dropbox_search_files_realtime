import React from "react";
import {
  Paper,
  Stack,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Link,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { SearchResult } from "../types";

interface SearchResultCardProps {
  result: SearchResult;
}

/**
 * Get the appropriate icon based on file extension
 */
const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <PictureAsPdfIcon 
        className="file-icon"
        sx={{
          fontSize: "2rem",
          transition: "all 0.3s ease",
          color: "#f40f02" // PDF red color
        }}
      />;
    case 'docx':
    case 'doc':
      return <DescriptionIcon 
        className="file-icon"
        sx={{
          fontSize: "2rem",
          transition: "all 0.3s ease",
          color: "#2b579a" // Word blue color
        }}
      />;
    default:
      return <ArticleIcon 
        className="file-icon"
        sx={{
          fontSize: "2rem",
          transition: "all 0.3s ease",
          color: "#4d5156" // Gray color for text files
        }}
      />;
  }
};

/**
 * Card component to display individual search results
 * Includes file information and a link to open in Dropbox
 * @param result - Search result object containing filename, text, and url
 */
const SearchResultCard: React.FC<SearchResultCardProps> = ({ result }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2.5,
        height: "100%",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          "& .file-icon": {
            transform: "scale(1.1)",
          },
          "& .open-button": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Stack spacing={2} sx={{ height: "100%", justifyContent: "space-between" }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          sx={{ mb: 1 }}
        >
          {getFileIcon(result.filename)}
          <Box flex={1}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                color: "primary.main",
                mb: 0.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {result.filename}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
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
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                lineHeight: "1.5em",
                maxHeight: "4.5em",
                fontSize: "0.875rem",
                position: "relative",
                maxWidth: "200px",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: "25%",
                  height: "1.5em",
                  background:
                    "linear-gradient(to right, transparent, #fff 50%)",
                  pointerEvents: "none",
                },
              }}
              title={result.text}
            >
              {result.text}
            </Typography>
          </Box>
        </Stack>
        <Box
          sx={{
            mt: "auto",
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Tooltip title="Open in Dropbox">
            <IconButton
              className="open-button"
              component={Link}
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                opacity: 0.8,
                transform: "translateY(4px)",
                transition: "all 0.3s ease",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "primary.dark",
                },
              }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
    </Paper>
  );
};

export default SearchResultCard;
