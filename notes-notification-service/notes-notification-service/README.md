# Notes Notification Service

Spring Boot service for handling note sharing notifications with real-time updates.

## Features
- Share request notifications
- Accept/Reject functionality  
- Real-time WebSocket notifications
- Sender notification on response

## Quick Start

```bash
# Run the service
cd notes-notification-service
mvn spring-boot:run
```

Service runs on http://localhost:8080

## API Endpoints

### Create Share Request
```
POST /api/notifications/share-request
{
  "recipientEmail": "user@example.com",
  "senderEmail": "sender@example.com", 
  "noteId": "note123",
  "noteTitle": "My Note"
}
```

### Accept Share Request
```
POST /api/notifications/{id}/accept
{
  "userEmail": "user@example.com"
}
```

### Reject Share Request
```
POST /api/notifications/{id}/reject
{
  "userEmail": "user@example.com"
}
```

### Get User Notifications
```
GET /api/notifications/user/{email}
```

## WebSocket Connection
Connect to: `ws://localhost:8080/ws-notifications`
Subscribe to: `/user/queue/notifications`

## Integration
Add the NotificationBar component to your Next.js Header component and use the shareNote function when sharing notes.