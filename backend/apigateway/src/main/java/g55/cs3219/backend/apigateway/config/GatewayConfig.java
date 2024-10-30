package g55.cs3219.backend.apigateway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import g55.cs3219.backend.apigateway.filter.AuthenticationFilter;

@Configuration
public class GatewayConfig {

    @Autowired
    AuthenticationFilter authenticationFilter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("question-service", r -> r.path("/api/question/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://QUESTION-SERVICE"))
                .route("user-service-auth", r -> r
                        .path("/api/auth/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://USER-SERVICE"))
                .route("user-service", r -> r.path("/api/users/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://USER-SERVICE"))
                .route("matching-service", r -> r.path("/api/match/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://MATCHING-SERVICE"))
                .build();
    }

}