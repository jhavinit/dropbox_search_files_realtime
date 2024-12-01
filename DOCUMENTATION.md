# Project Current Status

## Objectives:

1. IMPLEMENT THE SOLUTION TO PULL FILES FROM DROPBOX + INDEX IN ELASTICSEARCH + API SERVICE + UI (with list if searched files with content/filename and link to original file) => <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSLox2ia0u9peaoS7Sy19T60CQ4tO8JT46Q&s" width="20" height="20"/> DONE

2. HOSTING (render.com) => <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSLox2ia0u9peaoS7Sy19T60CQ4tO8JT46Q&s" width="20" height="20"/> DONE

3. PRD/DOCUMENTATION => <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSLox2ia0u9peaoS7Sy19T60CQ4tO8JT46Q&s" width="20" height="20"/> DONE

4. Support for TXT/DOCX/PDF(using tika (JVM) lib used using python script) => <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSLox2ia0u9peaoS7Sy19T60CQ4tO8JT46Q&s" width="20" height="20"/> DONE

5. Sort by created date for files => <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSLox2ia0u9peaoS7Sy19T60CQ4tO8JT46Q&s" width="20" height="20"/> DONE

## !! Important Notes and Assumptions !!

1. **Elasticsearch Integration**

   - Using Elasticsearch Cloud's 14-day trial plan (from December 1, 2024) (if will stop after that)
   - Service availability limited to trial period

2. **Deployment Considerations**

   - RENDER.com containers may become inactive during periods of inactivity but it comes up after some time automatically
   - Automatic or manual restart can be done for service restoration

3. **File Monitoring Strategy**

   - Currently implementing polling-based file monitoring from dropbox in dropbox service
   - Webhook implementation preferred but limited by RENDER.com beacuse ssh access of instance is not there causing issues in development (webhook approach is better as event based design pattern suits the use case)

4. **Server Configuration**

   - Running auxiliary server in Dropbox service
   - Required for RENDER.com web service classification
   - Not core to application logic

5. **Search Functionality**

   - Extended search to include filename matching
   - Enhancement beyond original content-only requirement
   - Aligned with common cloud provider search patterns

# Project Documentation

This document discusses the requirements, assumptions, design, development, and deployment process of the Dropbox Search Application project.

## Requirements

### Functional Requirements

1. Full-text search capability for files based on their content and link to open original file
2. Automated monitoring and indexing of Dropbox files

### Non-Functional Requirements

1. Support for concurrent request handling
2. Robust error handling and recovery
3. Assuming limited number of requests per second (e.g., <1000)
4. Ability to handle limited file sizes only (due to limited resources on deployment platform)

## System Architecture

### Component Overview

1. **Frontend Application**

   - React-based user interface
   - Communicates with API service to retrieve search results
   - Displays file listings and search results

\*\*\*\* Both dropbox service and api service have docker image build scripts in case we want to run them locally or as containers

2. **Dropbox Service**

   - Node.js backend service
   - Loads and monitors files from Dropbox
   - Indexes documents in Elasticsearch

3. **API Service**

   - Node.js backend service
   - Interfaces with Elasticsearch for search operations
   - Handles search queries and returns results

4. **Search Engine**

   - Elasticsearch for full-text search capabilities
   - Stores indexed file content and metadata

5. **Cloud Storage**
   - Dropbox as the primary file storage
   - Contains source documents for indexing

## Design Patterns and Architecture

### 1. Service Based Architecture

- Separate services for different concerns:
  - Frontend Service (UI)
  - API Service (Search Operations)
  - Dropbox Service (File Processing)
- Independent deployment and scaling
- Loose coupling between services

### 2. Event-Driven Architecture (Partial Implementation)

- File monitoring system based on events
- Polling mechanism as temporary solution
- Planned webhook integration for true event-driven updates

### 3. Repository Pattern

- Abstraction layer between business logic and data access
- Implementation in API service for Elasticsearch operations
- Clean separation of concerns

### 4. Factory Pattern

- Used in service creation and initialization
- Particularly in API and Dropbox services
- Helps manage complex object creation

### 5. Singleton Pattern

- Applied to database connections
- Elasticsearch client instance management
- Configuration management

### 6. Observer Pattern

- Frontend state management with React hooks
- Real-time UI updates based on search state changes
- Debounced search implementation

### 7. Adapter Pattern

- Integration with external services (Dropbox, Elasticsearch)
- Standardized interface for different file types
- Conversion between different data formats

### 8. Dependency Injection

- Service initialization in backend
- Component props in frontend
- Facilitates testing and modularity

### 9. Command Pattern

- Search query handling
- File processing operations
- Standardized operation execution

### 10. Circuit Breaker Pattern

- Error handling in API calls
- Retry logic for failed operations
- Graceful degradation of services

### Architecture Styles

#### 1. Lambda Architecture

- Batch Layer: File indexing system
- Speed Layer: Real-time search capabilities
- Serving Layer: API endpoints for query handling

#### 2. Clean Architecture

- Clear separation of concerns
- Independent of frameworks
- Dependency rule (dependencies point inward)
- Easily testable components

#### 3. MVC Pattern (Frontend)

- Model: TypeScript interfaces and data structures
- View: React components
- Controller: Service layer and hooks

## Technology Stack

### Frontend

- React.js
- Material-UI (MUI)

### Backend

- Node.js
- Express.js

### Python script to use tika to extract text from pdf file (this is called by dropbox service to get content from pdf file)

- Python
- TIKA

### External Services

- Dropbox API
- Dropbox SDK
- Elasticsearch Cloud

### Document Processing

- Textract
- PDF-Parse (npm packages)

## Use Case Flow - How it Works

1. User uploads files to Dropbox

2. Dropbox service monitors Dropbox and loads files from Dropbox and indexes (the content and filename) them in Elasticsearch

3. From render.com, user inputs search query

4. API service receives search query and searches Elasticsearch for results

5. Results are displayed in UI

## Repository Structure

- **frontend**: Frontend application code

- **backend/dropbox-service**: Dropbox service code

- **backend/api-service**: API service code

- **deploy**: For local deployment quick startup

- **infra**: Infrastructure files for deployment of elasticsearch and kibana locally (the version used is 7.13.4 which is not compatible with client in nodejs code so we need to change if required(right now code is using cloud version so no issues))

## APP features

1. Right now supports .txt/.docx/.pdf
2. We can do full text search and filename search => fuzzy search + filename pattern matching + case insensitive + partial match
3. Eslint used for linting
4. Prettier used for formatting
5. Monorepo based development
6. Docker based development for local deployment using nginx and containers
7. Successfully deployed to render.com and tested the application
8. Efficient logging and error handling
9. Pulls files from dropbox and indexes them in elasticsearch every 30mins (ignores files with same name as before)
10. Uses dropbox sdk to get files from dropbox and stores them in elasticsearch (using refresh token based authentication)

## Deployment

1. Deploy to RENDER.com (https://render.com/)
2. Configure environment variables acc to env file
3. Deploy the ui as static app
4. Deploy the dropbox service as container web service
5. Deploy the api service as container web service
6. Deploy the elasticsearch/kibana service as cloud in elasticsearch cloud

## Things not taken up due to time constraints/outside of scope

1. UI for handling folders
2. Webhooks for file updates from dropbox
3. Security (e.g., authentication, authorization, helmet, rate limiting etc)
4. Error handling and logging for better understanding
5. Scaling and performance optimization
