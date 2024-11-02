package g55.cs3219.backend.roomservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import g55.cs3219.backend.roomservice.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
} 