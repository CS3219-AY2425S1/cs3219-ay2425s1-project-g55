package g55.cs3219.backend.userService.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private Long id;
    private String email;
    private String username;
    private boolean isAdmin;

    public UserResponse(Long id, String email, String username, boolean isAdmin) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.isAdmin = isAdmin;
    }
}
