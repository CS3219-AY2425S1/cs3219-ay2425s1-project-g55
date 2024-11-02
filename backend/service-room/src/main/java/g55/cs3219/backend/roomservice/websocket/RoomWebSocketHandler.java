package g55.cs3219.backend.roomservice.websocket;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import g55.cs3219.backend.roomservice.model.ParticipantMessage;
import g55.cs3219.backend.roomservice.model.RoomDTO;
import g55.cs3219.backend.roomservice.service.RoomService;

@Service
public class RoomWebSocketHandler extends TextWebSocketHandler {
  private static final Logger logger = LoggerFactory.getLogger(RoomWebSocketHandler.class);
  public static final String ROOM_URI_TEMPLATE = "/ws/rooms/{roomId}";

  // Map to store active sessions by room ID
  private final Map<String, Map<String, SessionInfo>> roomSessions = new ConcurrentHashMap<>();
  private final RoomService roomService;
  private final ObjectMapper objectMapper = new ObjectMapper().registerModule(
      new JavaTimeModule());

  public RoomWebSocketHandler(RoomService roomService) {
    this.roomService = roomService;
  }

  @Override
  public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
    // TODO have different exceptions?

    try {
      String roomId = extractRoomId(session);
      String userId = extractUserId(session);

      logger.info("WebSocket connection established for room: {} and user: {}", roomId, userId);

      boolean canJoinRoom = roomService.checkIfUserCanJoinRoom(roomId, userId);
      if (!canJoinRoom) {
        logger.error("User is not allowed to join room: {}", roomId);
        session.close(CloseStatus.BAD_DATA.withReason("User is not allowed to join this room"));
        return;
      }

      // Create SessionInfo object and store it
      SessionInfo sessionInfo = new SessionInfo(session, userId);
      Optional<SessionInfo> sessionInfoOptional = getExistingSessionForUser(roomId, userId);
      boolean userWasAlreadyInRoom = sessionInfoOptional.isPresent();

      if (userWasAlreadyInRoom) {
        // Kick the user from the existing session
        SessionInfo existingSessionInfo = sessionInfoOptional.get();
        // Remove the existing session from the room such that it does not broadcast
        roomSessions.get(roomId).remove(existingSessionInfo.getSession().getId());
        existingSessionInfo.getSession().close(new CloseStatus(1000, "User is connecting a second time."));

        roomSessions.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>())
            .put(session.getId(), sessionInfo);
        broadcastParticipantMessage(roomId, userId, "RECONNECTED");
      } else {
        roomSessions.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>())
            .put(session.getId(), sessionInfo);
        broadcastParticipantMessage(roomId, userId, "ENTERED_ROOM");

      }
    } catch (Exception e) {
      logger.error("Error establishing WebSocket connection", e);
      session.close(CloseStatus.SERVER_ERROR);
    }
  }

  @Override
  protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
    String roomId = extractRoomId(session);
    String payload = message.getPayload();
    logger.info("Received message from room {}: {}", roomId, payload);

    Map<String, SessionInfo> sessions = roomSessions.get(roomId);
    if (sessions != null) {
      TextMessage broadcastMessage = new TextMessage(payload);
      for (SessionInfo sessionInfo : sessions.values()) {
        if (sessionInfo.isOpen()) {
          sessionInfo.getSession().sendMessage(broadcastMessage);
        }
      }
    }
  }

  @Override
  public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
    String roomId = extractRoomId(session);
    logger.info("WebSocket connection closed for room: {}", roomId);

    Map<String, SessionInfo> sessions = roomSessions.get(roomId);
    if (sessions != null) {
      SessionInfo sessionInfo = sessions.remove(session.getId());

      if (sessionInfo != null) {
        broadcastParticipantMessage(roomId, sessionInfo.getUserId(), "EXIT_ROOM");
      }

      if (sessions.isEmpty()) {
        roomSessions.remove(roomId);
      }
    }
  }

  @Override
  public void handleTransportError(@NonNull WebSocketSession session, @NonNull Throwable exception) throws Exception {
    logger.error("WebSocket transport error", exception);
    session.close(CloseStatus.SERVER_ERROR);
  }

  private String extractRoomId(WebSocketSession session) {
    String path = session.getUri().getPath();
    Map<String, String> variables = new UriTemplate(ROOM_URI_TEMPLATE).match(path);
    return variables.get("roomId");
  }

  private String extractUserId(WebSocketSession session) {
    // TODO integrate API gateway
    String userId = session.getHandshakeHeaders().getFirst("X-User-Id");

    if (userId != null) {
      return userId;
    }

    // throw new IllegalArgumentException("User ID is not present in the request");

    String query = session.getUri().getQuery();
    if (query == null) {
      throw new IllegalArgumentException("User ID is not present in the request");
    }

    String[] params = query.split("&");
    for (String param : params) {
      String[] keyValue = param.split("=");
      if (keyValue.length == 2 && keyValue[0].equals("userId")) {
        userId = keyValue[1];
        break;
      }
    }

    if (userId == null) {
      throw new IllegalArgumentException("User ID is not present in the request");
    }

    return userId;
  }

  private void broadcastParticipantMessage(String roomId, String userId, String status)
      throws JsonProcessingException {
    logger.info("Broadcasting {} message for user: {} to room: {}", status, userId, roomId);

    Set<String> activeParticipants = roomSessions.get(roomId).values().stream()
        .map(SessionInfo::getUserId)
        .collect(Collectors.toSet());
    RoomDTO room = RoomDTO.fromRoom(roomService.getRoom(roomId));

    ParticipantMessage message;

    switch (status) {
      case "ENTERED_ROOM":
        message = ParticipantMessage.enteredRoom(userId, activeParticipants, room);
        break;
      case "EXIT_ROOM":
        message = ParticipantMessage.exitRoom(userId, activeParticipants, room);
        break;
      case "RECONNECTED":
        message = ParticipantMessage.reconnected(userId, activeParticipants, room);
        break;
      default:
        throw new IllegalArgumentException("Invalid status: " + status);
    }

    broadcastToRoom(roomId, objectMapper.writeValueAsString(message));
  }

  /**
   * If the user is already in the room, return the existing session.
   */
  private Optional<SessionInfo> getExistingSessionForUser(String roomId, String userId) {
    return Optional.ofNullable(roomSessions.get(roomId))
        .map(Map::values)
        .map(values -> values.stream()
            .filter(sessionInfo -> sessionInfo.getUserId().equals(userId))
            .findFirst())
        .orElse(Optional.empty());
  }

  // Helper method to broadcast a message to all sessions in a room
  public void broadcastToRoom(String roomId, String message) {
    Map<String, SessionInfo> sessions = roomSessions.get(roomId);
    if (sessions != null) {
      TextMessage broadcastMessage = new TextMessage(message);
      sessions.values().forEach(sessionInfo -> {
        try {
          if (sessionInfo.isOpen()) {
            sessionInfo.getSession().sendMessage(broadcastMessage);
          }
        } catch (Exception e) {
          logger.error("Error broadcasting message to session", e);
        }
      });
    }
  }
}