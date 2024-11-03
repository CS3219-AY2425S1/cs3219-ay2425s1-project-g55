package g55.cs3219.backend.userService.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAdminResponse {

    private Long id;
    private String email;
    private String username;
    private boolean isAdmin;
    private String password;

    public UserAdminResponse(Long id, String email, String username, boolean isAdmin, String password) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.isAdmin = isAdmin;
        this.password = password;
    }
}
