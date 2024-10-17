package g55.cs3219.backend.matchingservice.service;

import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQConsumer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void receive(String queueName) {
        Message message = rabbitTemplate.receive(queueName);
        if (message != null) {
            try {
                String messageBody = new String(message.getBody());
                System.out.println("Received message: " + messageBody);
                // Process the message
                // Acknowledge the message
                // Channel channel = message.getMessageProperties().getChannel();
                // long deliveryTag = message.getMessageProperties().getDeliveryTag();
                // channel.basicAck(deliveryTag, false);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("No messages in queue: " + queueName);
        }
    }
}