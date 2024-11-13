package g55.cs3219.backend.matchingservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {

    private final ConcurrentHashMap<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    private final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    public void registerUserSession(String userId, WebSocketSession session) {
        userSessions.put(userId, session);
    }

    public void removeUserSession(String userId) {
        userSessions.remove(userId);
    }

    public void notifyMatched(String userId, String matchedUserId, String roomId) {
        logger.info("Notifying user {} that they have been matched with user {}", userId, matchedUserId);
        String message = String.format("{\"type\": \"MATCH_FOUND\", \"roomId\": \"%s\", \"userId\": \"%s\"}", roomId, matchedUserId);
        sendMessage(userId, message);
    }

    public void notifyTimeout(String userId) {
        logger.info("Notifying user {} that they have been timed out", userId);
        String message = "{\"type\": \"MATCH_TIMEOUT\"}";
        sendMessage(userId, message);
    }

    private void sendMessage(String userId, String message) {
        logger.info("Sending message {} to user {}", message, userId);
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                logger.error("Error sending message {} to user {}: {}", message, userId, e.getMessage());
                // Handle the exception (log it, maybe remove the session if it's closed)
            }
        }
    }
}