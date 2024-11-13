package g55.cs3219.backend.userService.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtTokenValidationResponse {
    private boolean isValid;
    private String message;

    public JwtTokenValidationResponse(boolean isValid, String message) {
        this.isValid = isValid;
        this.message = message;
    }
}
