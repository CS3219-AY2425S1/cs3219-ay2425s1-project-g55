package g55.cs3219.backend.matchingservice.service;

import java.net.URI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

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
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = null;
        try {
            jsonNode = objectMapper.readTree(authenticateUser(session));
            if (jsonNode.has("id")) {
                String userId = jsonNode.get("id").asText();
                return userId;
            } else {
                logger.warn("Response JSON does not contain 'id' field");
            }
        } catch (Exception e) {
            logger.error("Exception occurred during token verification: {}", e.getMessage(), e);
        }

        logger.warn("Returning null, userId extraction failed");
        return null;
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