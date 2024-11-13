package g55.cs3219.backend.historyservice.model;

import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "database_sequences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatabaseSequence {

    @Id
    private String id;

    private long seq;
}