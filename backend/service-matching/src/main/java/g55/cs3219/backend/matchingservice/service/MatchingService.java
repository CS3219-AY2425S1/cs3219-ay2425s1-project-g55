package g55.cs3219.backend.matchingservice.service;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import g55.cs3219.backend.matchingservice.dto.QuestionDto;
import g55.cs3219.backend.matchingservice.model.MatchingRequest;

@Service
public class MatchingService {
    private final ConcurrentHashMap<String, MatchingRequest> waitingUsers = new ConcurrentHashMap<>();
    private final RestTemplate restTemplate;
    private final Logger logger = LoggerFactory.getLogger(MatchingService.class);
    private final String questionServiceUrl = "http://backend-service-question:8080/api/questions/filter";

    public MatchingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Optional<MatchingRequest> findMatch(MatchingRequest request) {
        Optional<MatchingRequest> match = waitingUsers.values().stream()
                .filter(user -> user.getTopic().equals(request.getTopic())
                        && user.getDifficultyLevel().equals(request.getDifficultyLevel()))
                .findFirst();
        if (match.isPresent()) {
            waitingUsers.remove(match.get().getUserId());
            return match;
        } else {
            waitingUsers.put(request.getUserId(), request);
            return Optional.empty();
        }
    }

    public boolean removeFromWaiting(String userId) {
        return waitingUsers.remove(userId) != null;
    }

    public String getWaitingUsersStatus() {
        return waitingUsers.toString();
    }

    /**
     * Retrieves the id for a question based on the match request constraints.
     * If there are multiple questions that match the criteria, return a random
     * one.
     * 
     * @param request the match request
     * @return the question id
     */
    public Integer getQuestionIdForMatchRequest(MatchingRequest request) {
        String topic = request.getTopic();
        String difficulty = request.getDifficultyLevel();

        try {
            this.logger.info("Getting question id for match request: " + request);
            QuestionDto[] responses = restTemplate.getForObject(
                    questionServiceUrl + "?category=" + topic + "&difficulty=" + difficulty, QuestionDto[].class);
            if (responses == null || responses.length == 0) {
                this.logger.error("No questions found matching criteria");
                throw new RuntimeException("No questions found matching criteria");
            }

            this.logger.info("Found " + responses.length + " questions matching criteria");
            int randomIndex = (int) (Math.random() * responses.length);
            QuestionDto response = responses[randomIndex];
            return response.getId();
        } catch (Exception e) {
            this.logger.error("Error getting question: " + e.getMessage());
        }

        // Default to question 1 if there is an error
        this.logger.info("Defaulting to question 1");
        return 1;
    }
}
