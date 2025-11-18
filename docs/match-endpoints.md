# Match Endpoints Documentation

This document provides comprehensive documentation for all match-related API endpoints in the Tactix Sports Analysis Application.

## Overview

The match endpoints allow users to create, retrieve, and manage sports match data including video uploads and analysis. All endpoints require authentication.

## Base URL

All endpoints are prefixed with `/api/v1/match`

## Authentication

All match endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Data Models

### Match Schema

```javascript
{
  userId: ObjectId (required, references User),
  title: String (required, min 2 chars),
  description: String (optional),
  teamA: String (required, min 2 chars),
  teamB: String (required, min 2 chars),
  matchDate: Date (optional),
  videoURL: String (optional),
  uploadStatus: String (enum: "pending", "processing", "completed", "failed", default: "pending"),
  uploadProgress: Number (0-100, default: 0),
  tags: [ObjectId] (references Tag),
  createdAt: Date,
  updatedAt: Date
}
```

## Background Upload Process

### Overview

When a match is created, the video upload process runs asynchronously in the background to prevent blocking the API response. This allows users to continue using the application while large video files are being processed.

### Upload Flow

1. **Match Creation**: User submits match data with video file
2. **Immediate Response**: API returns match ID and initial status ("pending")
3. **Background Processing**: `processVideoUpload` service starts asynchronously
4. **Status Updates**: Match document is updated with progress at each stage
5. **Completion**: Video URL is stored and status set to "completed"

### Services Involved

#### 1. `processVideoUpload` (upload-worker.service.js)

**Purpose:** Handles the asynchronous video upload workflow

**Process Steps:**

- Updates match status to "processing" (10% progress)
- Sets progress to 50% before Cloudinary upload begins
- Calls `uploadMatchToCloudinary` to upload the file
- Updates match with video URL and sets status to "completed" (100% progress)
- On failure: Sets status to "failed" and resets progress to 0

**Error Handling:**

- Logs upload failures
- Updates match status to "failed"
- Does not throw errors (fire-and-forget pattern)

#### 2. `uploadMatchToCloudinary` (match.cloudinary.config.js)

**Purpose:** Handles the actual file upload to Cloudinary with optimizations

**Features:**

- Supports both video and image uploads
- Configured folder: "tactix-match"
- Video optimizations:
  - MP4 format
  - Auto quality ("good" setting)
  - H.264 codec
  - 500kbps bitrate (reduced for faster upload)
  - 6MB chunk size for streaming
  - 2-minute timeout
- Returns success status, URL, and public_id

**Rollback Function:** `deleteMatchFromCloudinary`

- Deletes uploaded files in case of database insertion failure
- Used for cleanup in error scenarios

### Upload Status Monitoring

Users can monitor upload progress using the `/upload-status` endpoint:

```json
{
  "success": true,
  "data": {
    "matchId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "uploadStatus": "processing", // pending | processing | completed | failed
    "uploadProgress": 65, // 0-100
    "videoURL": null // populated when completed
  }
}
```

### Performance Considerations

- **Asynchronous Processing**: Prevents API timeouts for large files
- **Progress Tracking**: Users can monitor upload status in real-time
- **Optimized Uploads**: Cloudinary settings balance quality and speed
- **Error Recovery**: Failed uploads are marked appropriately for retry logic

### Integration Points

- **Validation**: Uses Zod schema for input validation before upload initiation
- **Database**: Updates match document at each upload stage
- **Authentication**: Background process doesn't require user context (operates on matchId)
- **File Handling**: Uses Multer memory storage to buffer files in RAM before upload

## Endpoints

### 1. Create Match

**Endpoint:** `POST /api/match/`  
**Description:** Creates a new match record and initiates background video upload.

**Authentication:** Required (JWT)

**Content-Type:** `multipart/form-data`

**Request Body:**

- `video` (file, required): Match video file (max 500MB, video/_ or image/_)
- `title` (string, required): Match title (min 2 characters)
- `description` (string, optional): Match description
- `teamA` (string, required): Team A name (min 2 characters)
- `teamB` (string, required): Team B name (min 2 characters)
- `matchDate` (string, optional): Match date (ISO 8601 format)

**Request Example:**

