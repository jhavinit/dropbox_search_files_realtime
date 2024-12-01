# Dropbox Document Search Application

## PROJECT DEPLOYMENT LINK:

https://borneo-test.onrender.com/

## Please open Design/Development Document => DOCUMENTATION.md File

## Product Requirements Document (PRD)

### 1. Overview

#### 1.1 Product Vision

The Dropbox Document Search Application is a modern web-based solution that enables users to efficiently search through their Dropbox documents based on content. The application provides a Google Docs-like interface for seamless content discovery across stored documents.

#### 1.2 Problem Statement

Users with large collections of documents in Dropbox often struggle to locate specific content within their files. Traditional file browsing and filename-based search are insufficient when users need to find documents based on their content.

#### 1.3 Target Users

- Knowledge workers managing large document collections
- Teams sharing document repositories
- Researchers and academics organizing research papers
- Business professionals managing client documents

### 2. Features and Requirements

#### 2.1 Core Features

##### 2.1.1 Document Search

- **Real-time files update from dropbox:**

  - Periodically fetches files from Dropbox
  - Updates the search index for efficient search

- **Real-time Search:**

  - Instant search results as users type
  - Debounced search with 500ms delay to optimize API calls
  - Support for partial word matches + case insensitive + file name matches + fuzzy search

- **Search Results Display:**
  - File name and preview of matched content
  - Direct links to open documents in Dropbox
  - Responsive grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
  - Beautiful card-based result presentation

##### 2.1.2 User Interface

- **Modern Design:**

  - Clean, minimalist interface
  - Material Design components
  - Responsive layout for all screen sizes
  - Professional color scheme

- **Interactive Elements:**
  - Hover animations on cards
  - Smooth transitions
  - Loading states
  - Error handling with user-friendly messages

#### 2.2 Technical Requirements

##### 2.2.1 Frontend

- **Technology Stack:**

  - React for UI components
  - TypeScript for type safety
  - Material-UI (MUI) for design system
  - Axios for API communication

##### 2.2.2 Backend Integration

- **Backend:**

  - Dropbox API v2 for file access
  - RESTful architecture with node.js
  - Database integration with elasticsearch
  - Secure authentication
  - Error handling and retry logic

##### 2.2.3 Search Service

- **Search Capabilities:**
  - Full-text search
  - Content indexing
  - Relevance scoring
  - Fast query response

### 4. User Experience

#### 4.1 Search Flow

1. User enters search query in SearchBar
2. Input is debounced (500ms)
3. API request is made to search service
4. Loading state is displayed
5. Results are rendered in responsive grid
6. Error states are handled gracefully
