package g55.cs3219.backend.matchingservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g55.cs3219.backend.matchingservice.dto.MatchingRequestBodyDto;
import g55.cs3219.backend.matchingservice.model.MatchingRequest;
import g55.cs3219.backend.matchingservice.service.MatchingProducer;
import g55.cs3219.backend.matchingservice.service.MatchingService;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    private final MatchingProducer matchingProducer;
    private final MatchingService matchingService;

    public MatchingController(MatchingProducer matchingProducer, MatchingService matchingService) {
        this.matchingProducer = matchingProducer;
        this.matchingService = matchingService;
    }

    @PostMapping
    public ResponseEntity<String> requestMatch(@RequestHeader("X-User-Id") String userId,
                                               @RequestBody MatchingRequestBodyDto requestBodyDto) {

        MatchingRequest matchingRequest = new MatchingRequest();
        matchingRequest.setUserId(userId);
        matchingRequest.setTopic(requestBodyDto.getTopic());
        matchingRequest.setDifficultyLevel(requestBodyDto.getDifficultyLevel());

        matchingProducer.sendMatchingRequest(matchingRequest);
        return ResponseEntity.ok("{\"message\": \"Matching request sent\"}");
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> cancelMatch(@PathVariable String userId) {
        boolean removed = matchingService.removeFromWaiting(userId);
        if (removed) {
            return ResponseEntity.ok("{\"message\": \"Matching request cancelled\"}");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}