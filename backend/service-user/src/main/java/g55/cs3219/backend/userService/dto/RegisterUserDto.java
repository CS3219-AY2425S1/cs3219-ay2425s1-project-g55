package g55.cs3219.backend.userService.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserDto {

    // https://www.youtube.com/watch?v=GQgj2uScaqM
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private  String email;
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$", message = "Password" +
            " must contain at least one uppercase letter, one lowercase letter, one digit, and one special character")
    private String password;
    @NotBlank(message = "Username is required")
    private String username;
}
