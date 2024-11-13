package g55.cs3219.backend.roomservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import g55.cs3219.backend.roomservice.service.RoomService;
import g55.cs3219.backend.roomservice.websocket.RoomWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

  private final RoomService roomService;

  public WebSocketConfig(RoomService roomService) {
    this.roomService = roomService;
  }

  @Override
  public void registerWebSocketHandlers(@NonNull WebSocketHandlerRegistry registry) {
    registry.addHandler(roomWebSocketHandler(), RoomWebSocketHandler.ROOM_URI_TEMPLATE)
        .setAllowedOrigins("*");
  }

  @Bean
  public RoomWebSocketHandler roomWebSocketHandler() {
    return new RoomWebSocketHandler(roomService);
  }
}