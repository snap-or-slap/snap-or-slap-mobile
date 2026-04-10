# SnapOrSlap — API Documentation for Frontend

> **Base URL:** `https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1`  
> **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0`

**Headers bắt buộc cho mọi request:**
```
apikey: <ANON_KEY>
Content-Type: application/json
```

**Thêm header này cho POST (để nhận lại object vừa tạo):**
```
Prefer: return=representation
```

---

## Mục lục
1. [Users](#1-users)
2. [Friendships](#2-friendships)
3. [Friend Invites](#3-friend-invites)
4. [Challenges](#4-challenges)
5. [Challenge Participants](#5-challenge-participants)
6. [Challenge Invites](#6-challenge-invites)
7. [Submissions](#7-submissions)
8. [Notifications](#8-notifications)
9. [Challenge Results](#9-challenge-results)

---

## 1. Users

### Lấy danh sách users
```bash
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/users?select=*&order=created_at.desc' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0"
```

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "thien123",
    "display_name": "Thiên",
    "avatar_url": "https://i.pravatar.cc/150",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

---

### Tạo user mới (đăng ký / user test)
```bash
curl -X POST 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/users' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "username": "thien123",
    "display_name": "Thiên",
    "avatar_url": "https://i.pravatar.cc/150?img=5"
  }'
```

**Body fields:**

| Field | Type | Required | Note |
|-------|------|----------|------|
| `username` | string | ✓ | Unique |
| `display_name` | string | ✓ | |
| `avatar_url` | string | | URL ảnh đại diện |

**Response:** Object user vừa tạo (array 1 phần tử).

---

## 2. Friendships

### Lấy danh sách bạn bè
```bash
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/friendships?select=*&order=created_at.desc' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0"
```

**Lọc friendships của 1 user (là requester hoặc addressee):**
```bash
# Lọc theo requester
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/friendships?requester_id=eq.USER_UUID&select=*' \
  -H "apikey: ..."

# Lọc theo addressee
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/friendships?addressee_id=eq.USER_UUID&select=*' \
  -H "apikey: ..."
```

**Response:**
```json
[
  {
    "id": "uuid",
    "requester_id": "uuid",
    "addressee_id": "uuid",
    "status": "pending",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

**Status values:** `pending` | `accepted` | `rejected`

---

### Tạo friendship (gửi lời mời kết bạn)
```bash
curl -X POST 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/friendships' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "requester_id": "USER_UUID_A",
    "addressee_id": "USER_UUID_B",
    "status": "pending"
  }'
```

---

## 3. Friend Invites

### Lấy danh sách lời mời kết bạn
```bash
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/friend_invites?select=*&order=created_at.desc' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0"
```

**Lọc invite gửi đến user:**
```bash
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/friend_invites?receiver_id=eq.USER_UUID&status=eq.pending&select=*' \
  -H "apikey: ..."
```

**Response:**
```json
[
  {
    "id": "uuid",
    "sender_id": "uuid",
    "receiver_id": "uuid",
    "status": "pending",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

---

### Gửi lời mời kết bạn
```bash
curl -X POST 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/friend_invites' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "sender_id": "USER_UUID_A",
    "receiver_id": "USER_UUID_B",
    "status": "pending"
  }'
```

---

## 4. Challenges

### Lấy danh sách challenges
```bash
# Tất cả
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenges?select=*&order=created_at.desc' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0"

# Chỉ active
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenges?status=eq.active&select=*&order=created_at.desc' \
  -H "apikey: ..."

# Chỉ ended
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenges?status=eq.ended&select=*&order=created_at.desc' \
  -H "apikey: ..."
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "30 ngày plank",
    "creator_id": "uuid",
    "status": "active",
    "end_at": "2025-02-01T00:00:00Z",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

**Status values:** `active` | `ended`

---

### Tạo challenge mới
```bash
curl -X POST 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenges' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "title": "30 ngày plank",
    "creator_id": "USER_UUID",
    "status": "active",
    "end_at": "2025-02-01T00:00:00Z"
  }'
```

**Body fields:**

| Field | Type | Required | Note |
|-------|------|----------|------|
| `title` | string | ✓ | Tên challenge |
| `creator_id` | uuid | ✓ | UUID của user tạo |
| `status` | string | | Default `active` |
| `end_at` | timestamp | | ISO 8601, có thể `null` |

---

## 5. Challenge Participants

### Lấy danh sách participants
```bash
# Tất cả participants
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenge_participants?select=*&order=joined_at.desc' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0"

# Participants của 1 challenge cụ thể
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenge_participants?challenge_id=eq.CHALLENGE_UUID&select=*' \
  -H "apikey: ..."
```

**Response:**
```json
[
  {
    "challenge_id": "uuid",
    "user_id": "uuid",
    "role": "member",
    "status": "active",
    "joined_at": "2025-01-01T00:00:00Z"
  }
]
```

**Role values:** `creator` | `member`  
**Status values:** `active`

---

### Thêm participant vào challenge
```bash
curl -X POST 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenge_participants' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "challenge_id": "CHALLENGE_UUID",
    "user_id": "USER_UUID",
    "role": "member"
  }'
```

---

## 6. Challenge Invites

### Lấy danh sách lời mời challenge
```bash
# Tất cả
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenge_invites?select=*&order=created_at.desc' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0"

# Lọc invite gửi đến user cụ thể (pending)
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenge_invites?receiver_id=eq.USER_UUID&status=eq.pending&select=*' \
  -H "apikey: ..."
```

**Response:**
```json
[
  {
    "id": "uuid",
    "challenge_id": "uuid",
    "sender_id": "uuid",
    "receiver_id": "uuid",
    "status": "pending",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

**Status values:** `pending` | `accepted` | `rejected`

---

### Mời người vào challenge
```bash
curl -X POST 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenge_invites' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "challenge_id": "CHALLENGE_UUID",
    "sender_id": "USER_UUID_A",
    "receiver_id": "USER_UUID_B",
    "status": "pending"
  }'
