package g55.cs3219.backend.matchingservice.service;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class QueueManager {

    @Autowired
    private RabbitAdmin rabbitAdmin;

    @Autowired
    private TopicExchange exchange;

    private final ConcurrentHashMap<String, Boolean> queueExistsMap = new ConcurrentHashMap<>();

    public void createQueueIfNotExists(String topic, String difficulty) {
        String queueName = topic + "." + difficulty;
        if (queueExistsMap.putIfAbsent(queueName, true) == null) {
            Queue queue = new Queue(queueName, true);
            rabbitAdmin.declareQueue(queue);

            String routingKey = topic + "." + difficulty;
            Binding binding = BindingBuilder.bind(queue).to(exchange).with(routingKey);
            rabbitAdmin.declareBinding(binding);
        }
    }
}