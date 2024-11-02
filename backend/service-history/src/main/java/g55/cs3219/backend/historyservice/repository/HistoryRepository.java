package g55.cs3219.backend.historyservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import g55.cs3219.backend.historyservice.model.History;

import java.util.List;

@Repository
public interface HistoryRepository extends MongoRepository<History, Integer> {
    List<History> findByUserIdOrderByAttemptedAtDesc(String userId);
    List<History> findByUserIdAndQuestionIdOrderByAttemptedAtDesc(String userId, String questionId);
}
