package g55.cs3219.backend.userService.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private Long id;
    private String token;
    private String email;
    private String username;
    private boolean isAdmin;

    public LoginResponse(Long id, String token, String email, String username, boolean isAdmin) {
        this.id = id;
        this.token = token;
        this.email = email;
        this.username = username;
        this.isAdmin = isAdmin;
    }
}
