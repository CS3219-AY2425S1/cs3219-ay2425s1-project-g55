package g55.cs3219.backend.historyservice.service;

import org.springframework.stereotype.Service;
import g55.cs3219.backend.historyservice.repository.HistoryRepository;
import g55.cs3219.backend.historyservice.model.History;
import g55.cs3219.backend.historyservice.model.DatabaseSequence;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;
import org.springframework.data.mongodb.core.query.Update;

@Service
public class HistoryService {

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private MongoOperations mongoOperations;

    public History createHistory(History history) {
        history.setId(generateSequence(History.SEQUENCE_NAME));
        return historyRepository.save(history);
    }
    
    public int generateSequence(String seqName) {
        DatabaseSequence counter = mongoOperations.findAndModify(
            query(where("_id").is(seqName)),
            new Update().inc("seq", 1), 
            options().returnNew(true).upsert(true),
            DatabaseSequence.class);
        return !Objects.isNull(counter) ? (int) counter.getSeq() : 1;
    }
    
    public List<History> getHistoryByUserIdAndQuestionId(Integer userId, Integer questionId) {
        return historyRepository.findByUserIdAndQuestionIdOrderByAttemptedAtDesc(userId, questionId);
    }
    
    public List<History> getHistoryByUserId(Integer userId) {
        return historyRepository.findByUserIdOrderByAttemptedAtDesc(userId);
    }

    public History updateHistory(Integer id, History history) {
        return historyRepository.save(history);
    }

    public void deleteHistory(Integer id) {
        historyRepository.deleteById(id);
    }
}
