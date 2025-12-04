# Environment Variables Types & Requirements

## Server Environment Variables

### Required Variables

| Variable | Type | Format | Required | Default | Description |
|----------|------|--------|----------|---------|-------------|
| `MONGO_URI` | String | MongoDB connection string | ✅ Yes | - | MongoDB connection URI. Format: `mongodb://host:port/database` |
| `JWTKEY` | String | Secret key | ✅ Yes | - | JWT secret key for token signing/verification |

### Optional Variables

| Variable | Type | Format | Default | Description |
|----------|------|--------|---------|-------------|
| `PORT` | Number | Integer | `5000` | Server port number |
| `NODE_ENV` | String | Enum | `development` | Environment: `development` or `production` |
| `CLIENT_ORIGINS` | String | Comma-separated URLs | `http://localhost:5173` | Allowed CORS origins (comma-separated) |
| `REQUEST_LIMIT` | String | Size format | `30mb` | Request body size limit (e.g., `30mb`, `10mb`) |
| `RATE_LIMIT_WINDOW_MS` | Number | Milliseconds | `900000` | Rate limit time window (15 minutes = 900000ms) |
| `RATE_LIMIT_MAX` | Number | Integer | `1000` | Maximum requests per window |
| `JWT_EXPIRES_IN` | String | Time format | `1h` | JWT expiration (e.g., `1h`, `24h`, `7d`) |
| `CLOUDINARY_CLOUD_NAME` | String | Cloud name | - | Cloudinary cloud name (optional) |
| `CLOUDINARY_API_KEY` | String | API key | - | Cloudinary API key (optional) |
| `CLOUDINARY_API_SECRET` | String | API secret | - | Cloudinary API secret (optional) |
| `CLOUDINARY_UPLOAD_FOLDER` | String | Folder path | `folkslet` | Cloudinary upload folder |
| `UPLOAD_MAX_FILE_SIZE` | Number | Bytes | `10485760` | Max file size in bytes (10MB = 10485760) |
| `SOCKET_MAX_PAYLOAD` | Number | Bytes | `1048576` | Max WebSocket payload size (1MB = 1048576) |
| `DISABLE_DIGEST_JOB` | Boolean | `true`/`false` | `false` | Disable daily digest job |
| `DIGEST_CRON` | String | Cron expression | `30 5 * * *` | Cron schedule for digest job |
| `DISABLE_TREND_JOB` | Boolean | `true`/`false` | `false` | Disable trend seed job |
| `TREND_CRON` | String | Cron expression | `*/45 * * * * *` | Cron schedule for trend job |
| `TREND_LOOKBACK_HOURS` | Number | Integer | `24` | Hours to look back for trends |
| `TREND_SAMPLE_LIMIT` | Number | Integer | `200` | Maximum posts to sample for trends |
| `LOG_LEVEL` | String | Enum | `INFO` | Log level: `ERROR`, `WARN`, `INFO`, `DEBUG` |
| `TZ` | String | Timezone | `UTC` | Timezone (e.g., `UTC`, `America/New_York`) |

### Type Details

#### Number Types
- **PORT**: Integer (e.g., `5000`, `3000`)
- **RATE_LIMIT_WINDOW_MS**: Integer in milliseconds (e.g., `900000` = 15 minutes)
- **RATE_LIMIT_MAX**: Integer (e.g., `1000`)
- **UPLOAD_MAX_FILE_SIZE**: Integer in bytes (e.g., `10485760` = 10MB)
- **SOCKET_MAX_PAYLOAD**: Integer in bytes (e.g., `1048576` = 1MB)
- **TREND_LOOKBACK_HOURS**: Integer (e.g., `24`)
- **TREND_SAMPLE_LIMIT**: Integer (e.g., `200`)

#### String Types
- **MONGO_URI**: MongoDB connection string
  - Format: `mongodb://[username:password@]host[:port][/database][?options]`
  - Docker example: `mongodb://mongodb:27017/folkslet`
  - Local example: `mongodb://127.0.0.1:27017/folkslet`
- **JWTKEY**: Secret string (should be strong and random)
- **CLIENT_ORIGINS**: Comma-separated URLs
  - Format: `http://localhost:5173,http://localhost:80`
  - No spaces, comma-separated
