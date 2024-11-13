package g55.cs3219.backend.roomservice.exception;

public class RoomNotFoundException extends RuntimeException {
    public RoomNotFoundException(String message) {
        super(message);
    }

    public RoomNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public RoomNotFoundException(String roomId, String message) {
        super("Room " + roomId + " not found: " + message);
    }
} 