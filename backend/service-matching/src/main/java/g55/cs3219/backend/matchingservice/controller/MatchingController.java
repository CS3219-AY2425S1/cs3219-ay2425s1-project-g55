package g55.cs3219.backend.matchingservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g55.cs3219.backend.matchingservice.model.MatchingRequest;
import g55.cs3219.backend.matchingservice.service.MatchingProducer;
import g55.cs3219.backend.matchingservice.service.MatchingService;

@RestController
@RequestMapping("/api/match")
public class MatchingController {

    private final MatchingProducer matchingProducer;
    private final MatchingService matchingService;

    public MatchingController(MatchingProducer matchingProducer, MatchingService matchingService) {
        this.matchingProducer = matchingProducer;
        this.matchingService = matchingService;
    }

    @PostMapping
    public ResponseEntity<String> requestMatch(@RequestBody MatchingRequest request) {
        matchingProducer.sendMatchingRequest(request);
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