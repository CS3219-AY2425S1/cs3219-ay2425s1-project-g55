package g55.cs3219.backend.videoservice.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.TextMessage;

import java.net.URI;
import java.util.concurrent.ConcurrentHashMap;

public class SignalingWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(SignalingWebSocketHandler.class);
    private ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
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
    public void afterConnectionEstablished(WebSocketSession session) {
        if (authenticateUser(session) == null) {
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
    

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        sessions.remove(session.getId());
        logger.info("Connection closed: session {} with status {}", session.getId(), status);
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
