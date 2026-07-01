# Notification System Design

## Stage 1

### Core Actions
1. **Fetch Notifications**: Retrieve a paginated list of notifications for a logged-in student, with the ability to filter by read/unread status.
2. **Mark as Read**: Mark a specific notification as read.
3. **Mark All as Read**: Mark all unread notifications for a specific student as read simultaneously.

### REST API Endpoints & Contracts

**1. Fetch Notifications**
* **Endpoint:** `GET /api/v1/students/{studentId}/notifications`
* **Headers:**
  ```http
  Authorization: Bearer <JWT_TOKEN>
  Accept: application/json
  ```
* **Query Parameters:**
  * `status`: Optional (`all` | `unread`). Default is `all`.
  * `page`: Integer. Default is 1.
  * `limit`: Integer. Default is 20.
* **JSON Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "type": "Placement",
        "title": "Google Placement Drive",
        "message": "Google is visiting the campus on 15th Aug.",
        "isRead": false,
        "createdAt": "2023-10-01T10:00:00Z"
      }
    ],
    "meta": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "unreadCount": 5
    }
  }
  ```

**2. Mark Notification as Read**
* **Endpoint:** `PATCH /api/v1/students/{studentId}/notifications/{notificationId}/read`
* **Headers:**
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```
* **JSON Request:** `{}` *(Empty body as the action is implicit in the URL)*
* **JSON Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Notification marked as read."
  }
  ```

**3. Mark All Notifications as Read**
* **Endpoint:** `PUT /api/v1/students/{studentId}/notifications/read-all`
* **Headers:**
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```
* **JSON Request:** `{}`
* **JSON Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "All notifications marked as read."
  }
  ```

### Real-time Notification Mechanism
For real-time delivery, I propose using **Server-Sent Events (SSE)**.
* **Reasoning:** Notifications are primarily unidirectional (Server pushing updates to the Client). SSE operates over standard HTTP/HTTPS, avoids the overhead of managing complex duplex WebSocket connections, handles reconnects automatically, and is well-suited for simple text-based data streams.

---

## Stage 2

### Persistent Storage (DB) Choice
I suggest using a **Relational Database** like **PostgreSQL**.
* **Reasoning:** While NoSQL (like MongoDB) is often used for massive notification feeds, PostgreSQL provides strong ACID guarantees and handles structured relational data exceptionally well. Given the strict enum types (`Event`, `Result`, `Placement`) and the relational tie-ins to a `Student` entity, PostgreSQL ensures data integrity. With proper indexing and partitioning, it can easily handle the expected load. 

### Database Schema (PostgreSQL)

```sql
CREATE TYPE notif_type AS ENUM ('Event', 'Result', 'Placement');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id INT NOT NULL,
    notification_type notif_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index to optimize querying a student's unread notifications
CREATE INDEX idx_notifications_student_isread ON notifications(student_id, is_read, created_at DESC);
```

### Addressing Data Volume Increases
**Problems:** 
As data grows, query performance will degrade due to bloated indexes and table scans. Write performance may also suffer.
**Solutions:**
1. **Table Partitioning:** Partition the `notifications` table by date (e.g., monthly partitions based on `created_at`). This keeps active index trees small and makes querying recent notifications fast.
2. **Archival / Cold Storage:** Run a cron job to move notifications older than 6 months to a cheaper cold storage (like Amazon S3 or a secondary archive database) since they are rarely accessed.

### Queries Based on APIs
* **Fetch Unread Notifications (Paginated):**
  ```sql
  SELECT id, notification_type, title, message, is_read, created_at
  FROM notifications
  WHERE student_id = ? AND is_read = false
  ORDER BY created_at DESC
  LIMIT 20 OFFSET 0;
  ```

* **Mark as Read:**
  ```sql
  UPDATE notifications SET is_read = true WHERE id = ? AND student_id = ?;
  ```

* **Mark All as Read:**
  ```sql
  UPDATE notifications SET is_read = true WHERE student_id = ? AND is_read = false;
  ```

---

## Stage 3

### Query Analysis
**Original Query:**
```sql
SELECT * FROM notifications 
WHERE studentID = 1042 AND isRead = false 
ORDER BY createdAt ASC;
```

**Is this query accurate?** 
Functionally yes, it fetches unread notifications. However, logically, it has two major issues:
1. It uses `ORDER BY createdAt ASC` (oldest first). Users generally want to see the newest notifications first (`DESC`).
2. There is no `LIMIT`. If a student has 10,000 unread notifications, fetching all of them at once will crash the client and stress the database.

**Why is this slow?**
Without a proper compound index, the database optimizer has to either perform a full table scan of 5,000,000 rows, or scan an index on just `studentID`, filter out read notifications in memory, and then perform an expensive in-memory sort (filesort) for the `ORDER BY` clause. 

**What would you change?**
1. Add a **compound index**: `CREATE INDEX idx_student_read_time ON notifications(studentID, isRead, createdAt DESC);`
2. Change the query to order by descending time and add pagination limit.
   ```sql
   SELECT * FROM notifications 
   WHERE studentID = 1042 AND isRead = false 
   ORDER BY createdAt DESC 
   LIMIT 50;
   ```
* **Computation Cost:** With the compound index, the database can traverse the B-tree directly to the exact subset of records and read the top 50 in pre-sorted order. The cost drops from $O(N \log N)$ (or $O(N)$ for table scans) to $O(\log N)$ or practically $O(1)$ constant time lookup.

**Is adding indexes on every column effective?**
**No.** While indexes speed up read queries (`SELECT`), they drastically slow down write queries (`INSERT`, `UPDATE`, `DELETE`). Every time a new notification is inserted, the database has to update *every single index*. Furthermore, it consumes massive amounts of disk space and memory, and confuses the query optimizer, leading to suboptimal query plans. Indexes should only be created on columns frequently used in `WHERE`, `JOIN`, or `ORDER BY` clauses.

### Query for Placement Notifications in the Last 7 Days
```sql
SELECT DISTINCT studentID 
FROM notifications 
WHERE notificationType = 'Placement' 
  AND createdAt >= NOW() - INTERVAL '7 days';
