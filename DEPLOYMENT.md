# Deployment Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_secure_random_string
   CLIENT_ORIGIN=https://your-frontend-domain.com
   ```

3. **Start Server**
   ```bash
   npm start
   ```

4. **Seed Demo Data (Optional)**
   ```bash
   npm run seed
   ```

## Docker Deployment

### Build Image
```bash
docker build -t smart-campus-ticketing .
```

### Run Container
```bash
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name ticketing-api \
  smart-campus-ticketing
```

### With Docker Compose
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - CLIENT_ORIGIN=${CLIENT_ORIGIN}
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

## Cloud Deployment Options

### Render
1. Connect your GitHub repo
2. Select "Web Service"
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in dashboard

### Railway
1. Connect GitHub repo
2. Add environment variables
3. Railway auto-detects Node.js and deploys

### Fly.io
```bash
fly launch
fly secrets set SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... JWT_SECRET=...
fly deploy
```

### AWS ECS / EC2
- Use the provided Dockerfile
- Configure load balancer
- Set environment variables in task definition
- Enable health checks on `/api/health`

### Heroku
```bash
heroku create smart-campus-ticketing
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_SERVICE_ROLE_KEY=...
heroku config:set JWT_SECRET=...
heroku config:set CLIENT_ORIGIN=...
git push heroku main
```

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | Yes | Server port | `5000` |
| `SUPABASE_URL` | Yes | Your Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key (has full DB access) | `eyJhbGc...` |
| `JWT_SECRET` | Yes | Secret for signing JWTs | Random 32+ char string |
| `CLIENT_ORIGIN` | Yes | Allowed CORS origin | `https://app.example.com` |
| `NODE_ENV` | No | Environment mode | `production` |

## Security Checklist

- [ ] Use strong, random JWT_SECRET (32+ characters)
- [ ] Never commit `.env` file to version control
- [ ] Keep SUPABASE_SERVICE_ROLE_KEY secret (full DB access)
- [ ] Set CLIENT_ORIGIN to your actual frontend domain
- [ ] Enable HTTPS in production
- [ ] Review and adjust rate limits if needed
- [ ] Set up monitoring and alerts
- [ ] Configure log aggregation
- [ ] Use environment-specific secrets
- [ ] Enable Supabase Row Level Security (already using service role)

## Health Checks

The API provides a health endpoint at `/api/health`:

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-11-04T12:00:00.000Z"
}
```

Use this for:
- Container health checks
- Load balancer health checks
- Monitoring systems

## Monitoring

### Key Metrics to Monitor
- Request rate and latency
- Error rate (5xx responses)
- Database connection pool
- Memory usage
- CPU usage

### Recommended Tools
- **Logs**: Winston, Pino, or cloud provider logging
- **APM**: New Relic, DataDog, or Sentry
- **Uptime**: UptimeRobot, Pingdom
- **Errors**: Sentry, Rollbar

### Log Format
Currently using Morgan for HTTP logging. In production, consider:
- Structured JSON logs
- Log aggregation (CloudWatch, Elasticsearch, Loggly)
- Error tracking with stack traces (Sentry)

## Performance Tuning

### Rate Limiting
Current limits:
- General: 100 requests per 15 minutes
- Auth: 20 requests per 15 minutes

Adjust in `src/middleware/rateLimiter.js` based on your traffic.

### Database Optimization
- The view `events_with_price` is used for all event queries
- Ensure indexes exist on frequently queried fields
- Monitor slow queries in Supabase dashboard

### Caching (Optional)
Consider adding Redis for:
- Event listings (cache for 1-5 minutes)
- User profile lookups
- Rate limiting (distributed)

## Scaling

### Horizontal Scaling
This API is stateless and can scale horizontally:
- Deploy multiple instances behind a load balancer
- Session state stored in JWT (no server-side sessions)
- Database concurrency handled by Supabase

### Load Balancer Setup
- Use health check: `GET /api/health`
- Enable sticky sessions: **Not needed** (stateless)
- Configure SSL termination at load balancer

### Database Scaling
- Supabase handles connection pooling
- Consider upgrading Supabase plan for higher throughput
- Monitor connection pool usage

## Troubleshooting

### Server Won't Start
1. Check all environment variables are set
2. Verify Supabase URL and key are correct
3. Check port 5000 is not already in use

### Database Errors
1. Verify RPC functions exist: `book_tickets`, `cancel_booking`
2. Check view exists: `events_with_price`
3. Verify service role key has correct permissions

### CORS Errors
1. Add frontend domain to `CLIENT_ORIGIN`
2. Check `localhost:5173` and `localhost:3000` allowed in dev

### Rate Limit Issues
1. Adjust limits in `src/middleware/rateLimiter.js`
2. Consider implementing distributed rate limiting with Redis

## Backup & Disaster Recovery

### Database Backups
- Supabase provides automatic daily backups (check your plan)
- Consider exporting critical data regularly
- Test restore procedures

### Application State
- No server-side state (stateless design)
- Configuration in environment variables
- Code in version control

## Update Strategy

### Rolling Updates
1. Build new Docker image
2. Deploy to staging
3. Run smoke tests
4. Gradually roll out to production
5. Monitor error rates

### Database Migrations
- Coordinate with Supabase schema changes
- Test migrations in development first
- Never modify the existing schema without team agreement

## Support & Maintenance

### Regular Tasks
- Monitor error logs daily
- Review rate limit violations
- Check database performance
- Update dependencies monthly
- Review security advisories

### Emergency Contacts
- Supabase Status: https://status.supabase.com
- Node.js Security: https://nodejs.org/en/security

## Testing in Production

After deployment:

```bash
# Health check
curl https://your-api.com/api/health

# Create user
curl -X POST https://your-api.com/api/auth/mock-google \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'

# List events
curl https://your-api.com/api/events
```

Run the automated tests against your production API (with care):
```bash
# Update API_URL in scripts to point to production
npm run test:concurrency
npm run test:price
```
