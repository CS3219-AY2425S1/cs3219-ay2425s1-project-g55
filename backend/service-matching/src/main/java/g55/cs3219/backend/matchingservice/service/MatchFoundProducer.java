package g55.cs3219.backend.matchingservice.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import g55.cs3219.backend.matchingservice.config.RabbitMQConfig;
import g55.cs3219.backend.matchingservice.model.MatchFoundEvent;

@Service
public class MatchFoundProducer {
  private final RabbitTemplate rabbitTemplate;

  public MatchFoundProducer(RabbitTemplate rabbitTemplate) {
    this.rabbitTemplate = rabbitTemplate;
  }

  public void sendMatchFoundEvent(MatchFoundEvent event) {
    rabbitTemplate.convertAndSend(RabbitMQConfig.MATCH_FOUND_QUEUE, event);
  }
}
