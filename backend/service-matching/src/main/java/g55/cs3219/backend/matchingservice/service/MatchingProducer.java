package g55.cs3219.backend.matchingservice.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import g55.cs3219.backend.matchingservice.model.MatchingRequest;

@Service
public class MatchingProducer {

    private final RabbitTemplate rabbitTemplate;

    public MatchingProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendMatchingRequest(MatchingRequest request) {
        rabbitTemplate.convertAndSend("matchingQueue", request);
    }
}