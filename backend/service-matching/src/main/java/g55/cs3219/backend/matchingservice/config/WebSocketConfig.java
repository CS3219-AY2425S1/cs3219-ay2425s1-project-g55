package g55.cs3219.backend.matchingservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import g55.cs3219.backend.matchingservice.service.MatchingService;
import g55.cs3219.backend.matchingservice.service.MatchingWebSocketHandler;
import g55.cs3219.backend.matchingservice.service.NotificationService;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final NotificationService notificationService;
    private final MatchingService matchingService;

    public WebSocketConfig(NotificationService notificationService, MatchingService matchingService) {
        this.notificationService = notificationService;
        this.matchingService = matchingService;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new MatchingWebSocketHandler(notificationService, matchingService), "/ws/matching")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:8080");
    }
}