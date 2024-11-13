package g55.cs3219.backend.videoservice.websocket;

import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class SignalingWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(SignalingWebSocketHandler.class);
    private ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
        logger.info("Received message from session {}: {}", session.getId(), message.getPayload());
        // Forward the signaling message to all connected peers
        for (WebSocketSession s : sessions.values()) {
            if (!s.getId().equals(session.getId())) {
                logger.info("Forwarding message to session {}", s.getId());
                s.sendMessage(message);
            }
        }
    }

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) {
        String userId = extractUserId(session);
        if (userId == null) {
            logger.warn("Failed to authenticate user, closing connection");
            try {
                session.close();
            } catch (Exception e) {
                logger.error("Exception occurred while closing session: {}", e.getMessage(), e);
            }
            return;
        }
        sessions.put(session.getId(), session);
        logger.info("Connection established: session {}", session.getId());
    }

    private String extractUserId(WebSocketSession session) {
        String userIdString = session.getHandshakeHeaders().getFirst("X-User-Id");
        if (userIdString != null) {
            return userIdString;
        }
        logger.warn("No userId found in WebSocket handshake headers");
        return null;
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
        sessions.remove(session.getId());
        logger.info("Connection closed: session {} with status {}", session.getId(), status);
    }

}
