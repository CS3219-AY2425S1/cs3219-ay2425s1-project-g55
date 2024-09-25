package g55.cs3219.backend.questionservice.service;

import g55.cs3219.backend.questionservice.model.Question;
import g55.cs3219.backend.questionservice.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository helloRepository;

    public List<Question> getAllUsers() {
        return helloRepository.findAll();
    }

    public Question saveUser(Question user) {
        return helloRepository.save(user);
    }
}
