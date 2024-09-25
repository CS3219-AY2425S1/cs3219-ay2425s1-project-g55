package g55.cs3219.backend.questionservice.controller;

import g55.cs3219.backend.questionservice.model.Question;
import g55.cs3219.backend.questionservice.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @GetMapping("/{id}")
    public Question getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id);
    }

    @GetMapping("/difficulty/{difficulty}")
    public List<Question> getQuestionsByDifficulty(@PathVariable String difficulty) {
        return questionService.getQuestionsByDifficulty(difficulty);
    }

    @PostMapping
    public ResponseEntity<Question> addQuestion(@RequestBody Question question) {
        Question addedQuestion = questionService.addQuestion(question);
        return ResponseEntity.ok(addedQuestion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateQuestion(@PathVariable Long id, @RequestBody Question updatedQuestion) {
        if (!id.equals(updatedQuestion.getId())) {
            return ResponseEntity.badRequest().body("The ID in the path does not match the ID in the request body.");
        }

        try {
            Question question = questionService.updateQuestion(id, updatedQuestion);
            return ResponseEntity.ok("Question updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
