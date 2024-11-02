package g55.cs3219.backend.roomservice.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import g55.cs3219.backend.roomservice.config.SecurityConfig;
import g55.cs3219.backend.roomservice.model.Room;
import g55.cs3219.backend.roomservice.service.RoomService;

@WebMvcTest(RoomController.class)
@Import(SecurityConfig.class)
class RoomControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private RoomService roomService;

  private Room testRoom;
  private final Instant expiryTime = Instant.parse("2034-03-15T10:00:00Z");

  @BeforeEach
  void setUp() {
    testRoom = new Room(
        "room-123",
        expiryTime,
        Arrays.asList("user1", "user2"),
        1,
        false);
  }

  @Test
  void getRoom_ExistingRoom_ShouldReturnRoom() throws Exception {
    // Arrange
    when(roomService.getRoom("room-123")).thenReturn(testRoom);

    // Act & Assert
    mockMvc.perform(get("/api/rooms/room-123"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.roomId").value("room-123"))
        .andExpect(jsonPath("$.expiryTime").value(expiryTime.toString()))
        .andExpect(jsonPath("$.participants[0]").value("user1"))
        .andExpect(jsonPath("$.participants[1]").value("user2"))
        .andExpect(jsonPath("$.questionId").value(1))
        .andExpect(jsonPath("$.status").value("OPEN"));
  }

  @Test
  void getRoom_ClosedRoom_ShouldReturnClosed() throws Exception {
    // Arrange
    testRoom.setClosed(true);
    when(roomService.getRoom("room-123")).thenReturn(testRoom);

    // Act & Assert
    mockMvc.perform(get("/api/rooms/room-123"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("CLOSED"));
  }

  @Test
  void getRoom_ExpiredRoom_ShouldReturnExpired() throws Exception {
    testRoom.setExpiryTime(Instant.now().minusSeconds(1));
    when(roomService.getRoom("room-123")).thenReturn(testRoom);

    // Act & Assert
    mockMvc.perform(get("/api/rooms/room-123"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("EXPIRED"));
  }

  @Test
  void getRoom_NonExistingRoom_ShouldReturnNotFound() throws Exception {
    // Arrange
    when(roomService.getRoom("non-existing-room"))
        .thenThrow(new RuntimeException("Room not found"));

    // Act & Assert
    mockMvc.perform(get("/api/rooms/non-existing-room"))
        .andExpect(status().isInternalServerError());
  }
}