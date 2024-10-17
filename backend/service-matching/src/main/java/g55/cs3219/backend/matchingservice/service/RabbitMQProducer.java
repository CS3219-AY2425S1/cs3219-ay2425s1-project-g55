package g55.cs3219.backend.matchingservice.service;

import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.amqp.core.QueueInformation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RabbitMQProducer {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMQProducer.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private RabbitAdmin rabbitAdmin;

    @Autowired
    private QueueManager queueManager;

    public void send(String topic, String difficulty, String userId) {
        queueManager.createQueueIfNotExists(topic, difficulty);
        String routingKey = topic + "." + difficulty;
        rabbitTemplate.convertAndSend("matchingExchange", routingKey, userId);
    }

    public void logQueueStatus(String queueName) {
        QueueInformation queueInfo = rabbitAdmin.getQueueInfo(queueName);
        if (queueInfo != null) {
            logger.info("Queue Name: {}", queueInfo.getName());
            logger.info("Message Count: {}", queueInfo.getMessageCount());
            logger.info("Consumer Count: {}", queueInfo.getConsumerCount());
        } else {
            logger.warn("Queue {} not found", queueName);
        }
    }
}