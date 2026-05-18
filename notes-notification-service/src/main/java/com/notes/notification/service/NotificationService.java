package com.notes.notification.service;

import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import com.notes.notification.entity.Notification;
import com.notes.notification.entity.NotificationType;
import com.notes.notification.entity.NotificationStatus;
import com.notes.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private Firestore firestore;

    public Notification createShareRequest(String recipientEmail, String senderEmail, String noteId, String noteTitle) {
        Notification notification = new Notification(recipientEmail, senderEmail, noteId, noteTitle, 
            NotificationType.SHARE_REQUEST);
        notification = notificationRepository.save(notification);
        
        // Send real-time notification
        messagingTemplate.convertAndSendToUser(recipientEmail, "/queue/notifications", notification);
        
        return notification;
    }

    public void acceptShareRequest(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        String normalizedUserEmail = userEmail == null ? "" : userEmail.trim().toLowerCase();
        
        if (!notification.getRecipientEmail().equalsIgnoreCase(normalizedUserEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setStatus(NotificationStatus.ACCEPTED);
        notification.setRespondedAt(LocalDateTime.now());
        notificationRepository.save(notification);

        Map<String, Object> updates = new HashMap<>();
        updates.put("collaboratorEmails", FieldValue.arrayUnion(normalizedUserEmail));
        firestore.collection("notes")
                .document(notification.getNoteId())
                .set(updates, SetOptions.merge());
        
        // Notify sender
        Notification senderNotification = new Notification(
            notification.getSenderEmail(), 
            notification.getRecipientEmail(),
            notification.getNoteId(),
            notification.getNoteTitle(),
            NotificationType.SHARE_ACCEPTED
        );
        senderNotification.setStatus(NotificationStatus.READ);
        notificationRepository.save(senderNotification);
        
        messagingTemplate.convertAndSendToUser(notification.getSenderEmail(), "/queue/notifications", senderNotification);
    }

    public void rejectShareRequest(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        
        if (!notification.getRecipientEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setStatus(NotificationStatus.REJECTED);
        notification.setRespondedAt(LocalDateTime.now());
        notificationRepository.save(notification);
        
        // Notify sender
        Notification senderNotification = new Notification(
            notification.getSenderEmail(),
            notification.getRecipientEmail(),
            notification.getNoteId(),
            notification.getNoteTitle(),
            NotificationType.SHARE_REJECTED
        );
        senderNotification.setStatus(NotificationStatus.READ);
        notificationRepository.save(senderNotification);
        
        messagingTemplate.convertAndSendToUser(notification.getSenderEmail(), "/queue/notifications", senderNotification);
    }

    public List<Notification> getUserNotifications(String userEmail) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(userEmail);
    }
}