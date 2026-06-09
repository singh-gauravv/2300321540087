# Stage 1

## Notification System REST API Design

### Core Actions

1. **Retrieve Notifications** - Fetch all notifications for a logged-in user
2. **Mark as Read** - Update notification status to read
3. **Delete Notification** - Remove a notification from the user's inbox
4. **Bulk Operations** - Mark multiple notifications as read or delete them
5. **Get Notification Count** - Fetch unread notification count for the user

---

## REST API Endpoints

### 1. Get All Notifications for User

**Endpoint:** `GET /api/v1/users/{userId}/notifications`

**Description:** Retrieve all notifications for the authenticated user.

**Path Parameters:**
- `userId` (string, required): Unique identifier of the user

**Query Parameters:**
- `status` (string, optional): Filter by status (`unread`, `read`, `all`). Default: `all`
- `page` (integer, optional): Pagination page number. Default: `1`
- `limit` (integer, optional): Number of records per page. Default: `20`, Max: `100`
- `sortBy` (string, optional): Sort field (`createdAt`, `updatedAt`). Default: `createdAt`
- `order` (string, optional): Sort order (`asc`, `desc`). Default: `desc`

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
```

**Response Headers:**
```
Content-Type: application/json
X-Total-Count: {total_notification_count}
X-Page: {current_page}
X-Total-Pages: {total_pages}
Cache-Control: no-cache
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123456",
        "userId": "user_789",
        "title": "New Message",
        "message": "You have a new message from John Doe",
        "type": "message",
        "priority": "high",
        "status": "unread",
        "category": "communication",
        "actionUrl": "/messages/msg_001",
        "imageUrl": "https://api.example.com/images/icon-message.png",
        "metadata": {
          "sourceId": "msg_001",
          "sourceType": "message"
        },
        "createdAt": "2026-06-09T10:30:00Z",
        "updatedAt": "2026-06-09T10:30:00Z",
        "expiresAt": null
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalRecords": 45,
      "totalPages": 3
    }
  },
  "message": "Notifications retrieved successfully",
  "timestamp": "2026-06-09T10:35:12Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authentication token"
  },
  "timestamp": "2026-06-09T10:35:12Z"
}
```

---

### 2. Get Notification by ID

**Endpoint:** `GET /api/v1/users/{userId}/notifications/{notificationId}`

**Description:** Retrieve a specific notification by its ID.

**Path Parameters:**
- `userId` (string, required): Unique identifier of the user
- `notificationId` (string, required): Unique identifier of the notification

**Request Headers:**
```
Authorization: Bearer {access_token}
Accept: application/json
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "id": "notif_123456",
    "userId": "user_789",
    "title": "New Message",
    "message": "You have a new message from John Doe",
    "type": "message",
    "priority": "high",
    "status": "unread",
    "category": "communication",
    "actionUrl": "/messages/msg_001",
    "imageUrl": "https://api.example.com/images/icon-message.png",
    "metadata": {
      "sourceId": "msg_001",
      "sourceType": "message"
    },
    "createdAt": "2026-06-09T10:30:00Z",
    "updatedAt": "2026-06-09T10:30:00Z",
    "expiresAt": null
  },
  "message": "Notification retrieved successfully",
  "timestamp": "2026-06-09T10:35:12Z"
}
```

---

### 3. Mark Notification as Read

**Endpoint:** `PATCH /api/v1/users/{userId}/notifications/{notificationId}/read`

**Description:** Update notification status to read.

**Path Parameters:**
- `userId` (string, required): Unique identifier of the user
- `notificationId` (string, required): Unique identifier of the notification

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "read",
  "readAt": "2026-06-09T10:35:12Z"
}
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "id": "notif_123456",
    "userId": "user_789",
    "status": "read",
    "updatedAt": "2026-06-09T10:35:12Z"
  },
  "message": "Notification marked as read",
  "timestamp": "2026-06-09T10:35:12Z"
}
```

---

### 4. Mark Multiple Notifications as Read

**Endpoint:** `PATCH /api/v1/users/{userId}/notifications/bulk/read`

**Description:** Mark multiple notifications as read in a single request.

