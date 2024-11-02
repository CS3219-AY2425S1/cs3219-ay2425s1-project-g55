package g55.cs3219.backend.matchingservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.RestTemplate;

import g55.cs3219.backend.matchingservice.dto.QuestionDto;
import g55.cs3219.backend.matchingservice.model.MatchingRequest;

public class MatchingServiceTest {

  @Mock
  private RestTemplate restTemplate;

  private MatchingService matchingService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    matchingService = new MatchingService(restTemplate);
  }

  @Test
  void testGetQuestionIdForMatchRequest() {
    // Arrange
    MatchingRequest request = new MatchingRequest();
    request.setTopic("Algorithms");
    request.setDifficultyLevel("Medium");

    QuestionDto[] mockResponse = new QuestionDto[1];
    QuestionDto questionDto = new QuestionDto();
    questionDto.setId(4);
    questionDto.setTitle("Course Schedule");
    questionDto.setDifficulty("Medium");
    mockResponse[0] = questionDto;

    String expectedUrl = "http://backend-service-question:8080/api/questions/filter?category=Algorithms&difficulty=Medium";

    when(restTemplate.getForObject(eq(expectedUrl), eq(QuestionDto[].class)))
        .thenReturn(mockResponse);

    // Act
    Integer result = matchingService.getQuestionIdForMatchRequest(request);

    // Assert
    assertEquals(4, result);
  }

  @Test
  void testGetQuestionIdForMatchRequestWithError() {
    // Arrange
    MatchingRequest request = new MatchingRequest();
    request.setTopic("InvalidTopic");
    request.setDifficultyLevel("Medium");

    String expectedUrl = "http://backend-service-question:8080/api/questions/filter?category=InvalidTopic&difficulty=Medium";

    when(restTemplate.getForObject(eq(expectedUrl), eq(QuestionDto[].class)))
        .thenThrow(new RuntimeException("Error getting question"));

    // Act
    Integer result = matchingService.getQuestionIdForMatchRequest(request);

    // Assert
    assertEquals(1, result); // Default fallback value
  }
}