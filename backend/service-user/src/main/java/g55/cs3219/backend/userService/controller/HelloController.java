package g55.cs3219.backend.userService.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("")
    public String sayHello() {
        return "Hello World!";
    }
}
