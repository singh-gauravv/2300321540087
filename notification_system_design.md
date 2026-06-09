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
  "data": [
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
      "createdAt": "2026-06-09T10:30:00Z"
    }
  ]
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
    "createdAt": "2026-06-09T10:30:00Z"
  }
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
{}
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "data": {
    "id": "notif_123456",
    "status": "read"
  }
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
  "notificationIds": ["notif_123456", "notif_789012", "notif_345678"]
}
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "data": {
    "updatedCount": 3
  }
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

**Response Body:** (Empty)

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
  "notificationIds": ["notif_123456", "notif_789012", "notif_345678"]
}
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "data": {
    "deletedCount": 3
  }
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
  "data": {
    "unreadCount": 12,
    "totalCount": 45
  }
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
{}
```

**HTTP Status Code:** `200 OK`

**Response Body:**
```json
{
  "data": {
    "markedCount": 12
  }
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
        }
      },
      "required": ["code", "message"]
    }
  },
  "required": ["error"]
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
    "actionUrl": "/messages/msg_001"
  }
}
```

#### Incoming - Notification Status Update

```json
{
  "type": "notification:updated",
  "data": {
    "id": "notif_123456",
    "status": "read"
  }
}
```

#### Incoming - Notification Deleted

```json
{
  "type": "notification:deleted",
  "data": {
    "id": "notif_123456"
  }
}
```

#### Incoming - Connection Acknowledged

```json
{
  "type": "connection:established",
  "data": {
    "userId": "user_789",
    "connectionId": "conn_abc123"
  }
}
```

#### Incoming - Connection Error

```json
{
  "type": "error",
  "data": {
    "code": "UNAUTHORIZED",
    "message": "Invalid authentication token"
  }
}
```

### WebSocket Connection Lifecycle

1. **Client connects** with userId and token
2. **Server validates** and acknowledges connection
3. **Server sends** real-time notifications via WebSocket
4. **Client sends** heartbeat every 30 seconds (keep-alive)
5. **Server closes** connection on inactivity (5+ minutes without heartbeat)
6. **Client reconnects** automatically upon disconnect

---

# Stage 2

## Database Selection & Schema

### Recommended Database: PostgreSQL

**Rationale:**
- Handles high-volume transactional data with ACID compliance
- Efficient indexing for user-based queries (critical for notifications)
- Strong support for JSON fields (metadata storage)
- Excellent scalability with partitioning capabilities

---

## Database Schema

### Notifications Table

```sql
CREATE TABLE notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  message VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'unread',
  category VARCHAR(50),
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_user_status ON notifications(user_id, status);
CREATE INDEX idx_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_expires_at ON notifications(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_user_unread ON notifications(user_id) WHERE status = 'unread';
```

### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Scalability Challenges & Solutions

### Problem 1: Large Data Volume (Millions of Notifications)

**Challenge:** Queries on single user slow down as notification count grows.

**Solution:**
- **Table Partitioning:** Partition by `user_id` or time-based (monthly)
```sql
CREATE TABLE notifications_y2026m06 PARTITION OF notifications
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
```

- **Archival:** Move old notifications (>90 days) to archive table
```sql
CREATE TABLE notifications_archive LIKE notifications;
```

### Problem 2: Index Bloat & Query Performance

**Challenge:** Frequent read/write operations cause index fragmentation.

**Solution:**
- Regular VACUUM and ANALYZE
- Use covering indexes for common queries
```sql
CREATE INDEX idx_user_query ON notifications(user_id, status, created_at DESC) 
  INCLUDE (id, title, priority);
```

### Problem 3: Storage Growth

**Challenge:** Metadata and message text increase storage requirements.

**Solution:**
- Compress old data with PostgreSQL compression
- Store large payloads in object storage (S3), keep reference in metadata
- Implement TTL-based cleanup for expired notifications

---

## SQL Queries (Based on Stage 1 APIs)

### 1. Get All Notifications for User (with filtering)

```sql
SELECT id, user_id, title, message, type, priority, status, category, action_url, created_at
FROM notifications
WHERE user_id = $1
  AND ($2::varchar IS NULL OR status = $2)
ORDER BY created_at DESC
LIMIT $3 OFFSET $4;
```

### 2. Get Specific Notification

```sql
SELECT id, user_id, title, message, type, priority, status, category, action_url, created_at
FROM notifications
WHERE id = $1 AND user_id = $2;
```

### 3. Mark Single Notification as Read

```sql
UPDATE notifications
SET status = 'read', updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND user_id = $2
RETURNING id, status;
```

### 4. Mark Multiple Notifications as Read

```sql
UPDATE notifications
SET status = 'read', updated_at = CURRENT_TIMESTAMP
WHERE user_id = $1 AND id = ANY($2::varchar[])
RETURNING COUNT(*) as updated_count;
```

### 5. Delete Notification

```sql
DELETE FROM notifications
WHERE id = $1 AND user_id = $2;
```

### 6. Delete Multiple Notifications

```sql
DELETE FROM notifications
WHERE user_id = $1 AND id = ANY($2::varchar[])
RETURNING COUNT(*) as deleted_count;
```

### 7. Get Unread Notification Count

```sql
SELECT 
  COUNT(*) FILTER (WHERE status = 'unread') as unread_count,
  COUNT(*) as total_count
FROM notifications
WHERE user_id = $1;
```

### 8. Mark All Notifications as Read

```sql
UPDATE notifications
SET status = 'read', updated_at = CURRENT_TIMESTAMP
WHERE user_id = $1 AND status = 'unread'
RETURNING COUNT(*) as marked_count;
```

### 9. Clean Up Expired Notifications

```sql
DELETE FROM notifications
WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP;
```

### 10. Archive Old Notifications (>90 days)

```sql
INSERT INTO notifications_archive
SELECT * FROM notifications
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days'
  AND status = 'read';

DELETE FROM notifications
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days'
  AND status = 'read';
```


