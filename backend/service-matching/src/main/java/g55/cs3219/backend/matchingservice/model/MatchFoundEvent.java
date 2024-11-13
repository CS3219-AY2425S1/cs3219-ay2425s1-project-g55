package g55.cs3219.backend.matchingservice.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Event sent when a match is found
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchFoundEvent {
  /**
   * The room id
   */
  private String roomId;

  /**
   * The participant ids
   */
  private List<RoomParticipant> participants;

  /**
   * The question id
   */
  private Integer questionId;
}
