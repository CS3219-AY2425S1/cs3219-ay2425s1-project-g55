package g55.cs3219.backend.collaborativeeditorservice.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import g55.cs3219.backend.collaborativeeditorservice.websocket.CollaborativeEditorWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final CollaborativeEditorWebSocketHandler webSocketHandler;
    private final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);

    public WebSocketConfig() {
        logger.info("WebSocketConfig constructor");
        this.webSocketHandler = new CollaborativeEditorWebSocketHandler();
    }

    @Override
    public void registerWebSocketHandlers(@NonNull WebSocketHandlerRegistry registry) {
        logger.info("Registering WebSocket handlers");
        registry.addHandler(webSocketHandler, CollaborativeEditorWebSocketHandler.ROOM_URI_TEMPLATE)
                .setAllowedOrigins("*");
    }
}