package g55.cs3219.backend.historyservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g55.cs3219.backend.historyservice.model.History;
import g55.cs3219.backend.historyservice.service.HistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {
    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/users/{userId}/attempts")
    public ResponseEntity<List<History>> getAllAttemptsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(historyService.getHistoryByUserId(userId));
    }

    @GetMapping("/users/{userId}/questions/{questionId}")
    public ResponseEntity<List<History>> getAllAttemptsByUserIdAndQuestionId(
            @PathVariable String userId,
            @PathVariable String questionId) {
        return ResponseEntity.ok(historyService.getHistoryByUserIdAndQuestionId(userId, questionId));
    }
}
