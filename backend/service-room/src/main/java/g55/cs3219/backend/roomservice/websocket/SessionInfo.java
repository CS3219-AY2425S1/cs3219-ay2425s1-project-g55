package g55.cs3219.backend.roomservice.websocket;

import org.springframework.web.socket.WebSocketSession;
import lombok.Getter;
import lombok.AllArgsConstructor;

@Getter
@AllArgsConstructor
public class SessionInfo {
    private final WebSocketSession session;
    private final String userId;

    public String getSessionId() {
        return session.getId();
    }

    public boolean isOpen() {
        return session.isOpen();
    }
} 