```

---

## 7. Submissions

### Lấy danh sách submissions
```bash
# Tất cả
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/submissions?select=*&order=submitted_at.desc' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0"

# Lọc theo status
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/submissions?status=eq.pending&select=*&order=submitted_at.desc' \
  -H "apikey: ..."

# Lọc theo challenge
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/submissions?challenge_id=eq.CHALLENGE_UUID&select=*&order=submitted_at.desc' \
  -H "apikey: ..."
```

**Response:**
```json
[
  {
    "id": "uuid",
    "challenge_id": "uuid",
    "user_id": "uuid",
    "photo_url": "https://picsum.photos/400",
    "status": "pending",
    "submitted_at": "2025-01-01T00:00:00Z"
  }
]
```

**Status values:** `pending` | `accepted` | `rejected`

---

### Submit ảnh mới
```bash
curl -X POST 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/submissions' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "challenge_id": "CHALLENGE_UUID",
    "user_id": "USER_UUID",
    "photo_url": "https://picsum.photos/seed/demo/400/400",
    "status": "pending"
  }'
```

---

### Accept / Reject submission
```bash
# Accept
curl -X PATCH 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/submissions?id=eq.SUBMISSION_UUID' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0" \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'

# Reject
curl -X PATCH 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/submissions?id=eq.SUBMISSION_UUID' \
  -H "apikey: ..." \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected"}'
```

---

## 8. Notifications

### Lấy notifications
```bash
# Tất cả của 1 user, mới nhất trước
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/notifications?user_id=eq.USER_UUID&order=created_at.desc' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0"

# Chỉ chưa đọc
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/notifications?user_id=eq.USER_UUID&is_read=eq.false&order=created_at.desc' \
  -H "apikey: ..."
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "type": "challenge_invite",
    "payload": {
      "challenge_title": "30 ngày plank",
      "from": "Thiên",
      "message": "Bạn được mời tham gia challenge"
    },
    "is_read": false,
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

**Type values:**

| Type | Mô tả |
|------|-------|
| `challenge_invite` | Được mời vào challenge |
| `submission_accepted` | Ảnh được chấp nhận |
| `submission_rejected` | Ảnh bị từ chối |
| `friend_invite` | Lời mời kết bạn |
| `challenge_ended` | Challenge kết thúc |

---

### Đánh dấu tất cả đã đọc (theo user)
```bash
curl -X PATCH 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/notifications?user_id=eq.USER_UUID' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0" \
  -H "Content-Type: application/json" \
  -d '{"is_read": true}'
```

---

## 9. Challenge Results

### Lấy kết quả challenges
```bash
# Tất cả results
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenge_results?select=*&order=finalized_at.desc' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreHpuaWl1d3RvaG5xZndzY2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQxNDEsImV4cCI6MjA5MDk2MDE0MX0.sCt6YfX6XTkkuaa5eoRhOsfQWBE7uueljw5YIquyT_0"

# Result của 1 challenge cụ thể
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenge_results?challenge_id=eq.CHALLENGE_UUID&select=*' \
  -H "apikey: ..."
```

**Response:**
```json
[
  {
    "id": "uuid",
    "challenge_id": "uuid",
    "winner_id": "uuid",
    "summary": {
      "total_days": 30,
      "message": "Vô địch!",
      "ranking": [
        {
          "display_name": "Thiên",
          "submissions": 28,
          "accepted": 25
        }
      ]
    },
    "finalized_at": "2025-02-01T00:00:00Z"
  }
]
```

---

## Query Parameters thường dùng (PostgREST)

| Cú pháp | Ý nghĩa | Ví dụ |
|---------|---------|-------|
| `field=eq.value` | Bằng | `status=eq.active` |
| `field=neq.value` | Khác | `status=neq.ended` |
| `order=field.desc` | Sắp xếp giảm | `order=created_at.desc` |
| `order=field.asc` | Sắp xếp tăng | `order=created_at.asc` |
| `select=*` | Lấy tất cả columns | |
| `select=id,title` | Chỉ lấy 1 số columns | |
| `limit=10` | Giới hạn số records | `?select=*&limit=10` |
| `offset=10` | Bỏ qua N records đầu (pagination) | `?select=*&limit=10&offset=10` |

**Ví dụ pagination:**
```bash
# Trang 1 (10 records)
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenges?select=*&order=created_at.desc&limit=10&offset=0' \
  -H "apikey: ..."

# Trang 2
curl 'https://pkxzniiuwtohnqfwscfp.supabase.co/rest/v1/challenges?select=*&order=created_at.desc&limit=10&offset=10' \
  -H "apikey: ..."
```

---

## Lưu ý cho Frontend

- **Không có auth**: Hiện tại dùng anon key trực tiếp — mọi user đều đọc/ghi được. Phù hợp cho demo/prototype.
- **UUID**: Tất cả ID đều là UUID v4. Lưu lại `id` từ response của POST để dùng cho các request tiếp theo.
- **Timestamp**: Tất cả timestamps ở dạng ISO 8601 UTC (`2025-01-01T00:00:00Z`).
- **Prefer: return=representation**: Thêm header này vào POST nếu muốn nhận lại object vừa tạo. Không có header này thì POST trả về `201 Created` không có body.
- **PATCH filter**: Luôn phải có filter trong URL khi PATCH (vd: `?id=eq.UUID`), không thì sẽ update toàn bộ bảng.
- **Demo tool**: Mở [index.html](index.html) trong trình duyệt để test trực tiếp tất cả endpoints trên UI.
