package g55.cs3219.backend.roomservice.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  private final Environment environment;

  public SecurityConfig(Environment environment) {
    this.environment = environment;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(Customizer.withDefaults())
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(requests -> requests
            .requestMatchers("/**").permitAll());

    return http.build();
  }

  @Bean
  public UrlBasedCorsConfigurationSource corsConfigurationSource() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();

    if (isTestEnvironment()) {
      System.out.println("THIS IS THE TEST ENVIRONMENT BABY");
      config.addAllowedOrigin("*");
    } else {
      config.addAllowedOrigin("http://localhost:5173");
      config.addAllowedOrigin("ws://localhost:5173");
    }

    config.addAllowedMethod("*");
    config.addAllowedHeader("*");
    config.setAllowCredentials(false);

    source.registerCorsConfiguration("/**", config);
    source.registerCorsConfiguration("/ws/**", config);
    return source;
  }

  private boolean isTestEnvironment() {
    return Arrays.stream(environment.getActiveProfiles())
        .anyMatch(profile -> profile.toLowerCase().contains("test")) ||
        environment.getProperty("spring.profiles.active", "")
            .toLowerCase()
            .contains("test");
  }
}