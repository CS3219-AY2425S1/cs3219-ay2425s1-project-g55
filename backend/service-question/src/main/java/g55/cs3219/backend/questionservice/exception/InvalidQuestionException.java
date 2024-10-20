package g55.cs3219.backend.questionservice.exception;

public class InvalidQuestionException extends RuntimeException {

    public InvalidQuestionException(String message) {
        super(message);
    }

}