package com.notes.notification.service;

import com.notes.notification.entity.Notification;
import com.notes.notification.entity.NotificationType;
import com.notes.notification.entity.NotificationStatus;
import com.notes.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

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
        
        if (!notification.getRecipientEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setStatus(NotificationStatus.ACCEPTED);
        notification.setRespondedAt(LocalDateTime.now());
        notificationRepository.save(notification);
        
        // TODO: Add Firebase integration to actually share the note
        // This would require Firebase Admin SDK to update the note document
        
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