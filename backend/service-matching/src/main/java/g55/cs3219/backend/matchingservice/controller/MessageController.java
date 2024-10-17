package g55.cs3219.backend.matchingservice.controller;

import g55.cs3219.backend.matchingservice.model.MatchingRequest;
import g55.cs3219.backend.matchingservice.service.RabbitMQConsumer;
import g55.cs3219.backend.matchingservice.service.RabbitMQProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/matching")
public class MessageController {

    @Autowired
    private RabbitMQProducer rabbitMQProducer;

    @Autowired
    private RabbitMQConsumer rabbitMQConsumer;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/match")
    public void sendMessage(@RequestBody MatchingRequest matchingRequest) {
        try {
            rabbitMQProducer.send(matchingRequest.getTopic(), matchingRequest.getDifficulty(), matchingRequest.getUserId());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/consume")
    public void consumeMessage(@RequestBody MatchingRequest matchingRequest) {
        try {
            String queueName = matchingRequest.getTopic() + "." + matchingRequest.getDifficulty();
            rabbitMQConsumer.receive(queueName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}