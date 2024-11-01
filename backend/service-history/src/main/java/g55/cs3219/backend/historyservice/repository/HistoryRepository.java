package g55.cs3219.backend.historyservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import g55.cs3219.backend.historyservice.model.History;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoryRepository extends MongoRepository<History, String> {
    List<History> findByUserIdOrderByAttemptDateTimeDesc(String userId);
    Optional<History> findByUserIdAndQuestionId(String userId, String questionId);
}