```bash
curl -X POST http://localhost:3000/api/match/ \
  -H "Authorization: Bearer your_jwt_token" \
  -F "video=@match_video.mp4" \
  -F "title=Championship Final" \
  -F "description=Exciting final match" \
  -F "teamA=Team Alpha" \
  -F "teamB=Team Beta" \
  -F "matchDate=2024-01-15T20:00:00Z"
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Match created successfully. Video upload in progress.",
  "data": {
    "match": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "userId": "64f1a2b3c4d5e6f7g8h9i0j0",
      "title": "Championship Final",
      "description": "Exciting final match",
      "teamA": "Team Alpha",
      "teamB": "Team Beta",
      "matchDate": "2024-01-15T20:00:00.000Z",
      "uploadStatus": "pending",
      "uploadProgress": 0,
      "tags": [],
      "createdAt": "2024-01-10T10:00:00.000Z",
      "updatedAt": "2024-01-10T10:00:00.000Z"
    },
    "matchId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "uploadStatus": "pending",
    "uploadProgress": 0
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid input data or missing video file
- `401 Unauthorized`: Missing or invalid JWT token
- `500 Internal Server Error`: Match creation failed

### 2. Get All Matches

**Endpoint:** `GET /api/match/`  
**Description:** Retrieves paginated list of user's matches.

**Authentication:** Required (JWT)

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: ?)

**Request Example:**

```bash
curl -X GET "http://localhost:3000/api/match/?page=1&limit=5" \
  -H "Authorization: Bearer your_jwt_token"
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "userId": "64f1a2b3c4d5e6f7g8h9i0j0",
        "title": "Championship Final",
        "description": "Exciting final match",
        "teamA": "Team Alpha",
        "teamB": "Team Beta",
        "matchDate": "2024-01-15T20:00:00.000Z",
        "videoURL": "https://cloudinary.com/...",
        "uploadStatus": "completed",
        "uploadProgress": 100,
        "tags": [
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
            "name": "Final",
            "color": "#FF0000"
          }
        ],
        "createdAt": "2024-01-10T10:00:00.000Z",
        "updatedAt": "2024-01-10T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalMatches": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid JWT token
- `500 Internal Server Error`: Database query failed

### 3. Get Single Match

**Endpoint:** `GET /api/match/:matchId`  
**Description:** Retrieves detailed information for a specific match.

**Authentication:** Required (JWT)

**URL Parameters:**

- `matchId` (string, required): MongoDB ObjectId of the match

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/match/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer your_jwt_token"
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "userId": "64f1a2b3c4d5e6f7g8h9i0j0",
    "title": "Championship Final",
    "description": "Exciting final match",
    "teamA": "Team Alpha",
    "teamB": "Team Beta",
    "matchDate": "2024-01-15T20:00:00.000Z",
    "videoURL": "https://cloudinary.com/...",
    "uploadStatus": "completed",
    "uploadProgress": 100,
    "tags": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "name": "Final",
        "color": "#FF0000"
      }
    ],
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: Match not found or doesn't belong to user
- `409 Conflict`: Video upload not completed (when uploadStatus !== "completed")
- `500 Internal Server Error`: Database query failed

### 4. Get Upload Status

**Endpoint:** `GET /api/match/:matchId/upload-status`  
**Description:** Retrieves the current upload status and progress for a match's video.

**Authentication:** Required (JWT)

**URL Parameters:**

- `matchId` (string, required): MongoDB ObjectId of the match

**Request Example:**

```bash
curl -X GET http://localhost:3000/api/match/64f1a2b3c4d5e6f7g8h9i0j1/upload-status \
  -H "Authorization: Bearer your_jwt_token"
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "matchId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "uploadStatus": "processing",
    "uploadProgress": 65,
    "videoURL": null
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: Match not found or doesn't belong to user
- `500 Internal Server Error`: Database query failed

## Upload Status Values

- `pending`: Upload has been initiated but not yet started
- `processing`: Video is currently being uploaded/processed
- `completed`: Upload and processing completed successfully
- `failed`: Upload or processing failed

## Validation Rules

### Create Match Validation:

- `title`: Required, minimum 2 characters
- `teamA`: Required, minimum 2 characters
- `teamB`: Required, minimum 2 characters
- `matchDate`: Optional, must be valid ISO date string if provided
- `video`: Required, max 500MB, must be video/_ or image/_ MIME type

## Notes

1. Match creation initiates a background upload process to Cloudinary
2. Video URL is only available after uploadStatus becomes "completed"
3. All matches are filtered by the authenticated user's ID
4. Tags are populated in list endpoints for better performance
5. Pagination is implemented for the get all matches endpoint
6. Authentication middleware validates JWT tokens on all endpoints

## Error Handling

All endpoints use consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```
