package g55.cs3219.backend.matchingservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class MatchingRequestBodyDto implements Serializable {
    private String topic;
    private String difficultyLevel;

    @Override
    public String toString() {
        return "MatchingRequestBodyDto{" +
                "topic='" + topic + '\'' +
                ", difficultyLevel='" + difficultyLevel + '\'' +
                '}';
    }
}