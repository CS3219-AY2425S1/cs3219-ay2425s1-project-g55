package g55.cs3219.backend.matchingservice.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String MATCHING_QUEUE = "matchingQueue";
    public static final String MATCH_FOUND_QUEUE = "matchFoundQueue";

    @Bean
    public Queue matchingQueue() {
        return new Queue(MATCHING_QUEUE, false);
    }

    @Bean
    public Queue matchFoundQueue() {
        return new Queue(MATCH_FOUND_QUEUE, false);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
