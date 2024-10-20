package g55.cs3219.backend.questionservice.service;

import g55.cs3219.backend.questionservice.dto.QuestionDto;
import g55.cs3219.backend.questionservice.exception.InvalidQuestionException;
import g55.cs3219.backend.questionservice.exception.QuestionNotFoundException;
import g55.cs3219.backend.questionservice.model.DatabaseSequence;
import g55.cs3219.backend.questionservice.model.Question;
import g55.cs3219.backend.questionservice.repository.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoOperations;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTests {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private MongoOperations mongoOperations;

    @InjectMocks
    private QuestionService questionService;

    private Question question1;
    private Question question2;
    private Question question3;
    private QuestionDto questionDto1;
    private QuestionDto questionDto2;
    private QuestionDto questionDto3;

    @BeforeEach
    void setUp() {
        question1 = Question.builder()
            .id(1)
            .title("Question 1")
            .description("Description 1")
            .difficulty("Easy")
            .categories(Arrays.asList("Category1", "Category2"))
            .examples(Arrays.asList(new HashMap<>()))
            .constraints(Arrays.asList("Constraint1"))
            .link("http://example1.com")
            .build();

        question2 = Question.builder()
            .id(2)
            .title("Question 2")
            .description("Description 2")
            .difficulty("Medium")
            .categories(Arrays.asList("Category2", "Category3"))
            .examples(Arrays.asList(new HashMap<>()))
            .constraints(Arrays.asList("Constraint2"))
            .link("http://example2.com")
            .build();

        question3 = Question.builder()
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
    void getAllQuestions_QuestionsExist_ReturnsAllQuestions() {
        when(questionRepository.findAll()).thenReturn(Arrays.asList(question1, question2));

        List<QuestionDto> result = questionService.getAllQuestions();

        assertEquals(2, result.size());
        assertEquals("Question 1", result.get(0).getTitle());
        assertEquals("Question 2", result.get(1).getTitle());
    }

    @Test
    void getAllQuestions_NoQuestionsExist_ThrowsQuestionNotFoundException() {
        when(questionRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(QuestionNotFoundException.class, () -> questionService.getAllQuestions());
    }

    @Test
    void getQuestionById_QuestionExists_ReturnsQuestion() {
        when(questionRepository.findById(1)).thenReturn(Optional.of(question1));

        QuestionDto result = questionService.getQuestionById(1);

        assertEquals(1, result.getId());
        assertEquals("Question 1", result.getTitle());
    }

    @Test
    void getQuestionById_QuestionDoesNotExist_ThrowsQuestionNotFoundException() {
        when(questionRepository.findById(3)).thenReturn(Optional.empty());

        assertThrows(QuestionNotFoundException.class, () -> questionService.getQuestionById(3));
    }

    @Test
    void getQuestionsByFiltersWithCategory_QuestionsExist_ReturnsFilteredQuestions() {
        when(questionRepository.findByCategoriesContaining("Category1")).thenReturn(Collections.singletonList(question1));

        List<QuestionDto> result = questionService.getQuestionsByFilters("Category1", null);

        assertEquals(1, result.size());
        assertEquals("Question 1", result.get(0).getTitle());
    }

    @Test
    void getQuestionsByFiltersWithCategory_QuestionDoesNotExist_ThrowsQuestionNotFoundException() {
        when(questionRepository.findByCategoriesContaining("NonExistentCategory")).thenReturn(Collections.emptyList());

        assertThrows(QuestionNotFoundException.class, () -> questionService.getQuestionsByCategory("NonExistentCategory"));
    }

    @Test
    void getQuestionsByFiltersWithDifficulty_QuestionExists_ReturnsFilteredQuestions() {
        when(questionRepository.findByDifficulty("Medium")).thenReturn(Collections.singletonList(question2));

        List<QuestionDto> result = questionService.getQuestionsByFilters(null, "Medium");

        assertEquals(1, result.size());
        assertEquals("Question 2", result.get(0).getTitle());
    }

    @Test
    void createQuestion_ValidInput_CreatesAndReturnsQuestion() {
        when(mongoOperations.findAndModify(any(), any(), any(), eq(DatabaseSequence.class)))
                .thenReturn(new DatabaseSequence("question_sequence", 3L));
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> {
            Question savedQuestion = invocation.getArgument(0);
            savedQuestion.setId(3);
            return savedQuestion;
        });

        QuestionDto result = questionService.createQuestion(questionDto1);

        assertNotNull(result);
        assertEquals(3, result.getId());
        assertEquals("Question 1", result.getTitle());
    }

    @Test
    void createQuestion_InvalidInput_ThrowsInvalidQuestionException() {
        QuestionDto invalidDto = new QuestionDto();
        invalidDto.setTitle("Invalid Question");

        assertThrows(InvalidQuestionException.class, () -> questionService.createQuestion(invalidDto));
    }

    @Test
    void updateQuestionTitle_QuestionExists_UpdatesAndReturnsQuestion() {
        when(questionRepository.findById(1)).thenReturn(Optional.of(question1));
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuestionDto updateDto = new QuestionDto();
        updateDto.setTitle("Updated Title");

        QuestionDto result = questionService.updateQuestion(1, updateDto);

        assertEquals(1, result.getId());
        assertEquals("Updated Title", result.getTitle());
    }

    @Test
    void updateQuestionDescription_QuestionExists_UpdatesAndReturnsQuestion() {
        when(questionRepository.findById(1)).thenReturn(Optional.of(question1));
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuestionDto updateDto = new QuestionDto();
        updateDto.setDescription("Updated Description");

        QuestionDto result = questionService.updateQuestion(1, updateDto);

        assertEquals(1, result.getId());
        assertEquals("Updated Description", result.getDescription());
    }

    @Test
    void updateQuestionDifficulty_QuestionExists_UpdatesAndReturnsQuestion() {
        when(questionRepository.findById(1)).thenReturn(Optional.of(question1));
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuestionDto updateDto = new QuestionDto();
        updateDto.setDifficulty("Difficult");

        QuestionDto result = questionService.updateQuestion(1, updateDto);

        assertEquals(1, result.getId());
        assertEquals("Difficult", result.getDifficulty());
    }

    @Test
    void updateQuestionCategories_QuestionExists_UpdatesAndReturnsQuestion() {
        when(questionRepository.findById(1)).thenReturn(Optional.of(question1));
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuestionDto updateDto = new QuestionDto();
        updateDto.setCategories(List.of("Category5", "Category6"));

        QuestionDto result = questionService.updateQuestion(1, updateDto);

        assertEquals(1, result.getId());
        assertEquals(List.of("Category5", "Category6"), result.getCategories());
    }

    @Test
    void updateQuestionExamples_QuestionExists_UpdatesAndReturnsQuestion() {
        when(questionRepository.findById(1)).thenReturn(Optional.of(question1));
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuestionDto updateDto = new QuestionDto();
        updateDto.setExamples(List.of(new HashMap<>()));

        QuestionDto result = questionService.updateQuestion(1, updateDto);

        assertEquals(1, result.getId());
        assertEquals(List.of(new HashMap<>()), result.getExamples());
    }

    @Test
    void updateQuestionConstraints_QuestionExists_UpdatesAndReturnsQuestion() {
        when(questionRepository.findById(1)).thenReturn(Optional.of(question1));
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuestionDto updateDto = new QuestionDto();
        updateDto.setConstraints(List.of("New Constraint"));

        QuestionDto result = questionService.updateQuestion(1, updateDto);

        assertEquals(1, result.getId());
        assertEquals(List.of("New Constraint"), result.getConstraints());
    }

    @Test
    void updateQuestionLink_QuestionExists_UpdatesAndReturnsQuestion() {
        when(questionRepository.findById(1)).thenReturn(Optional.of(question1));
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuestionDto updateDto = new QuestionDto();
        updateDto.setLink("http://example123.com");

        QuestionDto result = questionService.updateQuestion(1, updateDto);

        assertEquals(1, result.getId());
        assertEquals("http://example123.com", result.getLink());
    }

    @Test
    void updateQuestion_QuestionDoesNotExist_ThrowsQuestionNotFoundException() {
        when(questionRepository.findById(99)).thenReturn(Optional.empty());

        QuestionDto updateDto = new QuestionDto();
        updateDto.setTitle("Updated Title");

        assertThrows(QuestionNotFoundException.class, () -> questionService.updateQuestion(99, updateDto));
    }

    @Test
    void updateQuestion_NonExistentQuestion_ThrowsException() {
        when(questionRepository.findById(99)).thenReturn(Optional.empty());
        QuestionDto updateDto = new QuestionDto();
        updateDto.setTitle("Updated Title");

        assertThrows(QuestionNotFoundException.class, () -> questionService.updateQuestion(99, updateDto));
    }

    @Test
    void deleteQuestion_QuestionExists_DeletesQuestion() {
        when(questionRepository.findById(1)).thenReturn(Optional.of(question1));

        String result = questionService.deleteQuestion(1);

        assertEquals("Question with ID 1 has been deleted.", result);
        verify(questionRepository, times(1)).delete(question1);
    }

    @Test
    void deleteQuestion_NullId_ThrowsInvalidQuestionException() {
        assertThrows(InvalidQuestionException.class, () -> questionService.deleteQuestion(null));
    }

    @Test
    void deleteQuestion_QuestionDoesNotExist_ThrowsQuestionNotFoundException() {
        when(questionRepository.findById(3)).thenReturn(Optional.empty());

        assertThrows(QuestionNotFoundException.class, () -> questionService.deleteQuestion(3));
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