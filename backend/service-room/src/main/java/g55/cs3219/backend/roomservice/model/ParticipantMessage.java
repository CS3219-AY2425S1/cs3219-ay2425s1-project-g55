package g55.cs3219.backend.roomservice.model;

import java.time.Instant;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class ParticipantMessage {
  private final String type;
  private final String userId;
  private final Instant timestamp;
  private final Set<String> activeParticipants;
  private final RoomDTO room;

  @JsonCreator
  public ParticipantMessage(
      @JsonProperty("type") String type,
      @JsonProperty("userId") String userId,
      @JsonProperty("timestamp") Instant timestamp,
      @JsonProperty("activeParticipants") Set<String> activeParticipants,
      @JsonProperty("room") RoomDTO room) {
    this.type = type;
    this.userId = userId;
    this.timestamp = timestamp;
    this.activeParticipants = activeParticipants;
    this.room = room;
  }

  public static ParticipantMessage enteredRoom(String userId, Set<String> activeParticipants, RoomDTO room) {
    return new ParticipantMessage("ENTERED_ROOM", userId, Instant.now(), activeParticipants, room);
  }

  public static ParticipantMessage exitRoom(String userId, Set<String> activeParticipants, RoomDTO room) {
    return new ParticipantMessage("EXIT_ROOM", userId, Instant.now(), activeParticipants, room);
  }

  public static ParticipantMessage reconnected(String userId, Set<String> activeParticipants, RoomDTO room) {
    return new ParticipantMessage("RECONNECTED", userId, Instant.now(), activeParticipants, room);
  }
}
