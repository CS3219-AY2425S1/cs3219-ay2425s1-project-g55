package g55.cs3219.backend.historyservice.service;

import org.springframework.stereotype.Service;
import g55.cs3219.backend.historyservice.repository.HistoryRepository;
import g55.cs3219.backend.historyservice.model.History;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
@Service
public class HistoryService {

    @Autowired
    private HistoryRepository historyRepository;

    public History createHistory(History history) {
        return historyRepository.save(history);
    }
    
    public List<History> getHistoryByUserIdAndQuestionId(Long userId, Integer questionId) {
        return historyRepository.findByUserIdAndQuestionIdOrderByAttemptedAtDesc(userId, questionId);
    }
    
    public List<History> getHistoryByUserId(Long userId) {
        return historyRepository.findByUserIdOrderByAttemptedAtDesc(userId);
    }

    public History updateHistory(Integer id, History history) {
        return historyRepository.save(history);
    }

    public void deleteHistory(Integer id) {
        historyRepository.deleteById(id);
    }
}
