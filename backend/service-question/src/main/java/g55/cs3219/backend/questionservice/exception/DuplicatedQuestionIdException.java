package g55.cs3219.backend.questionservice.exception;

public class DuplicatedQuestionIdException extends RuntimeException{

    public DuplicatedQuestionIdException(String message) {
        super(message);
    }

}
