package g55.cs3219.backend.roomservice.model;

import java.time.Instant;
import java.util.List;
import java.util.ArrayList;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {
  @Id
  private String roomId;

  @Column(nullable = false)
  private Instant expiryTime;

  @Column(nullable = false)
  @JdbcTypeCode(SqlTypes.JSON)
  private List<Participant> participants = new ArrayList<>();

  @Column(nullable = false)
  private Integer questionId;

  @Column(nullable = false)
  private boolean isClosed = false;

  public RoomStatus getStatus() {
    if (Instant.now().isAfter(expiryTime)) {
      return RoomStatus.EXPIRED;
    } else if (isClosed) {
      return RoomStatus.CLOSED;
    } else {
      return RoomStatus.OPEN;
    }
  }
}
