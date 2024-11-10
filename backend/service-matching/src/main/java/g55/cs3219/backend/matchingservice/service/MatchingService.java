package g55.cs3219.backend.matchingservice.service;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import g55.cs3219.backend.matchingservice.dto.QuestionDto;
import g55.cs3219.backend.matchingservice.model.MatchingRequest;

@Service
public class MatchingService {
    private final ConcurrentHashMap<String, MatchingRequest> waitingUsers = new ConcurrentHashMap<>();
    private final RestTemplate restTemplate;
    private final Logger logger = LoggerFactory.getLogger(MatchingService.class);
    private final String questionServiceUrl = "http://question-service.g55.svc.cluster.local:8080/api/questions/filter";

    public MatchingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Optional<MatchingRequest> findMatch(MatchingRequest request) {
        // Priority 1: Exact match (same topic and difficulty)
        Optional<MatchingRequest> exactMatch = waitingUsers.values().stream()
                .filter(user -> user.getTopic().equals(request.getTopic())
                        && user.getDifficultyLevel().equals(request.getDifficultyLevel()))
                .findFirst();
        
        if (exactMatch.isPresent()) {
            waitingUsers.remove(exactMatch.get().getUserId());
            logger.info("Found exact match for user: " + request.getUserId());
            return exactMatch;
        }

        // Priority 2: Same topic, any difficulty
        Optional<MatchingRequest> topicMatch = waitingUsers.values().stream()
                .filter(user -> user.getTopic().equals(request.getTopic()))
                .findFirst();

        if (topicMatch.isPresent()) {
            waitingUsers.remove(topicMatch.get().getUserId());
            logger.info("Found topic match with different difficulty for user: " + request.getUserId());
            return topicMatch;
        }

        // No match found, add to waiting pool
        waitingUsers.put(request.getUserId(), request);
        logger.info("No match found, added user to waiting pool: " + request.getUserId());
        return Optional.empty();
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
        String authToken = request.getAuthToken();

        try {
            this.logger.info("Getting question id for match request: " + request);
            String urlString = questionServiceUrl + "?category=" + topic + "&difficulty=" + difficulty;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authToken); 

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<QuestionDto[]> responseEntity = restTemplate.exchange(
                    urlString,
                    HttpMethod.GET,
                    entity,
                    QuestionDto[].class);
            
            QuestionDto[] responses = responseEntity.getBody();

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
