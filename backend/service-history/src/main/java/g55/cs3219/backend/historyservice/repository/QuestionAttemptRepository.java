package g55.cs3219.backend.historyservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import g55.cs3219.backend.historyservice.model.QuestionAttempt;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionAttemptRepository extends MongoRepository<QuestionAttempt, String> {
    List<QuestionAttempt> findByUserIdOrderByAttemptDateTimeDesc(String userId);
    Optional<QuestionAttempt> findByUserIdAndQuestionId(String userId, String questionId);
}
