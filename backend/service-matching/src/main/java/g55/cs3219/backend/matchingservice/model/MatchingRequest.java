package g55.cs3219.backend.matchingservice.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchingRequest {
    private String userId;
    private String topic;
    private String difficulty;
}