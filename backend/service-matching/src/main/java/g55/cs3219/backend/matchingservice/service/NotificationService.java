package g55.cs3219.backend.matchingservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {

    private final ConcurrentHashMap<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    public void registerUserSession(String userId, WebSocketSession session) {
        userSessions.put(userId, session);
    }

    public void removeUserSession(String userId) {
        userSessions.remove(userId);
    }

    public void notifyMatched(String userId, String matchedUserId, String roomId) {
        String message = String.format("{\"type\": \"MATCH_FOUND\", \"roomId\": \"%s\", \"userId\": \"%s\"}", roomId, matchedUserId);
        sendMessage(userId, message);
    }

    public void notifyTimeout(String userId) {
        String message = "{\"type\": \"MATCH_TIMEOUT\"}";
        sendMessage(userId, message);
    }

    private void sendMessage(String userId, String message) {
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                // Handle the exception (log it, maybe remove the session if it's closed)
            }
        }
    }
}