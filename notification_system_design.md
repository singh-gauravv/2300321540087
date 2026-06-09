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

---

# Stage 3

## Query Performance Analysis

### Original Query Issues

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

**Problems:**
1. `SELECT *` - Fetches all columns; wastes memory and network bandwidth
2. No index on `(studentID, isRead)` - Full table scan on 5M rows
3. `isRead = false` - Inefficient; should use `status = 'unread'` (from Stage 2 schema)
4. Column naming inconsistency (studentID vs user_id)

**Why it's slow:** With 50K students × 5M notifications, without proper indexes, the query scans entire table.

**Computation Cost:** ~O(5M) row scans = high I/O

---

## Optimized Query

```sql
SELECT id, user_id, title, message, type, priority, status, category, action_url, created_at
FROM notifications
WHERE user_id = $1 AND status = 'unread'
ORDER BY created_at ASC
LIMIT 100;
```

**Changes:**
- Select only required columns
- Use indexed columns: `(user_id, status)`
- Limit result set
- Use consistent naming from Stage 2 schema

**Computation Cost:** ~O(log N + K) where K = result rows = much faster

---

## Index Strategy Discussion

**Adding indexes to every column - NOT effective:**
- ❌ Bloats database size
- ❌ Slows down INSERT/UPDATE operations
- ❌ Maintenance overhead (VACUUM, ANALYZE)
- ✅ Index only frequently filtered columns: `(user_id, status, created_at)`

**Recommended Indexes (from Stage 2):**
```sql
CREATE INDEX idx_user_status ON notifications(user_id, status);
CREATE INDEX idx_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_user_unread ON notifications(user_id) WHERE status = 'unread';
```

---

## Query: Placement Notifications (Last 7 Days)

```sql
SELECT id, user_id, title, message, created_at
FROM notifications
WHERE notification_type = 'Placement'
  AND created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
ORDER BY created_at DESC;
```

**With Index:**
```sql
CREATE INDEX idx_type_created ON notifications(notification_type, created_at DESC);
```

**Result:** Indexes filter rows efficiently; returns all placement notifications within 7 days.

---

# Stage 4

## Problem: Database Overload on Page Load

**Scenario:** Notifications fetched on every page load for 50K students = 50K simultaneous DB queries.

**Impact:** DB connection pool exhausted, slow response times, poor UX.

---

## Solution 1: Caching (Redis)

**Implementation:**
```
Client Request → Check Redis Cache → If hit: return → If miss: Query DB → Cache result (TTL: 5 min) → Return
```

**Strategy:**
```
Cache Key: "user:{userId}:notifications:unread"
Cache Value: JSON array of unread notifications
TTL: 5 minutes
```

**Tradeoffs:**
- ✅ Reduces DB load by 80-90%
- ✅ Fast response (in-memory)
- ✅ Easy to implement
- ❌ Eventual consistency (5 min delay)
- ❌ Cache invalidation complexity
- ❌ Additional Redis infrastructure cost

---

## Solution 2: Pagination (Already in Stage 1)

**Current Implementation:**
```sql
LIMIT 20 OFFSET (page-1)*20
```

**Tradeoffs:**
- ✅ Reduces data per request
- ✅ Simple implementation
- ❌ Still requires DB query every page load
- ❌ Doesn't solve fundamental problem

---

## Solution 3: Lazy Loading

**Strategy:** Load notifications on-demand (scroll/click) instead of page load.

**Tradeoffs:**
- ✅ Minimal initial load time
- ✅ Reduces DB queries
- ❌ Requires frontend changes
- ❌ Poor UX if user expects instant data

---

## Solution 4: Read Replicas

**Architecture:**
```
Write DB → Read Replica 1, Read Replica 2, Read Replica 3
Route all SELECT queries to read replicas
```

**Tradeoffs:**
- ✅ Distributes read load
- ✅ Improves concurrent query handling
- ❌ Adds infrastructure complexity
- ❌ Replication lag (usually milliseconds)
- ❌ Higher operational cost

