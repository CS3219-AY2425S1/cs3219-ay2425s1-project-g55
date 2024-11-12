package g55.cs3219.backend.matchingservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class MatchingWebSocketHandler extends TextWebSocketHandler {

    private final NotificationService notificationService;
    private final MatchingService matchingService;
    private final Logger logger = LoggerFactory.getLogger(MatchingWebSocketHandler.class);

    public MatchingWebSocketHandler(NotificationService notificationService, MatchingService matchingService) {
        this.notificationService = notificationService;
        this.matchingService = matchingService;
    }

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
        String userId = extractUserId(session);
        logger.info("WebSocket connection established for user: {}", userId);
        if (userId != null) {
            notificationService.registerUserSession(userId, session);
        } else {
            session.close(CloseStatus.BAD_DATA.withReason("UserId not provided"));
        }
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
        String userId = extractUserId(session);
        logger.info("WebSocket connection closed for user: {}", userId);
        if (userId != null) {
            notificationService.removeUserSession(userId);
            matchingService.removeFromWaiting(userId);
        }
    }

    private String extractUserId(WebSocketSession session) {
        String userIdString = session.getHandshakeHeaders().getFirst("X-User-Id");
        if (userIdString != null) {
            return userIdString;
        }
        logger.warn("No userId found in WebSocket handshake headers");
        return null;
    }
}