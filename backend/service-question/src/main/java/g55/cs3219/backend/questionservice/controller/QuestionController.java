package g55.cs3219.backend.questionservice.controller;

import g55.cs3219.backend.questionservice.dto.QuestionDto;
import g55.cs3219.backend.questionservice.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
        origins = {
                "http://localhost:8080",
                "https://staging.example.com",
                "https://app.example.com"
        },
        methods = {
                RequestMethod.OPTIONS,
                RequestMethod.GET,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.POST
        })
@RestController
@RequestMapping("/api/question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping("/questions")
    public List<QuestionDto> getAllQuestions() {
       return questionService.getAllQuestions();
    }

    @GetMapping("/{id}")
    public QuestionDto getQuestionById(@PathVariable Integer id) {
        return questionService.getQuestionById(id);
    }

    @GetMapping("/filter")
    public List<QuestionDto> getQuestionsByFilters(
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "difficulty", required = false) String difficulty
    ) {
        return questionService.getQuestionsByFilters(category, difficulty);
    }

    @PostMapping()
    public QuestionDto createQuestion(@RequestBody QuestionDto question) {
        return questionService.createQuestion(question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionDto> updateQuestion(@PathVariable Integer id, @RequestBody QuestionDto updatedQuestionDto) {
        QuestionDto question = questionService.updateQuestion(id, updatedQuestionDto);
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String > deleteQuestion(@PathVariable Integer id) {
        String message = questionService.deleteQuestion(id);
        return ResponseEntity.ok(message);
    }

}