- **REQUEST_LIMIT**: Size string with unit
  - Format: `{number}{unit}` (e.g., `30mb`, `10mb`, `1gb`)
- **JWT_EXPIRES_IN**: Time string
  - Format: `{number}{unit}` (e.g., `1h`, `24h`, `7d`, `30m`)
- **CLOUDINARY_***: String values (optional, all three required if using Cloudinary)
- **DIGEST_CRON**: Cron expression
  - Format: `minute hour day month weekday`
  - Example: `30 5 * * *` (5:30 AM daily)
- **TREND_CRON**: Cron expression with seconds
  - Format: `second minute hour day month weekday`
  - Example: `*/45 * * * * *` (every 45 seconds)
- **LOG_LEVEL**: Enum string
  - Values: `ERROR`, `WARN`, `INFO`, `DEBUG` (case-insensitive)
- **TZ**: Timezone string
  - Format: IANA timezone (e.g., `UTC`, `America/New_York`, `Europe/London`)

#### Boolean Types
- **DISABLE_DIGEST_JOB**: String `"true"` or `"false"` (checked with `=== 'true'`)
- **DISABLE_TREND_JOB**: String `"true"` or `"false"` (checked with `=== 'true'`)

#### Enum Types
- **NODE_ENV**: `"development"` or `"production"`
- **LOG_LEVEL**: `"ERROR"`, `"WARN"`, `"INFO"`, `"DEBUG"`

---

## Socket Environment Variables

### Optional Variables

| Variable | Type | Format | Default | Description |
|----------|------|--------|---------|-------------|
| `SOCKET_PORT` | Number | Integer | `8800` | Socket.io server port |
| `SOCKET_ALLOWED_ORIGINS` | String | Comma-separated URLs | `http://localhost:5173` | Allowed CORS origins (comma-separated) |
| `SOCKET_PING_TIMEOUT` | Number | Milliseconds | `25000` | Socket ping timeout (25 seconds) |
| `SOCKET_PING_INTERVAL` | Number | Milliseconds | `20000` | Socket ping interval (20 seconds) |

### Type Details

#### Number Types
- **SOCKET_PORT**: Integer (e.g., `8800`, `3001`)
- **SOCKET_PING_TIMEOUT**: Integer in milliseconds (e.g., `25000` = 25 seconds)
- **SOCKET_PING_INTERVAL**: Integer in milliseconds (e.g., `20000` = 20 seconds)

#### String Types
- **SOCKET_ALLOWED_ORIGINS**: Comma-separated URLs
  - Format: `http://localhost:5173,http://localhost:80`
  - No spaces, comma-separated

---

## Examples

### Minimal Required Configuration
```env
MONGO_URI=mongodb://mongodb:27017/folkslet
JWTKEY=your-strong-secret-key-here
```

### Full Production Configuration
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://mongodb:27017/folkslet
JWTKEY=your-very-strong-secret-key-minimum-32-characters
JWT_EXPIRES_IN=24h
CLIENT_ORIGINS=http://localhost:80,https://yourdomain.com
REQUEST_LIMIT=30mb
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=1000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=folkslet
UPLOAD_MAX_FILE_SIZE=10485760
SOCKET_MAX_PAYLOAD=1048576
DISABLE_DIGEST_JOB=false
DIGEST_CRON=30 5 * * *
DISABLE_TREND_JOB=false
TREND_CRON=*/45 * * * * *
TREND_LOOKBACK_HOURS=24
TREND_SAMPLE_LIMIT=200
LOG_LEVEL=INFO
TZ=UTC
SOCKET_PORT=8800
SOCKET_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:80
SOCKET_PING_TIMEOUT=25000
SOCKET_PING_INTERVAL=20000
```

---

## Validation Notes

1. **MONGO_URI**: Must be a valid MongoDB connection string. Required for server startup.
2. **JWTKEY**: Must be set. Should be a strong, random secret (minimum 32 characters recommended).
3. **CLOUDINARY_***: All three (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) must be set together, or all left empty. Partial configuration will disable Cloudinary.
4. **Boolean values**: Use string `"true"` or `"false"`, not actual boolean values.
5. **Comma-separated lists**: No spaces around commas (e.g., `url1,url2` not `url1, url2`).
6. **Cron expressions**: Must be valid cron syntax. Use online validators if unsure.

