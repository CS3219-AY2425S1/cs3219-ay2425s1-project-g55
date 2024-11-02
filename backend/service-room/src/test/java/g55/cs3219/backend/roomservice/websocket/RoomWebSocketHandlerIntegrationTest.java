package g55.cs3219.backend.roomservice.websocket;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.net.URI;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.parallel.Execution;
import org.junit.jupiter.api.parallel.ExecutionMode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import g55.cs3219.backend.roomservice.model.ParticipantMessage;
import g55.cs3219.backend.roomservice.model.Room;
import g55.cs3219.backend.roomservice.service.RoomService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
    "spring.profiles.active=test",
    "spring.test.execute=true"
})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Execution(ExecutionMode.SAME_THREAD)
public class RoomWebSocketHandlerIntegrationTest {

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private RoomService roomService;

  private StandardWebSocketClient client;
  private final String ROOM_ID = "test-room";
  private final String USER_ID = "test-user";
  private List<WebSocketSession> activeSessions;

  @LocalServerPort
  private int port;

  private URI getWsUri() {
    return URI.create("ws://localhost:" + port + "/ws/rooms/" + ROOM_ID);
  }

  private final Integer QUESTION_ID = 1;

  @BeforeEach
  void setup() {
    this.client = new StandardWebSocketClient();
    this.activeSessions = new ArrayList<>();

    // Mock room service behavior
    Room mockRoom = new Room(
        ROOM_ID,
        Instant.now().plus(1, ChronoUnit.HOURS),
        List.of(USER_ID),
        QUESTION_ID,
        false);

    when(roomService.checkIfUserCanJoinRoom(anyString(), anyString())).thenReturn(true);
    when(roomService.getRoom(ROOM_ID)).thenReturn(mockRoom);
  }

  @AfterEach
  void tearDown() throws IOException {
    for (WebSocketSession session : activeSessions) {
      if (session.isOpen()) {
        session.close();
      }
    }
    activeSessions.clear();
  }

  @Test
  void whenUserConnects_thenReceivesParticipantMessage() throws Exception {
    BlockingQueue<ParticipantMessage> messages = new LinkedBlockingQueue<>();
    WebSocketHttpHeaders headers = new WebSocketHttpHeaders();
    headers.add("X-User-Id", USER_ID);

    WebSocketSession session = connectWebSocket(headers, messages);

    // Wait for and verify the response
    ParticipantMessage receivedMessage = messages.poll(5, TimeUnit.SECONDS);
    assertThat(receivedMessage).isNotNull();
    assertThat(receivedMessage.getUserId()).isEqualTo(USER_ID);
    assertThat(receivedMessage.getActiveParticipants()).contains(USER_ID);

    session.close();
  }

  @Test
  void whenMultipleUsersConnect_thenAllReceiveMessages() throws Exception {
    String secondUserId = "test-user-2";
    Room mockRoom = new Room(
        ROOM_ID,
        Instant.now().plus(1, ChronoUnit.HOURS),
        List.of(USER_ID, secondUserId),
        QUESTION_ID,
        false);
    when(roomService.getRoom(ROOM_ID)).thenReturn(mockRoom);

    BlockingQueue<ParticipantMessage> messagesUser1 = new LinkedBlockingQueue<>();
    BlockingQueue<ParticipantMessage> messagesUser2 = new LinkedBlockingQueue<>();

    // Connect first user
    WebSocketHttpHeaders headers1 = new WebSocketHttpHeaders();
    headers1.add("X-User-Id", USER_ID);
    WebSocketSession session1 = connectWebSocket(headers1, messagesUser1);

    // Connect second user
    WebSocketHttpHeaders headers2 = new WebSocketHttpHeaders();
    headers2.add("X-User-Id", secondUserId);
    WebSocketSession session2 = connectWebSocket(headers2, messagesUser2);

    // Verify both users receive the message
    ParticipantMessage message1 = messagesUser1.poll(5, TimeUnit.SECONDS);
    ParticipantMessage message2 = messagesUser2.poll(5, TimeUnit.SECONDS);

    assertThat(message1).isNotNull();
    assertThat(message2).isNotNull();
    assertThat(message2.getActiveParticipants()).containsExactlyInAnyOrder(USER_ID, secondUserId);
    assertThat(message1.getType()).isEqualTo("ENTERED_ROOM");
    assertThat(message2.getType()).isEqualTo("ENTERED_ROOM");

    session1.close();
    session2.close();
  }

