package g55.cs3219.backend.collaborativeeditorservice.websocket;

import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriTemplate;

public class CollaborativeEditorWebSocketHandler extends BinaryWebSocketHandler {
    private final ConcurrentHashMap<String, CopyOnWriteArraySet<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final Logger logger = LoggerFactory.getLogger(CollaborativeEditorWebSocketHandler.class);
    public static final String ROOM_URI_TEMPLATE = "/ws/collaborative-editor/{roomId}";

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) {
        String room = extractRoom(session);
        rooms.computeIfAbsent(room, k -> new CopyOnWriteArraySet<>()).add(session);
        logger.info("Connection established for room: {}", room);
    }

    @Override
    protected void handleBinaryMessage(@NonNull WebSocketSession session, @NonNull BinaryMessage message) {
        String room = extractRoom(session);
        CopyOnWriteArraySet<WebSocketSession> clients = rooms.get(room);

        if (clients != null) {
            clients.forEach(client -> {
                try {
                    if (client.isOpen() && !client.getId().equals(session.getId())) {
                        client.sendMessage(message);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
        String room = extractRoom(session);
        CopyOnWriteArraySet<WebSocketSession> clients = rooms.get(room);
        if (clients != null) {
            clients.remove(session);
            if (clients.isEmpty()) {
                rooms.remove(room);
            }
        }
        logger.info("Connection closed for session: {}", session.getId());
    }

    private String extractRoom(WebSocketSession session){
        try {
            if (authenticateUser(session) == null) {
                session.close(CloseStatus.BAD_DATA.withReason("User not authenticated"));
                return null;
            }
        } catch (Exception e) {
            logger.error("Exception occurred during user authentication: {}", e.getMessage(), e);
            return null;
        }
        
        URI uri = session.getUri();
        if (uri == null) {
            logger.warn("Session URI is null");
            return null;
        }
        String path = uri.getPath();
        Map<String, String> variables = new UriTemplate(ROOM_URI_TEMPLATE).match(path);
        return variables.get("roomId");
    }

    private String authenticateUser(WebSocketSession session) {
        URI uri = session.getUri();
        String token = null;
        String query = null;

        if (uri != null) {
            query = uri.getQuery();
            if (query != null && !query.isEmpty()) {
                token =  UriComponentsBuilder.newInstance().query(query).build().getQueryParams().getFirst("token");
            } else {
                logger.warn("No query parameters found or token parameter missing");
            }
        }

        if (token != null) {
            RestTemplate restTemplate = new RestTemplate();
            String verifyTokenUrl = "http://user-service.g55.svc.cluster.local:8080/api/auth/verify-token";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            try {
                ResponseEntity<String> response = restTemplate.exchange(
                        verifyTokenUrl,
                        HttpMethod.GET,
                        entity,
                        String.class
                );

                logger.info("Response received from verify-token endpoint with status code: {}", response.getStatusCode());

                if (response.getStatusCode().is2xxSuccessful()) {
                    return response.getBody();
                } else {
                    logger.warn("Failed to verify token. Non-successful response received.");
                }
            } catch (Exception e) {
                logger.error("Exception occurred during token verification: {}", e.getMessage(), e);
            }
        } else {
            logger.warn("Token is null, unable to verify");
        }
        return null;
    }
}