package g55.cs3219.backend.matchingservice.service;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import g55.cs3219.backend.matchingservice.model.MatchingRequest;

@Service
public class MatchingConsumer {

    private final MatchingService matchingService;
    private final NotificationService notificationService;

    public MatchingConsumer(MatchingService matchingService, NotificationService notificationService) {
        this.matchingService = matchingService;
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = "matchingQueue")
    public void processMatchingRequest(MatchingRequest request) {
        System.out.println("Received matching request: " + request);
        
        // Log the status of the queue before attempting to find a match
        System.out.println("Queue status before matching: " + matchingService.getWaitingUsersStatus());

        // Try to find a match
        Optional<MatchingRequest> match = matchingService.findMatch(request);
        
        if (match.isPresent()) {
            // Match found
            MatchingRequest matchedUser = match.get();
            String roomId = UUID.randomUUID().toString().substring(0, 5);
            notificationService.notifyMatched(request.getUserId(), matchedUser.getUserId(), roomId);
            notificationService.notifyMatched(matchedUser.getUserId(), request.getUserId(), roomId);
        } else {
            // No immediate match, start timeout
            startMatchingTimeout(request);
        }

        // Log the status of the queue after attempting to find a match
        System.out.println("Queue status after matching: " + matchingService.getWaitingUsersStatus());
    }

    private void startMatchingTimeout(MatchingRequest request) {
        CompletableFuture.delayedExecutor(30, TimeUnit.SECONDS).execute(() -> {
            boolean removed = matchingService.removeFromWaiting(request.getUserId());
            if (removed) {
                // If the user was still in the waiting list after 30 seconds, notify them
                notificationService.notifyTimeout(request.getUserId());
            }
        });
    }
}