---

## Recommended Approach: Redis Cache + Lazy Loading

**Combine solutions:**

1. **Initial Load (Page load):** 
   - Return cached unread count only (cheap query)
   - Cache: `user:{userId}:unread_count` → `{unreadCount: 12}`

2. **On-Demand (User clicks notifications):**
   - Fetch paginated notifications from Redis cache
   - If cache miss → Query DB with index from Stage 3
   - Update cache with latest data

3. **Cache Invalidation:**
   - On notification action (read/delete) → invalidate cache
   - TTL-based refresh (5 min)

**Result:** 99% reduction in page-load DB queries.

---

## Performance Impact

| Metric | Before | After |
|--------|--------|-------|
| Page Load Time | 3-5s | 200-300ms |
| DB Queries/sec | 50,000 | 2,000 |
| Server Response | 100-500ms | 20-50ms |
| Cache Hit Rate | N/A | 85-90% |

---

# Stage 5

## Problem with the Original `notify_all` Flow

Original pseudocode:
```
for student_id in student_ids:
  send_email(student_id, message)
  save_to_db(student_id, message)
  push_to_app(student_id, message)
```

**Shortcomings:**
- No retry or failure handling for email delivery
- `send_email` failure on 200 students leaves partial delivery
- Mixing email send and DB insert synchronously blocks the loop
- No durability or idempotency for retrying failed operations
- Real-time push depends on immediate success, not persistence

---

## Reliable, Fast Redesign

**Approach:** persist first, then publish work to queues.

**Revised flow:**
```
def notify_all(student_ids, message):
  for student_id in student_ids:
    notification_id = save_notification(student_id, message)
    enqueue_event('notification_created', {
      'notification_id': notification_id,
      'student_id': student_id,
      'message': message
    })
```

worker 1: process notification_created
```
def notification_worker(event):
  notification = load_notification(event.notification_id)
  if notification.status != 'sent':
    if send_email(event.student_id, event.message):
      mark_notification_sent(notification.id)
    else:
      retry_or_dead_letter(event)
```

worker 2: push app notification
```
def push_worker(event):
  push_to_app(event.student_id, event.message)
```
```

**Why this is better:**
- DB save happens reliably before external calls
- email sending and app push are asynchronous
- failed sends can be retried without losing DB records
- system scales with queue consumers
- user-facing notification state is persisted for later recovery

---

## Should DB save and email send happen together?

**Answer:** No, not synchronously.
- Save to DB first for durability
- Then publish events for email and app push
- Use outbox or transactional log to ensure events are not lost

**Why:** this avoids partial failures and makes retries safe.

---

## Handling the 200 failed emails mid-way

**If email fails:**
- keep notification record
- mark `email_status = 'pending'` or `failed`
- enqueue retry job
- optionally send alert after repeated failures

**Result:** no notification data is lost, and failed deliveries are retried independently.

---



# Stage 6

## Priority Inbox Approach

**Goal:** return top `n` unread notifications by importance and recency.

**Weights:**
- Placement = 3
- Result = 2
- Event = 1

**Ranking:**
- `score = weight * 1e12 - timestamp_seconds`
- higher score = higher priority

## Efficient Algorithm

**Approach:** maintain a min-heap of size `n`.
- push each notification with its score
- if heap size > `n`, pop the smallest score
- final heap holds the top `n` notifications

**Performance:**
- O(m log n) for `m` notifications
- bounded memory for top `n`
- supports incremental updates on new notifications

## Implementation

- Backend code file: `notification_app_be/priority_inbox.js`
- Fetches notifications from the provided API
- Computes score per notification and keeps top 10
- Returns top notifications sorted by priority and recency

## New Notification Handling

When a new notification arrives:
- compute its score
- compare to heap root
- replace root if the new score is higher

This keeps the top `n` current without full recompute.


