package com.notes.notification.controller;

import com.notes.notification.entity.Notification;
import com.notes.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/share-request")
    public ResponseEntity<Notification> createShareRequest(@RequestBody Map<String, String> request) {
        Notification notification = notificationService.createShareRequest(
            request.get("recipientEmail"),
            request.get("senderEmail"),
            request.get("noteId"),
            request.get("noteTitle")
        );
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<String> acceptShareRequest(@PathVariable Long id, @RequestBody Map<String, String> request) {
        notificationService.acceptShareRequest(id, request.get("userEmail"));
        return ResponseEntity.ok("Share request accepted");
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<String> rejectShareRequest(@PathVariable Long id, @RequestBody Map<String, String> request) {
        notificationService.rejectShareRequest(id, request.get("userEmail"));
        return ResponseEntity.ok("Share request rejected");
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String email) {
        List<Notification> notifications = notificationService.getUserNotifications(email);
        return ResponseEntity.ok(notifications);
    }
}