```
*(Note: A compound index on `(notificationType, createdAt)` would optimize this).*

---

## Stage 4

### Improving Read Performance and UX
Fetching notifications continuously on every page load overwhelms the database and causes high latency for the end user. Here are solutions:

**1. Push Architecture (Server-Sent Events / WebSockets)**
* **Solution:** Establish a persistent SSE or WebSocket connection when the user logs in. When a new notification is created, the server pushes it directly to the active client. The client maintains an in-memory array of notifications.
* **Tradeoffs:** Requires maintaining stateful, long-lived connections on the server, which complicates infrastructure and load balancing (needs Sticky Sessions or Redis Pub/Sub adapter).

**2. Caching Layer (Redis)**
* **Solution:** Store the unread count and a snapshot of the most recent 50 notifications in a fast, in-memory cache like Redis. When a page loads, the API hits Redis first ($O(1)$ lookup time) instead of querying the main PostgreSQL database.
* **Tradeoffs:** Introduces Cache Invalidation complexity. If a user reads a notification, both the DB and Redis must be updated synchronously to prevent showing stale data.

**3. Client-Side State Management & Deltas**
* **Solution:** Instead of fetching the entire list on every page navigation, cache the notifications in the browser (using React Context, Redux, or Local Storage). Only poll the API periodically to ask, "Give me notifications created *after* my last fetched timestamp."
* **Tradeoffs:** Polls still generate network traffic (even if empty). Client cache can easily fall out of sync if the user clears local storage or switches devices.

**Recommended Strategy:** 
A hybrid approach: Use **Redis** to cache the unread count (which is the most frequently requested data element for the notification bell icon), and use **Server-Sent Events (SSE)** to push actual notification objects to the client in real-time, eliminating the need to query on page transitions altogether.

---

## Stage 5

### Shortcomings of the Proposed Implementation
```python
function notify_all(student_ids: array, message: string):
    for student_id in student_ids:
        send_email(student_id, message)
        save_to_db(student_id, message)
        push_to_app(student_id, message)
```
1. **Synchronous and Blocking:** The loop processes 50,000 students sequentially. Because `send_email` relies on external APIs (which have latency), this request will likely take hours and time-out on the HTTP level.
2. **Lack of Fault Tolerance:** If `send_email` throws an exception for student 201, the loop breaks. The remaining 49,800 students will never receive their notification, and there's no tracking of who got what.
3. **Lack of Atomicity:** If `save_to_db` succeeds but `push_to_app` fails, the system is left in an inconsistent state for that student.
4. **Inefficient Database Usage:** Executing 50,000 individual `INSERT` queries sequentially will thrash the database.

### Should DB save and email send happen together?
**No.** Database operations are internal, highly reliable, and very fast. Sending emails depends on external 3rd-party services (like SendGrid/AWS SES) which are slow, subject to rate limits, network timeouts, and unpredictable failures. They must be decoupled to ensure that the primary action (creating the notification record) is not blocked by external delays.

### Redesigning for Reliability and Speed
To fix this, we must adopt an **Event-Driven, Asynchronous Architecture** using a Message Broker (like RabbitMQ, Kafka, or AWS SQS / BullMQ). 

1. **Bulk Insert:** Save all notifications to the database in one or a few bulk queries.
2. **Queueing:** Publish the notification payloads to background worker queues.
3. **Workers:** Dedicated background workers consume the queue and handle the slow tasks (emails/app push) at their own pace, automatically retrying upon failure without blocking the main application.

### Revised Pseudocode

```python
# HTTP Endpoint Handler (Runs instantly)
function notify_all_async(student_ids: array, message: string):
    # 1. Fast Bulk Insert to DB
    bulk_save_to_db(student_ids, message)
    
    # 2. Push to message broker for background processing
    queue.publish("email_jobs", student_ids, message)
    queue.publish("app_push_jobs", student_ids, message)
    
    return HTTP 202 "Notifications are being processed"


# Background Worker Process 1 (Consumes from 'email_jobs' queue)
function email_worker(job):
    for student_id in job.student_ids:
        try:
            send_email(student_id, job.message)
        except EmailDeliveryError:
            # Re-queue just the failed student with exponential backoff
            queue.retry(student_id, job.message, backoff=true)


# Background Worker Process 2 (Consumes from 'app_push_jobs' queue)
function app_push_worker(job):
    for student_id in job.student_ids:
        try:
             push_to_app(student_id, job.message)
        except PushDeliveryError:
             queue.retry(student_id, job.message, backoff=true)
```
