package g55.cs3219.backend.matchingservice.service;

import org.springframework.stereotype.Service;
import g55.cs3219.backend.matchingservice.model.MatchingRequest;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;

@Service
public class MatchingService {
    private final ConcurrentHashMap<String, MatchingRequest> waitingUsers = new ConcurrentHashMap<>();

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
}