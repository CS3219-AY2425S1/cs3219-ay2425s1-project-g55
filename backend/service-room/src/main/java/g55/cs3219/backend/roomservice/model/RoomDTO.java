package g55.cs3219.backend.roomservice.model;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
  private String roomId;
  private Instant expiryTime;
  private List<String> participants;
  private Integer questionId;
  private RoomStatus status;

  public static RoomDTO fromRoom(Room room) {
    return new RoomDTO(
        room.getRoomId(),
        room.getExpiryTime(),
        room.getParticipants(),
        room.getQuestionId(),
        room.getStatus());
  }
}