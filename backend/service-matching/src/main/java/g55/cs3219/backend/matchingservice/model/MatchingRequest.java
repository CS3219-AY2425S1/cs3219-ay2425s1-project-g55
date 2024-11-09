package g55.cs3219.backend.matchingservice.model;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchingRequest implements Serializable {
    private String userId;
    private String username;
    private String topic;
    private String difficultyLevel;
    private String authToken;

    @Override
    public String toString() {
        return "MatchingRequest{" +
                "userId='" + userId + '\'' +
                ", topic='" + topic + '\'' +
                ", difficultyLevel='" + difficultyLevel + '\'' +
                ", authToken='" + (authToken != null ? "REDACTED" : null) + '\'' +
                '}';
    }
}