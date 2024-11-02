package g55.cs3219.backend.roomservice.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import g55.cs3219.backend.roomservice.config.RabbitMQConfig;
import g55.cs3219.backend.roomservice.model.MatchFoundEvent;
import g55.cs3219.backend.roomservice.service.RoomService;

@Service
public class MatchFoundConsumer {
  private final RoomService roomService;

  public MatchFoundConsumer(RoomService roomService) {
    this.roomService = roomService;
  }

  @RabbitListener(queues = RabbitMQConfig.MATCH_FOUND_QUEUE)
  public void handleMatchFoundEvent(MatchFoundEvent event) {
    roomService.handleMatchFoundEvent(event);
  }
}