**Path Parameters:**
- `userId` (string, required): Unique identifier of the user

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notificationIds": [
    "notif_123456",
    "notif_789012",
    "notif_345678"
  ]
}
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "updatedCount": 3,
    "notificationIds": [
      "notif_123456",
      "notif_789012",
      "notif_345678"
    ],
    "timestamp": "2026-06-09T10:35:12Z"
  },
  "message": "3 notifications marked as read",
  "timestamp": "2026-06-09T10:35:12Z"
}
```

---

### 5. Delete Notification

**Endpoint:** `DELETE /api/v1/users/{userId}/notifications/{notificationId}`

**Description:** Delete a specific notification.

**Path Parameters:**
- `userId` (string, required): Unique identifier of the user
- `notificationId` (string, required): Unique identifier of the notification

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**HTTP Status Code:** `204 No Content`

**Response Body:** (Empty for 204, or optional JSON)
```json
{
  "success": true,
  "message": "Notification deleted successfully",
  "timestamp": "2026-06-09T10:35:12Z"
}
```

---

### 6. Delete Multiple Notifications

**Endpoint:** `DELETE /api/v1/users/{userId}/notifications/bulk`

**Description:** Delete multiple notifications in a single request.

**Path Parameters:**
- `userId` (string, required): Unique identifier of the user

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notificationIds": [
    "notif_123456",
    "notif_789012",
    "notif_345678"
  ]
}
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "deletedCount": 3,
    "notificationIds": [
      "notif_123456",
      "notif_789012",
      "notif_345678"
    ]
  },
  "message": "3 notifications deleted successfully",
  "timestamp": "2026-06-09T10:35:12Z"
}
```

---

### 7. Get Unread Notification Count

**Endpoint:** `GET /api/v1/users/{userId}/notifications/count/unread`

**Description:** Get the count of unread notifications for the user.

**Path Parameters:**
- `userId` (string, required): Unique identifier of the user

**Request Headers:**
```
Authorization: Bearer {access_token}
Accept: application/json
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "userId": "user_789",
    "unreadCount": 12,
    "totalCount": 45
  },
  "message": "Unread count retrieved successfully",
  "timestamp": "2026-06-09T10:35:12Z"
}
```

---

### 8. Mark All Notifications as Read

**Endpoint:** `PATCH /api/v1/users/{userId}/notifications/mark-all-read`

**Description:** Mark all unread notifications as read for the user.

**Path Parameters:**
- `userId` (string, required): Unique identifier of the user

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "markAllAsRead": true
}
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "success": true,
  "data": {
    "markedCount": 12,
    "timestamp": "2026-06-09T10:35:12Z"
  },
  "message": "All notifications marked as read",
  "timestamp": "2026-06-09T10:35:12Z"
}
```

---

## JSON Schema Definitions

### Notification Schema

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the notification",
      "pattern": "^notif_[a-zA-Z0-9]{12}$"
    },
    "userId": {
      "type": "string",
      "description": "ID of the user who receives the notification",
      "pattern": "^user_[a-zA-Z0-9]{12}$"
    },
    "title": {
      "type": "string",
      "description": "Short, descriptive title of the notification",
      "minLength": 1,
      "maxLength": 100
    },
    "message": {
      "type": "string",
      "description": "Detailed message content",
      "minLength": 1,
      "maxLength": 500
    },
    "type": {
      "type": "string",
      "enum": ["message", "alert", "system", "reminder", "promotion", "feedback"],
      "description": "Category type of the notification"
    },
    "priority": {
      "type": "string",
      "enum": ["low", "medium", "high", "critical"],
      "description": "Priority level of the notification",
      "default": "medium"
    },
    "status": {
      "type": "string",
      "enum": ["unread", "read", "archived"],
      "description": "Current status of the notification",
      "default": "unread"
    },
    "category": {
      "type": "string",
      "description": "Functional category for grouping",
      "enum": ["communication", "transaction", "account", "security", "social", "system"]
    },
    "actionUrl": {
      "type": "string",
      "format": "uri",
      "description": "URL to navigate to when notification is clicked",
      "nullable": true
    },
    "imageUrl": {
      "type": "string",
      "format": "uri",
      "description": "URL of the notification icon or image",
      "nullable": true
    },
    "metadata": {
      "type": "object",
      "description": "Additional contextual data",
      "properties": {
        "sourceId": {
          "type": "string",
          "description": "ID of the source entity (message, order, etc.)"
        },
        "sourceType": {
          "type": "string",
          "description": "Type of the source entity"
        }
      },
      "additionalProperties": true
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp when notification was created"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp of last update"
    },
    "expiresAt": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp when notification expires (optional)",
      "nullable": true
    }
  },
  "required": ["id", "userId", "title", "message", "type", "status", "createdAt", "updatedAt"],
  "additionalProperties": false
}
```

