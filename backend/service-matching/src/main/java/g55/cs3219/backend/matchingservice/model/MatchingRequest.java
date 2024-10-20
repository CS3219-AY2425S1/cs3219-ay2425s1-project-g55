package g55.cs3219.backend.matchingservice.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class MatchingRequest implements Serializable {
    private String userId;
    private String topic;
    private String difficultyLevel;

    @Override
    public String toString() {
        return "MatchingRequest{" +
                "userId='" + userId + '\'' +
                ", topic='" + topic + '\'' +
                ", difficultyLevel='" + difficultyLevel + '\'' +
                '}';
    }
}