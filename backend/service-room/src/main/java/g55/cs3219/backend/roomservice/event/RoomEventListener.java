package g55.cs3219.backend.roomservice.event;

/**
 * Interface for listening to room events.
 */
public interface RoomEventListener {
    void onRoomClosed(String roomId, String userWhoClosedRoomId);
} 