package g55.cs3219.backend.roomservice.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import g55.cs3219.backend.roomservice.event.RoomEventListener;
import g55.cs3219.backend.roomservice.exception.RoomNotFoundException;
import g55.cs3219.backend.roomservice.model.MatchFoundEvent;
import g55.cs3219.backend.roomservice.model.Room;
import g55.cs3219.backend.roomservice.model.RoomStatus;
import g55.cs3219.backend.roomservice.repository.RoomRepository;

@Service
public class RoomService {
  private final RoomRepository roomRepository;
  private final List<RoomEventListener> listeners = new ArrayList<>();

  private static final long DEFAULT_ROOM_DURATION_HOURS = 1;
  private static final Logger logger = LoggerFactory.getLogger(RoomService.class);

  public RoomService(RoomRepository roomRepository) {
    this.roomRepository = roomRepository;
  }

  public void handleMatchFoundEvent(MatchFoundEvent event) {
    logger.info("Received match found event for room: {}", event.getRoomId());
    Room room = new Room(
        event.getRoomId(),
        Instant.now().plus(DEFAULT_ROOM_DURATION_HOURS, ChronoUnit.HOURS),
        event.getParticipants(),
        event.getQuestionId(),
        false);

    roomRepository.save(room);
  }

  // TODO have a specific exception for room not found?
  public Room getRoom(String roomId) {
    return roomRepository.findById(roomId)
        .orElseThrow(() -> new RoomNotFoundException(roomId, "Room not found"));
  }

  /**
   * Checks if a user can join a room.
   * 
   * To join a room, the room must be open and the user must be a participant.
   */
  public boolean checkIfUserCanJoinRoom(String roomId, String userId) {
    Room room = getRoom(roomId);
    return room.getStatus() == RoomStatus.OPEN && room.getParticipants().stream().anyMatch(
        participant -> participant.getUserId().equals(userId));
  }

  /**
   * Closes a room permanently.
   * 
   * @param roomId
   */
  public void closeRoom(String roomId, String userWhoClosedRoomId) {
    logger.info("Closing room: {}", roomId);

    Room room = getRoom(roomId);
    room.setClosed(true);
    roomRepository.save(room);

    logger.info("Notifying listeners");
    // Notify all listeners
    listeners.forEach(listener -> listener.onRoomClosed(roomId, userWhoClosedRoomId));
    logger.info("Notified listeners");
  }

  public void addListener(RoomEventListener listener) {
    listeners.add(listener);
  }

  public void removeListener(RoomEventListener listener) {
    listeners.remove(listener);
  }
}
