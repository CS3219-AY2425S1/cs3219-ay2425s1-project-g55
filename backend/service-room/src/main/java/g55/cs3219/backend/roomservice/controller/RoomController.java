package g55.cs3219.backend.roomservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import g55.cs3219.backend.roomservice.exception.RoomNotFoundException;
import g55.cs3219.backend.roomservice.model.RoomDTO;
import g55.cs3219.backend.roomservice.service.RoomService;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDTO> getRoom(@PathVariable String roomId) {
        try {
            return ResponseEntity.ok(RoomDTO.fromRoom(roomService.getRoom(roomId)));
        } catch (RoomNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{roomId}/close")
    public ResponseEntity<Void> closeRoom(@PathVariable String roomId,
            @RequestHeader("X-User-Id") String userWhoClosedRoomId) {
        roomService.closeRoom(roomId, userWhoClosedRoomId);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<String> handleRoomNotFoundException(RoomNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.internalServerError().body(ex.getMessage());
    }
}
