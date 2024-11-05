package g55.cs3219.backend.userService.controller;

import g55.cs3219.backend.userService.dto.ChangePasswordDto;
import g55.cs3219.backend.userService.dto.ForgetPasswordDto;
import g55.cs3219.backend.userService.dto.LoginUserDto;
import g55.cs3219.backend.userService.dto.ResetPasswordDto;
import g55.cs3219.backend.userService.dto.VerifyUserDto;
import g55.cs3219.backend.userService.model.User;
import g55.cs3219.backend.userService.responses.JwtTokenValidationResponse;
import g55.cs3219.backend.userService.responses.LoginResponse;
import g55.cs3219.backend.userService.responses.UserResponse;
import g55.cs3219.backend.userService.service.AuthenticationService;
import g55.cs3219.backend.userService.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


class AuthenticationControllerTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthenticationController authenticationController;

    private User mockUser;
    private LoginUserDto loginUserDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockUser = new User("user123", "user@example.com", "password");
        mockUser.setId(1L);
        loginUserDto = new LoginUserDto();
        loginUserDto.setEmail("user@example.com");
        loginUserDto.setPassword("password");
    }

    @Test
    void authenticate_shouldReturnLoginResponse_whenCredentialsAreCorrect() {
        String token = "jwt-token";
        when(authenticationService.authenticate(loginUserDto)).thenReturn(mockUser);
        when(jwtService.generateToken(mockUser)).thenReturn(token);
        when(jwtService.getExpirationTime()).thenReturn(3600000L);

        ResponseEntity<?> response = authenticationController.authenticate(loginUserDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        LoginResponse loginResponse = (LoginResponse) response.getBody();
        assertNotNull(loginResponse);
        assertEquals(mockUser.getId(), loginResponse.getId());
        assertEquals(token, loginResponse.getToken());
        assertEquals(mockUser.getEmail(), loginResponse.getEmail());
        assertEquals(mockUser.getName(), loginResponse.getUsername());
        assertEquals(mockUser.isAdmin(), loginResponse.isAdmin());
        verify(authenticationService, times(1)).authenticate(loginUserDto);
    }

    @Test
    void authenticate_shouldReturnBadRequest_whenCredentialsAreInvalid() {
        when(authenticationService.authenticate(any(LoginUserDto.class))).thenThrow(new RuntimeException("Invalid credentials"));

        ResponseEntity<?> response = authenticationController.authenticate(loginUserDto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid credentials", response.getBody());
        verify(authenticationService, times(1)).authenticate(loginUserDto);
    }

    @Test
    void verifyUser_shouldReturnOk_whenVerificationIsSuccessful() {
        VerifyUserDto verifyUserDto = new VerifyUserDto();
        verifyUserDto.setEmail("user@example.com");
        verifyUserDto.setVerificationCode("verificationCode");

        ResponseEntity<?> response = authenticationController.verifyUser(verifyUserDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Account is verified successfully", response.getBody());
        verify(authenticationService, times(1)).verifyUser(verifyUserDto);
    }

    @Test
    void verifyUser_shouldReturnBadRequest_whenVerificationFails() {
        VerifyUserDto verifyUserDto = new VerifyUserDto();
        verifyUserDto.setEmail("user@example.com");
        verifyUserDto.setVerificationCode("wrongCode");
        doThrow(new RuntimeException("Invalid verification code")).when(authenticationService).verifyUser(any(VerifyUserDto.class));

        ResponseEntity<?> response = authenticationController.verifyUser(verifyUserDto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid verification code", response.getBody());
        verify(authenticationService, times(1)).verifyUser(verifyUserDto);
    }

    @Test
    void resendVerificationCode_shouldReturnOk_whenEmailIsValid() {
        ResponseEntity<?> response = authenticationController.resendVerificationCode("user@example.com");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Verification code sent.", response.getBody());
        verify(authenticationService, times(1)).resendVerificationCode("user@example.com");
    }

    @Test
    void resendVerificationCode_shouldReturnBadRequest_whenEmailIsInvalid() {
        doThrow(new RuntimeException("User not found")).when(authenticationService).resendVerificationCode(anyString());

        ResponseEntity<?> response = authenticationController.resendVerificationCode("invalid@example.com");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User not found", response.getBody());
        verify(authenticationService, times(1)).resendVerificationCode("invalid@example.com");
    }

    @Test
    void verifyToken_shouldReturnUserResponse_whenTokenIsValid() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);

        ResponseEntity<?> response = authenticationController.verifyToken(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        UserResponse userResponse = (UserResponse) response.getBody();
        assertNotNull(userResponse);
        assertEquals(mockUser.getId(), userResponse.getId());
        assertEquals(mockUser.getEmail(), userResponse.getEmail());
        assertEquals(mockUser.isAdmin(), userResponse.isAdmin());
        assertEquals(mockUser.getName(), userResponse.getUsername());
    }

    @Test
    void verifyToken_shouldReturnUnauthorized_whenTokenIsInvalid() {
        when(authentication.isAuthenticated()).thenReturn(false);

        ResponseEntity<?> response = authenticationController.verifyToken(authentication);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid or missing token", response.getBody());
    }

    @Test
    void verifyToken_shouldReturnInternalServerError_whenExceptionOccurs() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenThrow(new RuntimeException("Unexpected error"));

        ResponseEntity<?> response = authenticationController.verifyToken(authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An error occurred while verifying the token.", response.getBody());
    }

    @Test
    void handleValidationExceptions_shouldReturnBadRequest_whenValidationFails() {
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        when(exception.getBindingResult()).thenReturn(mock(BindingResult.class));
        BindingResult bindingResult = exception.getBindingResult();

        when(bindingResult.getFieldErrors()).thenReturn(Arrays.asList(
                new FieldError("loginUserDto", "email", "must not be blank"),
                new FieldError("loginUserDto", "password", "must not be blank")
        ));

        ResponseEntity<?> response = authenticationController.handleValidationExceptions(exception);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        List<String> errors = (List<String>) response.getBody();
        assertNotNull(errors);
        assertEquals(2, errors.size());
        assertTrue(errors.contains("email: must not be blank"));
        assertTrue(errors.contains("password: must not be blank"));
    }

    @Test
    void verifyTokenParam_shouldReturnUserResponse_whenTokenIsValid() {
        String validToken = "valid-jwt-token";
        UserDetails mockUserDetails = mockUser;
        JwtTokenValidationResponse validationResponse = new JwtTokenValidationResponse(true, "Token is valid");

        when(jwtService.extractUsername(validToken)).thenReturn(mockUserDetails.getUsername());
        when(userDetailsService.loadUserByUsername(mockUserDetails.getUsername())).thenReturn(mockUserDetails);
        when(jwtService.isTokenValid(validToken, mockUserDetails)).thenReturn(validationResponse);

        ResponseEntity<?> response = authenticationController.verifyTokenParam(validToken);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        UserResponse userResponse = (UserResponse) response.getBody();
        assertNotNull(userResponse);
        assertEquals(mockUser.getId(), userResponse.getId());
        assertEquals(mockUser.getEmail(), userResponse.getEmail());
        assertEquals(mockUser.isAdmin(), userResponse.isAdmin());
        assertEquals(mockUser.getName(), userResponse.getUsername());

        verify(jwtService, times(1)).extractUsername(validToken);
        verify(jwtService, times(1)).isTokenValid(validToken, mockUserDetails);
    }

    @Test
    void verifyTokenParam_shouldReturnUnauthorized_whenTokenIsInvalid() {
        String invalidToken = "invalid-jwt-token";
        JwtTokenValidationResponse validationResponse = new JwtTokenValidationResponse(false, "Token is invalid");

        when(jwtService.extractUsername(invalidToken)).thenReturn(mockUser.getEmail());
        when(userDetailsService.loadUserByUsername(mockUser.getEmail())).thenReturn(mockUser);
        when(jwtService.isTokenValid(invalidToken, mockUser)).thenReturn(validationResponse);

        ResponseEntity<?> response = authenticationController.verifyTokenParam(invalidToken);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Token is invalid", response.getBody());

        verify(jwtService, times(1)).extractUsername(invalidToken);
        verify(jwtService, times(1)).isTokenValid(invalidToken, mockUser);
    }

    @Test
    void verifyTokenParam_shouldReturnUnauthorized_whenTokenIsExpired() {
        String expiredToken = "expired-jwt-token";
        JwtTokenValidationResponse validationResponse = new JwtTokenValidationResponse(false, "Token has expired");

        when(jwtService.extractUsername(expiredToken)).thenReturn(mockUser.getEmail());
        when(userDetailsService.loadUserByUsername(mockUser.getEmail())).thenReturn(mockUser);
        when(jwtService.isTokenValid(expiredToken, mockUser)).thenReturn(validationResponse);

        ResponseEntity<?> response = authenticationController.verifyTokenParam(expiredToken);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Token has expired", response.getBody());

        verify(jwtService, times(1)).extractUsername(expiredToken);
        verify(jwtService, times(1)).isTokenValid(expiredToken, mockUser);
    }

    @Test
    void forgotPassword_shouldReturnOk_whenEmailExists() {
        ForgetPasswordDto forgotPasswordDto = new ForgetPasswordDto();
        forgotPasswordDto.setEmail("user@example.com");

        ResponseEntity<?> response = authenticationController.forgotPassword(forgotPasswordDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password reset email sent successfully.", response.getBody());
        verify(authenticationService, times(1)).initiatePasswordReset("user@example.com");
    }

    @Test
    void forgotPassword_shouldReturnNotFound_whenEmailDoesNotExist() {
        ForgetPasswordDto forgotPasswordDto = new ForgetPasswordDto();
        forgotPasswordDto.setEmail("nonexistent@example.com");

        doThrow(new RuntimeException("User not found")).when(authenticationService).initiatePasswordReset(anyString());

        ResponseEntity<?> response = authenticationController.forgotPassword(forgotPasswordDto);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
        verify(authenticationService, times(1)).initiatePasswordReset("nonexistent@example.com");
    }

    @Test
    void resetPassword_shouldReturnOk_whenResetCodeIsValid() {
        ResetPasswordDto resetPasswordDto = new ResetPasswordDto();
        resetPasswordDto.setEmail("user@example.com");
        resetPasswordDto.setResetCode("validCode");
        resetPasswordDto.setNewPassword("newPassword");

        ResponseEntity<?> response = authenticationController.resetPassword(resetPasswordDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password has been reset successfully.", response.getBody());
        verify(authenticationService, times(1)).resetPassword("user@example.com", "validCode", "newPassword");
    }

    @Test
    void resetPassword_shouldReturnBadRequest_whenResetCodeIsInvalid() {
        ResetPasswordDto resetPasswordDto = new ResetPasswordDto();
        resetPasswordDto.setEmail("user@example.com");
        resetPasswordDto.setResetCode("invalidCode");
        resetPasswordDto.setNewPassword("newPassword");

        doThrow(new RuntimeException("Invalid or expired reset code")).when(authenticationService)
                .resetPassword(anyString(), anyString(), anyString());

        ResponseEntity<?> response = authenticationController.resetPassword(resetPasswordDto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid or expired reset code", response.getBody());
        verify(authenticationService, times(1)).resetPassword("user@example.com", "invalidCode", "newPassword");
    }

    @Test
    void changePassword_shouldReturnOk_whenOldPasswordIsCorrect() {
        ChangePasswordDto changePasswordDto = new ChangePasswordDto();
        changePasswordDto.setOldPassword("oldPassword");
        changePasswordDto.setNewPassword("newPassword");

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        doNothing().when(authenticationService).changePassword(mockUser, "oldPassword", "newPassword");

        ResponseEntity<?> response = authenticationController.changePassword(changePasswordDto, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password has been reset successfully.", response.getBody());
        verify(authenticationService, times(1)).changePassword(mockUser, "oldPassword", "newPassword");
    }

    @Test
    void changePassword_shouldReturnBadRequest_whenOldPasswordIsIncorrect() {
        ChangePasswordDto changePasswordDto = new ChangePasswordDto();
        changePasswordDto.setOldPassword("wrongOldPassword");
        changePasswordDto.setNewPassword("newPassword");

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        doThrow(new RuntimeException("Incorrect old password."))
                .when(authenticationService).changePassword(mockUser, "wrongOldPassword", "newPassword");

        ResponseEntity<?> response = authenticationController.changePassword(changePasswordDto, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Incorrect old password.", response.getBody());
        verify(authenticationService, times(1)).changePassword(mockUser, "wrongOldPassword", "newPassword");
    }

    @Test
    void changePassword_shouldReturnUnauthorized_whenUserIsNotAuthenticated() {
        ChangePasswordDto changePasswordDto = new ChangePasswordDto();
        changePasswordDto.setOldPassword("oldPassword");
        changePasswordDto.setNewPassword("newPassword");

        // Set authentication to null to simulate an unauthenticated request
        ResponseEntity<?> response = authenticationController.changePassword(changePasswordDto, null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("User is not authenticated", response.getBody());
    }

    @Test
    void changePassword_shouldReturnUnauthorized_whenUserIsNotFullyAuthenticated() {
        ChangePasswordDto changePasswordDto = new ChangePasswordDto();
        changePasswordDto.setOldPassword("oldPassword");
        changePasswordDto.setNewPassword("newPassword");

        // Mock authentication but set isAuthenticated to false
        when(authentication.isAuthenticated()).thenReturn(false);

        ResponseEntity<?> response = authenticationController.changePassword(changePasswordDto, authentication);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("User is not authenticated", response.getBody());
    }
}

