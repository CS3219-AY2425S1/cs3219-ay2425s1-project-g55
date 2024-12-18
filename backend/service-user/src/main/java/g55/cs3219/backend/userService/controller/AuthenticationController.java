package g55.cs3219.backend.userService.controller;

import g55.cs3219.backend.userService.dto.ChangePasswordDto;
import g55.cs3219.backend.userService.dto.ForgetPasswordDto;
import g55.cs3219.backend.userService.dto.LoginUserDto;
import g55.cs3219.backend.userService.dto.RegisterUserDto;
import g55.cs3219.backend.userService.dto.ResetPasswordDto;
import g55.cs3219.backend.userService.responses.JwtTokenValidationResponse;
import g55.cs3219.backend.userService.responses.UserResponse;
import g55.cs3219.backend.userService.dto.VerifyUserDto;
import g55.cs3219.backend.userService.model.User;
import g55.cs3219.backend.userService.responses.LoginResponse;
import g55.cs3219.backend.userService.service.AuthenticationService;
import g55.cs3219.backend.userService.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

// https://youtu.be/uZGuwX3St_c?si=hQ2vppx_ACMhrS7u
@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.userDetailsService = userDetailsService;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        return ResponseEntity.badRequest().body(errors);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginUserDto loginUserDto) {
        try {
            User authenticatedUser = authenticationService.authenticate(loginUserDto);
            String jwtToken = jwtService.generateToken(authenticatedUser);
            LoginResponse loginResponse = new LoginResponse(authenticatedUser.getId(), jwtToken,
                    authenticatedUser.getEmail(), authenticatedUser.getName(), authenticatedUser.isAdmin());
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        try {
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("Account is verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code sent.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/verify-token")
    public ResponseEntity<?> verifyToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
        }

        try {
            User currentUser = (User) authentication.getPrincipal();

            HttpHeaders headers = new HttpHeaders();
            headers.add("X-User-Id", String.valueOf(currentUser.getId()));
            headers.add("X-User-Email", currentUser.getEmail());
            headers.add("X-User-Name", currentUser.getName());
            headers.add("X-User-Is-Admin", String.valueOf(currentUser.isAdmin()));

            UserResponse response = new UserResponse(currentUser.getId(), currentUser.getEmail(),
                    currentUser.getName(), currentUser.isAdmin());
            return ResponseEntity.ok().headers(headers).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while verifying the token.");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgetPasswordDto forgotPasswordDto) {
        try {
            authenticationService.initiatePasswordReset(forgotPasswordDto.getEmail());
            return ResponseEntity.ok("Password reset email sent successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        try {
            authenticationService.resetPassword(resetPasswordDto.getEmail(), resetPasswordDto.getResetCode(),
                    resetPasswordDto.getNewPassword());
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDto changePasswordDto,
                                         Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }

        try {
            User currentUser = (User) authentication.getPrincipal();
            authenticationService.changePassword(currentUser, changePasswordDto.getOldPassword(), changePasswordDto.getNewPassword());
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Incorrect old password.")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect old password.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/check-headers")
    public ResponseEntity<String> checkHeaders(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Name", required = false) String userName,
            @RequestHeader(value = "X-User-Is-Admin", required = false) String isAdmin) {

        StringBuilder responseMessage = new StringBuilder();

        if (userId != null) {
            responseMessage.append("X-User-ID: ").append(userId).append("\n");
        } else {
            responseMessage.append("X-User-ID header is missing.\n");
        }

        if (userEmail != null) {
            responseMessage.append("X-User-Email: ").append(userEmail).append("\n");
        } else {
            responseMessage.append("X-User-Email header is missing.\n");
        }

        if (userName != null) {
            responseMessage.append("X-User-Name: ").append(userName).append("\n");
        } else {
            responseMessage.append("X-User-Name header is missing.\n");
        }

        if (isAdmin != null) {
            responseMessage.append("X-User-Is-Admin: ").append(isAdmin).append("\n");
        } else {
            responseMessage.append("X-User-Is-Admin header is missing.\n");
        }

        return ResponseEntity.ok(responseMessage.toString());
    }
}
