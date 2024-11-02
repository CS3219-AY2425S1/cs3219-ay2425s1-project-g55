package g55.cs3219.backend.matchingservice.service;

import java.net.URI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

public class MatchingWebSocketHandler extends TextWebSocketHandler {

    private final NotificationService notificationService;
    private final MatchingService matchingService;
    private final Logger logger = LoggerFactory.getLogger(MatchingWebSocketHandler.class);

    public MatchingWebSocketHandler(NotificationService notificationService, MatchingService matchingService) {
        this.notificationService = notificationService;
        this.matchingService = matchingService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = extractUserId(session);
        logger.info("WebSocket connection established for user: {}", userId);
        if (userId != null) {
            notificationService.registerUserSession(userId, session);
        } else {
            session.close(CloseStatus.BAD_DATA.withReason("UserId not provided"));
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming messages if needed
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String userId = extractUserId(session);
        logger.info("WebSocket connection closed for user: {}", userId);
        if (userId != null) {
            notificationService.removeUserSession(userId);
            matchingService.removeFromWaiting(userId);
        }
    }

    private String extractUserId(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri != null) {
            String query = uri.getQuery();
            if (query != null && !query.isEmpty()) {
                return UriComponentsBuilder.newInstance().query(query).build().getQueryParams().getFirst("userId");
            }
        }
        return null;
    }
}