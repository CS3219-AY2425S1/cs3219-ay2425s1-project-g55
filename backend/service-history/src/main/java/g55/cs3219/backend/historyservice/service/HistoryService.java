package g55.cs3219.backend.historyservice.service;

import org.springframework.stereotype.Service;
import g55.cs3219.backend.historyservice.repository.HistoryRepository;
import g55.cs3219.backend.historyservice.model.History;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
@Service
public class HistoryService {

    @Autowired
    private HistoryRepository historyRepository;

    public List<History> getHistoryByUserId(String userId) {
        return historyRepository.findByUserIdOrderByAttemptDateTimeDesc(userId);
    }

    public void saveHistory(History history) {
        historyRepository.save(history);
    }

    public void deleteHistory(String id) {
        historyRepository.deleteById(id);
    }

    public Optional<History> getHistoryByUserIdAndQuestionId(String userId, String questionId) {
        return historyRepository.findByUserIdAndQuestionId(userId, questionId);
    }
}
