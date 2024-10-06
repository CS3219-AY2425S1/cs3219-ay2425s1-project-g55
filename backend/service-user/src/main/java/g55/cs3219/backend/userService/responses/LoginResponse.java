package g55.cs3219.backend.userService.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private Long id;
    private String token;
    private Long expiresIn;

    public LoginResponse(Long id, String token, Long expiresIn) {
        this.id = id;
        this.token = token;
        this.expiresIn = expiresIn;
    }
}
