package g55.cs3219.backend.historyservice.model;

import java.time.LocalDateTime;

import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Document(collection = "history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class History {
    @Transient
    public static final String SEQUENCE_NAME = "history_sequence";

    @Id
    private Integer id;

    private Integer questionId;
    private Integer userId;
    private String code;
    private LocalDateTime attemptedAt;
}
