package g55.cs3219.backend.questionservice.service;

import static org.springframework.data.mongodb.core.query.Query.query;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;

import g55.cs3219.backend.questionservice.dto.QuestionDto;
import g55.cs3219.backend.questionservice.exception.InvalidQuestionException;
import g55.cs3219.backend.questionservice.exception.QuestionNotFoundException;
import g55.cs3219.backend.questionservice.model.DatabaseSequence;
import g55.cs3219.backend.questionservice.model.Question;
import g55.cs3219.backend.questionservice.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private MongoOperations mongoOperations;

    public List<QuestionDto> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        if (questions.isEmpty()) {
            throw new QuestionNotFoundException("No questions found.");
        }
        questions.sort((q1, q2) -> (int) (q1.getId() - q2.getId()));
        return questions.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public QuestionDto getQuestionById(Integer id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException("Question with ID " + id + " not found."));

        return convertToDTO(question);
    }

    public List<QuestionDto> getQuestionsByFilters(String category, String difficulty) {
        if (category != null && difficulty != null) {
            throw new InvalidQuestionException("Cannot filter by both category and difficulty.");
        } else if (category != null) {
            return getQuestionsByCategory(category);
        } else if (difficulty != null) {
            return getQuestionsByDifficulty(difficulty);
        } else {
            throw new InvalidQuestionException("At least one filter is required.");
        }
    }

    public List<QuestionDto> getQuestionsByDifficulty(String difficulty) {
        List<Question> questions = questionRepository.findByDifficulty(difficulty);
        if (questions.isEmpty()) {
            throw new QuestionNotFoundException("No questions found with difficulty: " + difficulty);
        }
        return questions.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<QuestionDto> getQuestionsByCategory(String category) {
        List<Question> questions = questionRepository.findByCategoriesContaining(category);
        if (questions.isEmpty()) {
            throw new QuestionNotFoundException("No questions found with category: " + category);
        }
        return questions.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public QuestionDto createQuestion(QuestionDto questionDto) {
        validateQuestion(questionDto);

        Question newQuestion = convertToDocument(questionDto);
        newQuestion.setId(generateSequence(Question.SEQUENCE_NAME));

        Question createdQuestion = questionRepository.save(newQuestion);

        return convertToDTO(createdQuestion);
    }

    private void validateQuestion(QuestionDto question) {
        List<String> missingFields = Stream.of(
                question.getTitle() == null ? "title" : null,
                question.getDescription() == null ? "description" : null,
                question.getCategories() == null ? "categories" : null,
                question.getDifficulty() == null ? "difficulty" : null,
                question.getExamples() == null ? "examples" : null,
                question.getConstraints() == null ? "constraints" : null,
                question.getLink() == null ? "link" : null
        ).filter(Objects::nonNull).collect(Collectors.toList());

        if (!missingFields.isEmpty()) {
            throw new InvalidQuestionException("Missing required fields: " + String.join(", ", missingFields));
        }
    }

    public QuestionDto updateQuestion(Integer id, QuestionDto updatedQuestionDto) {
        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException("Question with ID " + id + " not found."));

        if (updatedQuestionDto.getTitle() != null) {
            existingQuestion.setTitle(updatedQuestionDto.getTitle());
        }
        if (updatedQuestionDto.getDescription() != null) {
            existingQuestion.setDescription(updatedQuestionDto.getDescription());
        }
        if (updatedQuestionDto.getDifficulty() != null) {
            existingQuestion.setDifficulty(updatedQuestionDto.getDifficulty());
        }
        if (updatedQuestionDto.getCategories() != null) {
            existingQuestion.setCategories(updatedQuestionDto.getCategories());
        }
        if (updatedQuestionDto.getExamples() != null) {
            existingQuestion.setExamples(updatedQuestionDto.getExamples());
        }
        if (updatedQuestionDto.getConstraints() != null) {
            existingQuestion.setConstraints(updatedQuestionDto.getConstraints());
        }
        if (updatedQuestionDto.getLink() != null) {
            existingQuestion.setLink(updatedQuestionDto.getLink());
        }

        Question updatedQuestion = questionRepository.save(existingQuestion);

        return convertToDTO(updatedQuestion);
    }

    public String deleteQuestion(Integer id) {
        if (id == null) {
            throw new InvalidQuestionException("Question ID is required for deletion.");
        }

        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException("Question with ID " + id + " not found."));

        questionRepository.delete(existingQuestion);

        return "Question with ID " + id + " has been deleted.";
    }

    public int generateSequence(String seqName) {
        DatabaseSequence counter = mongoOperations.findAndModify(query(where("_id").is(seqName)),
                new Update().inc("seq",1), options().returnNew(true).upsert(true),
                DatabaseSequence.class);
        return !Objects.isNull(counter) ? (int) counter.getSeq() : 1;
    }

    private QuestionDto convertToDTO(Question question) {

        QuestionDto questionDto = new QuestionDto();
        questionDto.setId(question.getId());
        questionDto.setTitle(question.getTitle());
        questionDto.setDescription(question.getDescription());
        questionDto.setDifficulty(question.getDifficulty());
        questionDto.setCategories(question.getCategories());
        questionDto.setExamples(question.getExamples());
        questionDto.setConstraints(question.getConstraints());
        questionDto.setLink(question.getLink());

        return questionDto;
    }

    private Question convertToDocument(QuestionDto questionDto) {

        Question question = new Question();
        question.setTitle(questionDto.getTitle());
        question.setDescription(questionDto.getDescription());
        question.setDifficulty(questionDto.getDifficulty());
        question.setCategories(questionDto.getCategories());
        question.setExamples(questionDto.getExamples());
        question.setConstraints(questionDto.getConstraints());
        question.setLink(questionDto.getLink());

        return question;
    }

}