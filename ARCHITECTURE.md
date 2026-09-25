# Architecture Notes

## Request flow

Browser -> Next.js Server/Client Components -> Route Handlers -> Zod validation -> auth session -> Mongoose -> MongoDB Atlas.

## Authorization

The browser never sends a trusted user ID. The server reads the signed HTTP-only session cookie and uses the session's userId to scope every database query.

## Performance

- Server-rendered dashboard shell
- MongoDB indexes on userId/stage/updatedAt
- Limited API result set
- Client-side filtering for the already-loaded dashboard list
- Next.js automatic code splitting
- Minimal dependencies

## Scalability path

For larger datasets, move search/filtering to MongoDB queries with pagination, add Redis/edge caching for aggregate analytics, and use background jobs for reminders/notifications.

## Security roadmap

- Add rate limiting at the edge
- Add CSRF protection if cookie-based cross-site write risks need stronger controls
- Add audit logs for sensitive actions
- Use managed secret storage and strict MongoDB network access
- Add automated dependency and container scanning
