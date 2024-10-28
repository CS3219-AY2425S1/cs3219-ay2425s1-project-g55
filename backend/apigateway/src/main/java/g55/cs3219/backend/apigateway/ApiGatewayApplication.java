package g55.cs3219.backend.apigateway;

import g55.cs3219.backend.apigateway.filter.AuthFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Autowired
    private AuthFilter authFilter;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("question-service", r -> r.path("/api/question/**")
                        // .filters(f -> f.filter(authFilter))
                        .uri("lb://QUESTION-SERVICE"))
                .route("user-service-auth", r -> r
                        .path("/api/auth/**")
                        .and()
                        .method("POST", "GET", "PUT", "DELETE")  // explicitly allow these methods
                        .uri("lb://USER-SERVICE"))
                // .route("user-service", r -> r.path("/api/auth/**")
                //         // .filters(f -> f.filter(authFilter))
                //         .uri("lb://SERVICE-USER"))
                .route("matching-service", r -> r.path("/matching/**")
                        // .filters(f -> f.filter(authFilter))
                        .uri("lb://SERVICE-MATCHING"))
                .route("sample-service", r -> r.path("/sample/**")
                        // .filters(f -> f.filter(authFilter))
                        .uri("lb://SERVICE-SAMPLE"))
                .build();
    }
}