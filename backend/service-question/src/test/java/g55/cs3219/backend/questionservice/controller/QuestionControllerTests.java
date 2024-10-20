package g55.cs3219.backend.questionservice.controller;

import g55.cs3219.backend.questionservice.dto.QuestionDto;
import g55.cs3219.backend.questionservice.exception.ErrorResponse;
import g55.cs3219.backend.questionservice.exception.QuestionNotFoundException;
import g55.cs3219.backend.questionservice.model.Question;
import g55.cs3219.backend.questionservice.service.QuestionService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = RANDOM_PORT)
class QuestionControllerTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @MockBean
    private QuestionService questionService;

    private static QuestionDto questionDto1;
    private static QuestionDto questionDto2;
    private static QuestionDto questionDto3;

    @BeforeEach
    void setUp() {
        Question question1 = Question.builder()
                .id(1)
                .title("Question 1")
                .description("Description 1")
                .difficulty("Easy")
                .categories(Arrays.asList("Category1", "Category2"))
                .examples(Arrays.asList(new HashMap<>()))
                .constraints(Arrays.asList("Constraint1"))
                .link("http://example1.com")
                .build();

        Question question2 = Question.builder()
                .id(2)
                .title("Question 2")
                .description("Description 2")
                .difficulty("Medium")
                .categories(Arrays.asList("Category2", "Category3"))
                .examples(Arrays.asList(new HashMap<>()))
                .constraints(Arrays.asList("Constraint2"))
                .link("http://example2.com")
                .build();

        Question question3 = Question.builder()
                .id(3)
                .title("Question 3")
                .description("Description 3")
                .difficulty("Hard")
                .categories(Arrays.asList("Category1", "Category3"))
                .examples(Arrays.asList(new HashMap<>()))
                .constraints(Arrays.asList("Constraint3"))
                .link("http://example3.com")
                .build();

        questionDto1 = convertToDto(question1);
        questionDto2 = convertToDto(question2);
        questionDto3 = convertToDto(question3);
    }

    @Test
    void getAllQuestions_QuestionsExists_ReturnsQuestions() {
        List<QuestionDto> questions = Arrays.asList(questionDto1, questionDto2);

        when(questionService.getAllQuestions()).thenReturn(questions);

        ResponseEntity<QuestionDto[]> response = restTemplate.getForEntity(
                "/api/question/questions",
                QuestionDto[].class
        );

        assertEquals(OK, response.getStatusCode());
        assertEquals(2, response.getBody().length);
        assertEquals("Question 1", response.getBody()[0].getTitle());
        assertEquals("Question 2", response.getBody()[1].getTitle());
    }

    @Test
    void getAllQuestions_QuestionDoesNotExist_ReturnsEmptyList() {
        when(questionService.getAllQuestions()).thenReturn(Collections.emptyList());

        ResponseEntity<QuestionDto[]> response = restTemplate.getForEntity(
                "/api/question/questions",
                QuestionDto[].class
        );

        assertEquals(OK, response.getStatusCode());
        assertEquals(0, response.getBody().length);
    }

    @Test
    void getQuestionById_ExistingId_ReturnsQuestion() {
        when(questionService.getQuestionById(1)).thenReturn(questionDto1);

        ResponseEntity<QuestionDto> response = restTemplate.getForEntity(
                "/api/question/1",
                QuestionDto.class
        );

        assertEquals(OK, response.getStatusCode());
        assertEquals("Question 1", response.getBody().getTitle());
    }

    @Test
    void getQuestionsByFilters_QuestionExists_ReturnsQuestions() {
        List<QuestionDto> questions = Arrays.asList(questionDto1, questionDto2);

        when(questionService.getQuestionsByFilters("category", "easy")).thenReturn(questions);

        ResponseEntity<QuestionDto[]> response = restTemplate.getForEntity(
                "/api/question/filter?category=category&difficulty=easy",
                QuestionDto[].class
        );

        assertEquals(OK, response.getStatusCode());
        assertEquals(2, response.getBody().length);
        assertEquals("Question 1", response.getBody()[0].getTitle());
        assertEquals("Question 2", response.getBody()[1].getTitle());
    }

    @Test
    void getQuestionsByFilters_QuestionDoesNotExist_ReturnsEmptyList() {
        when(questionService.getQuestionsByFilters("category", "easy"))
                .thenReturn(Collections.emptyList());

        ResponseEntity<QuestionDto[]> response = restTemplate.getForEntity(
                "/api/question/filter?category=category&difficulty=easy",
                QuestionDto[].class
        );

        assertEquals(OK, response.getStatusCode());
        assertEquals(0, response.getBody().length);
    }

    @Test
    void createQuestion_ValidInput_ReturnsCreatedQuestion() {
        when(questionService.createQuestion(any(QuestionDto.class))).thenReturn(questionDto1);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<QuestionDto> request = new HttpEntity<>(questionDto1, headers);

        ResponseEntity<QuestionDto> response = restTemplate.postForEntity(
                "/api/question",
                request,
                QuestionDto.class
        );

        assertEquals(OK, response.getStatusCode());
        assertEquals("Question 1", response.getBody().getTitle());
    }

    @Test
    void updateQuestion_ExistingId_ReturnsUpdatedQuestion() {
        QuestionDto updatedQuestion = new QuestionDto();
        updatedQuestion.setId(1);
        updatedQuestion.setTitle("Updated Title");

        when(questionService.updateQuestion(Mockito.eq(1), any(QuestionDto.class))).thenReturn(updatedQuestion);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<QuestionDto> request = new HttpEntity<>(updatedQuestion, headers);

        ResponseEntity<QuestionDto> response = restTemplate.exchange(
                "/api/question/1",
                HttpMethod.PUT,
                request,
                QuestionDto.class
        );

        assertEquals(OK, response.getStatusCode());
        assertEquals("Updated Title", response.getBody().getTitle());
    }

    @Test
    void deleteQuestion_ExistingId_ReturnsSuccessMessage() {
        when(questionService.deleteQuestion(1))
                .thenReturn("Question with ID 1 has been deleted.");

        ResponseEntity<String> response = restTemplate.exchange(
                "/api/question/1",
                HttpMethod.DELETE,
                null,
                String.class
        );

        assertEquals(OK, response.getStatusCode());
        assertEquals("Question with ID 1 has been deleted.", response.getBody());
    }

    @Test
    void deleteQuestion_NonExistingId_ReturnsNotFound() {
        when(questionService.deleteQuestion(99))
                .thenThrow(new QuestionNotFoundException("Question not found"));

        ResponseEntity<ErrorResponse> response = restTemplate.exchange(
                "/api/question/99",
                HttpMethod.DELETE,
                null,
                ErrorResponse.class
        );

        assertEquals(NOT_FOUND, response.getStatusCode());
        assertEquals(404, response.getBody().getStatus());
        assertEquals("Question not found", response.getBody().getMessage());
    }

    private QuestionDto convertToDto(Question question) {
        QuestionDto dto = new QuestionDto();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setDescription(question.getDescription());
        dto.setDifficulty(question.getDifficulty());
        dto.setCategories(question.getCategories());
        dto.setExamples(question.getExamples());
        dto.setConstraints(question.getConstraints());
        dto.setLink(question.getLink());
        return dto;
    }
}