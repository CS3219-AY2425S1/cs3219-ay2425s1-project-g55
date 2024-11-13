package g55.cs3219.backend.roomservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import g55.cs3219.backend.roomservice.model.MatchFoundEvent;
import g55.cs3219.backend.roomservice.model.Participant;
import g55.cs3219.backend.roomservice.model.Room;
import g55.cs3219.backend.roomservice.repository.RoomRepository;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

  @Mock
  private RoomRepository roomRepository;

  private RoomService roomService;

  @BeforeEach
  void setUp() {
    roomService = new RoomService(roomRepository);
  }

  @Test
  void handleMatchFoundEvent_ShouldCreateAndSaveRoom() {
    // Arrange
    String roomId = "room-123";
    List<Participant> participants = Arrays.asList(
        new Participant("user1", "user1"),
        new Participant("user2", "user2"));
    Integer questionId = 1;

    MatchFoundEvent event = new MatchFoundEvent();
    event.setRoomId(roomId);
    event.setParticipants(participants);
    event.setQuestionId(questionId);

    ArgumentCaptor<Room> roomCaptor = ArgumentCaptor.forClass(Room.class);

    // Act
    roomService.handleMatchFoundEvent(event);

    // Assert
    verify(roomRepository).save(roomCaptor.capture());
    Room savedRoom = roomCaptor.getValue();

    assertEquals(roomId, savedRoom.getRoomId());
    assertEquals(participants, savedRoom.getParticipants());
    assertEquals(questionId, savedRoom.getQuestionId());
    assertFalse(savedRoom.isClosed());
    assertNotNull(savedRoom.getExpiryTime());
  }

  @Test
  void getRoom_ExistingRoom_ShouldReturnRoom() {
    // Arrange
    String roomId = "room-123";
    Room expectedRoom = new Room(roomId, Instant.now(), Arrays.asList(
        new Participant("user1", "user1"),
        new Participant("user2", "user2")), 1, false);
    when(roomRepository.findById(roomId)).thenReturn(Optional.of(expectedRoom));

    // Act
    Room actualRoom = roomService.getRoom(roomId);

    // Assert
    assertEquals(expectedRoom, actualRoom);
    verify(roomRepository).findById(roomId);
  }

  @Test
  void getRoom_NonExistingRoom_ShouldThrowException() {
    // Arrange
    String roomId = "non-existing-room";
    when(roomRepository.findById(roomId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> roomService.getRoom(roomId));
    verify(roomRepository).findById(roomId);
  }

  @Test
  void handleMatchFoundEvent_ShouldSetCorrectExpiryTime() {
    // Arrange
    MatchFoundEvent event = new MatchFoundEvent();
    event.setRoomId("room-123");
    event.setParticipants(Arrays.asList(
        new Participant("user1", "user1"),
        new Participant("user2", "user2")));
    event.setQuestionId(1);

    ArgumentCaptor<Room> roomCaptor = ArgumentCaptor.forClass(Room.class);
    Instant beforeCreation = Instant.now();

    // Act
    roomService.handleMatchFoundEvent(event);

    // Assert
    verify(roomRepository).save(roomCaptor.capture());
    Room savedRoom = roomCaptor.getValue();

    Instant expiryTime = savedRoom.getExpiryTime();
    Instant expectedMinExpiryTime = beforeCreation.plusSeconds(3600); // 1 hour

    assertTrue(expiryTime.isAfter(beforeCreation));
    assertTrue(expiryTime.isBefore(beforeCreation.plusSeconds(3601))); // Allow 1 second buffer
  }
}