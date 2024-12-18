package g55.cs3219.backend.questionservice.repository;

import g55.cs3219.backend.questionservice.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, Integer> {

    List<Question> findAll();
    List<Question> findByCategoriesContaining(String category);
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByCategoriesContainingAndDifficulty(String category, String difficulty);

    @Query(value = "{}", fields = "{ 'categories' : 1 }")
    List<Question> findDistinctCategories();
    List<Question> findByTitle(String title);
    List<Question> findByTitleIgnoreCase(String title);
}