### Error Response Schema

```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "value": false
    },
    "error": {
      "type": "object",
      "properties": {
        "code": {
          "type": "string",
          "enum": [
            "UNAUTHORIZED",
            "FORBIDDEN",
            "NOT_FOUND",
            "BAD_REQUEST",
            "CONFLICT",
            "INTERNAL_SERVER_ERROR",
            "SERVICE_UNAVAILABLE"
          ]
        },
        "message": {
          "type": "string",
          "description": "Human-readable error message"
        },
        "details": {
          "type": "object",
          "description": "Additional error details (optional)",
          "additionalProperties": true
        }
      },
      "required": ["code", "message"]
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["success", "error", "timestamp"]
}
```

---

## Real-Time Notifications Mechanism

### WebSocket Connection for Real-Time Updates

**WebSocket Endpoint:** `wss://api.example.com/api/v1/notifications/stream`

**Connection Parameters:**
- `userId` (string): User ID for authentication
- `token` (string): Bearer token for authentication

**Connection Example:**
```javascript
const ws = new WebSocket(
  `wss://api.example.com/api/v1/notifications/stream?userId=user_789&token=${accessToken}`
);
```

### WebSocket Message Structure

#### Outgoing (Client to Server) - Heartbeat

```json
{
  "type": "heartbeat",
  "timestamp": "2026-06-09T10:35:12Z"
}
```

#### Incoming (Server to Client) - New Notification

```json
{
  "type": "notification:new",
  "data": {
    "id": "notif_123456",
    "userId": "user_789",
    "title": "New Message",
    "message": "You have a new message from John Doe",
    "type": "message",
    "priority": "high",
    "status": "unread",
    "category": "communication",
    "actionUrl": "/messages/msg_001",
    "imageUrl": "https://api.example.com/images/icon-message.png",
    "metadata": {
      "sourceId": "msg_001",
      "sourceType": "message"
    },
    "createdAt": "2026-06-09T10:30:00Z",
    "updatedAt": "2026-06-09T10:30:00Z",
    "expiresAt": null
  },
  "timestamp": "2026-06-09T10:30:00Z"
}
```

#### Incoming - Notification Status Update

```json
{
  "type": "notification:updated",
  "data": {
    "id": "notif_123456",
    "userId": "user_789",
    "status": "read",
    "updatedAt": "2026-06-09T10:35:00Z"
  },
  "timestamp": "2026-06-09T10:35:00Z"
}
```

#### Incoming - Notification Deleted

```json
{
  "type": "notification:deleted",
  "data": {
    "id": "notif_123456",
    "userId": "user_789"
  },
  "timestamp": "2026-06-09T10:35:00Z"
}
```

#### Incoming - Connection Acknowledged

```json
{
  "type": "connection:established",
  "data": {
    "userId": "user_789",
    "connectionId": "conn_abc123",
    "message": "Connected to notification stream"
  },
  "timestamp": "2026-06-09T10:30:00Z"
}
```

#### Incoming - Connection Error

```json
{
  "type": "error",
  "data": {
    "code": "UNAUTHORIZED",
    "message": "Invalid authentication token"
  },
  "timestamp": "2026-06-09T10:30:00Z"
}
```

### WebSocket Connection Lifecycle

1. **Client connects** with userId and token
2. **Server validates** and acknowledges connection
3. **Server sends** real-time notifications via WebSocket
4. **Client sends** heartbeat every 30 seconds (keep-alive)
5. **Server closes** connection on inactivity (5+ minutes without heartbeat)
6. **Client reconnects** automatically upon disconnect


