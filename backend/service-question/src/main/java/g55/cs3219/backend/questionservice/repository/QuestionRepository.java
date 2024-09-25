package g55.cs3219.backend.questionservice.repository;

import g55.cs3219.backend.questionservice.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    Question getQuestionById(Long id);
    List<Question> findAll();
    List<Question> findByDifficulty(String difficulty);
}