  @Test
  void whenUserConnectsTwice_thenFirstConnectionDisconnectsAndOthersGetReconnectMessage() throws Exception {
    Room mockRoom = new Room(
        ROOM_ID,
        Instant.now().plus(1, ChronoUnit.HOURS),
        List.of(USER_ID, "other-user"),
        QUESTION_ID,
        false);
    when(roomService.getRoom(ROOM_ID)).thenReturn(mockRoom);

    BlockingQueue<ParticipantMessage> messagesFirstConnection = new LinkedBlockingQueue<>();
    BlockingQueue<ParticipantMessage> messagesSecondConnection = new LinkedBlockingQueue<>();
    BlockingQueue<ParticipantMessage> messagesOtherUser = new LinkedBlockingQueue<>();

    // Connect first session for user
    WebSocketHttpHeaders headers1 = new WebSocketHttpHeaders();
    headers1.add("X-User-Id", USER_ID);
    WebSocketSession firstSession = connectWebSocket(headers1, messagesFirstConnection);
    ParticipantMessage initialMessage1 = messagesFirstConnection.poll(5, TimeUnit.SECONDS);
    assertThat(initialMessage1.getActiveParticipants()).containsExactlyInAnyOrder(USER_ID);
    assertThat(initialMessage1.getType()).isEqualTo("ENTERED_ROOM");

    // Connect other user
    WebSocketHttpHeaders headers2 = new WebSocketHttpHeaders();
    headers2.add("X-User-Id", "other-user");
    WebSocketSession otherSession = connectWebSocket(headers2, messagesOtherUser);
    ParticipantMessage initialMessage2 = messagesOtherUser.poll(5, TimeUnit.SECONDS);
    assertThat(initialMessage2.getActiveParticipants()).containsExactlyInAnyOrder(USER_ID, "other-user");
    assertThat(initialMessage2.getType()).isEqualTo("ENTERED_ROOM");

    // Connect second session for same user
    messagesFirstConnection.clear();
    messagesOtherUser.clear();
    WebSocketSession secondSession = connectWebSocket(headers1, messagesSecondConnection);

    // Verify that first session is disconnected
    ParticipantMessage messageOnFirstConnection = messagesFirstConnection.poll(2, TimeUnit.SECONDS);
    assertThat(messageOnFirstConnection).isNull();

    // Verify other user gets reconnection message
    ParticipantMessage reconnectMessage = messagesOtherUser.poll(5, TimeUnit.SECONDS);
    assertThat(reconnectMessage).isNotNull();
    assertThat(reconnectMessage.getType()).isEqualTo("RECONNECTED");
    assertThat(reconnectMessage.getActiveParticipants()).containsExactlyInAnyOrder(USER_ID, "other-user");

    // Cleanup
    secondSession.close();
    otherSession.close();
  }

  @Test
  void whenUserLeaves_thenOtherUserReceivesExitRoomMessage() throws Exception {
    Room mockRoom = new Room(
        ROOM_ID,
        Instant.now().plus(1, ChronoUnit.HOURS),
        List.of(USER_ID, "other-user"),
        QUESTION_ID,
        false);
    when(roomService.getRoom(ROOM_ID)).thenReturn(mockRoom);

    BlockingQueue<ParticipantMessage> messagesUser = new LinkedBlockingQueue<>();
    BlockingQueue<ParticipantMessage> messagesOtherUser = new LinkedBlockingQueue<>();

    // Connect first user
    WebSocketHttpHeaders headers1 = new WebSocketHttpHeaders();
    headers1.add("X-User-Id", USER_ID);
    WebSocketSession userSession = connectWebSocket(headers1, messagesUser);
    ParticipantMessage initialMessage1 = messagesUser.poll(5, TimeUnit.SECONDS);
    assertThat(initialMessage1.getActiveParticipants()).containsExactlyInAnyOrder(USER_ID);
    assertThat(initialMessage1.getType()).isEqualTo("ENTERED_ROOM");

    // Connect second user
    WebSocketHttpHeaders headers2 = new WebSocketHttpHeaders();
    headers2.add("X-User-Id", "other-user");
    WebSocketSession otherSession = connectWebSocket(headers2, messagesOtherUser);
    ParticipantMessage initialMessage2 = messagesOtherUser.poll(5, TimeUnit.SECONDS);
    assertThat(initialMessage2.getActiveParticipants()).containsExactlyInAnyOrder(USER_ID, "other-user");
    assertThat(initialMessage2.getType()).isEqualTo("ENTERED_ROOM");

    // First user leaves
    messagesOtherUser.clear();
    userSession.close();

    // Verify other user gets exit room message
    ParticipantMessage exitMessage = messagesOtherUser.poll(5, TimeUnit.SECONDS);
    assertThat(exitMessage).isNotNull();
    assertThat(exitMessage.getType()).isEqualTo("EXIT_ROOM");
    assertThat(exitMessage.getUserId()).isEqualTo(USER_ID);
    assertThat(exitMessage.getActiveParticipants()).containsExactly("other-user");

    // Cleanup
    otherSession.close();
  }

  /**
   * Helper method to connect to the WebSocket and return the session.
   */
  private WebSocketSession connectWebSocket(WebSocketHttpHeaders headers, BlockingQueue<ParticipantMessage> messages)
      throws Exception {
    WebSocketSession session = client.execute(
        new TestWebSocketHandler(messages),
        headers,
        getWsUri()).get(1, TimeUnit.SECONDS);
    activeSessions.add(session);
    return session;
  }

  private class TestWebSocketHandler extends TextWebSocketHandler {
    private final BlockingQueue<ParticipantMessage> messages;

    public TestWebSocketHandler(BlockingQueue<ParticipantMessage> messages) {
      this.messages = messages;
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
      ParticipantMessage participantMessage = objectMapper.readValue(message.getPayload(), ParticipantMessage.class);
      messages.add(participantMessage);
    }
  }

}