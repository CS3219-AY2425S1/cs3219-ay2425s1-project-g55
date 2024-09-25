package g55.cs3219.backend.questionservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QuestionController {

    @GetMapping("")
    public String sayHello() {
        return "Hello World!";
    }
}
