package g55.cs3219.backend.roomservice.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import g55.cs3219.backend.roomservice.model.MatchFoundEvent;
import g55.cs3219.backend.roomservice.model.Room;
import g55.cs3219.backend.roomservice.model.RoomStatus;
import g55.cs3219.backend.roomservice.repository.RoomRepository;

@Service
public class RoomService {
  private final RoomRepository roomRepository;
  // private final RoomWebSocketHandler webSocketHandler;

  private static final long DEFAULT_ROOM_DURATION_HOURS = 1;
  private static final Logger logger = LoggerFactory.getLogger(RoomService.class);

  public RoomService(RoomRepository roomRepository) {
    this.roomRepository = roomRepository;
    // this.webSocketHandler = webSocketHandler;
  }

  public void handleMatchFoundEvent(MatchFoundEvent event) {
    logger.info("Received match found event for room: {}", event.getRoomId());
    Room room = new Room(
        event.getRoomId(),
        Instant.now().plus(DEFAULT_ROOM_DURATION_HOURS, ChronoUnit.HOURS),
        event.getParticipantIds(),
        // TODO: Implement question selection logic
        event.getQuestionId(),
        false);

    roomRepository.save(room);
  }

  // TODO have a specific exception for room not found?
  public Room getRoom(String roomId) {
    return roomRepository.findById(roomId)
        .orElseThrow(() -> new RuntimeException("Room not found"));
  }

  /**
   * Checks if a user can join a room.
   * 
   * To join a room, the room must be open and the user must be a participant.
   */
  public boolean checkIfUserCanJoinRoom(String roomId, String userId) {
    Room room = getRoom(roomId);
    return room.getStatus() == RoomStatus.OPEN && room.getParticipants().contains(userId);
  }

  /**
   * Closes a room permanently.
   * 
   * @param roomId
   */
  public void closeRoom(String roomId) {
    Room room = getRoom(roomId);
    room.setClosed(true);
    roomRepository.save(room);
  }

  // public void broadcastToRoom(String roomId, String message) {
  // webSocketHandler.broadcastToRoom(roomId, message);
  // }
}
