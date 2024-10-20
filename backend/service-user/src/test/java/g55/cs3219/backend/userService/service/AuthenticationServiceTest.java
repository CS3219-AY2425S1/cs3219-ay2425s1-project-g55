package g55.cs3219.backend.userService.service;

import g55.cs3219.backend.userService.dto.LoginUserDto;
import g55.cs3219.backend.userService.dto.RegisterUserDto;
import g55.cs3219.backend.userService.dto.VerifyUserDto;
import g55.cs3219.backend.userService.model.User;
import g55.cs3219.backend.userService.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void signup_shouldCreateNewUser_whenInputIsValid() {
        RegisterUserDto registerUserDto = new RegisterUserDto();
        registerUserDto.setUsername("testUser");
        registerUserDto.setEmail("test@example.com");
        registerUserDto.setPassword("password");

        when(userRepository.findByUsername("testUser")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        try {
            doNothing().when(emailService).sendVerificationEmail(eq("test@example.com"),
                    eq("Account Verification"),
                    anyString());
        } catch (MessagingException e){
            fail("MessagingException occurred: " + e.getMessage());
        }

        User result = authenticationService.signup(registerUserDto);

        assertNotNull(result);
        assertEquals("testUser", result.getName());
        assertEquals("test@example.com", result.getUsername());
        assertEquals("encodedPassword", result.getPassword());
        assertFalse(result.isEnabled());

        try {
            verify(emailService, times(1)).sendVerificationEmail(eq("test@example.com"),
                    eq("Account Verification"),
                    anyString());
        } catch (MessagingException e){
            fail("MessagingException occurred: " + e.getMessage());
        }
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void signup_shouldThrowException_whenUsernameExists() {
        RegisterUserDto registerUserDto = new RegisterUserDto();
        registerUserDto.setUsername("existingUser");
        registerUserDto.setEmail("test@example.com");
        registerUserDto.setPassword("password");
        when(userRepository.findByUsername("existingUser")).thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authenticationService.signup(registerUserDto));
        assertEquals("Username already exists", exception.getMessage());
    }

    @Test
    void signup_shouldThrowException_whenEmailExists() {
        RegisterUserDto registerUserDto = new RegisterUserDto();
        registerUserDto.setUsername("testUser");
        registerUserDto.setEmail("existing@example.com");
        registerUserDto.setPassword("password");
        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authenticationService.signup(registerUserDto));
        assertEquals("Email already exists", exception.getMessage());
    }

    @Test
    void authenticate_shouldAuthenticateUser_whenValidCredentialsProvided() {
        LoginUserDto loginUserDto = new LoginUserDto();
        loginUserDto.setEmail("test@example.com");
        loginUserDto.setPassword("password");
        User user = new User("testUser", "test@example.com", "encodedPassword");
        user.setEnabled(true);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);

        User result = authenticationService.authenticate(loginUserDto);

        assertNotNull(result);
        assertEquals("testUser", result.getName());
        assertEquals("test@example.com", result.getUsername());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void authenticate_shouldThrowException_whenAccountNotVerified() {
        LoginUserDto loginUserDto = new LoginUserDto();
        loginUserDto.setEmail("test@example.com");
        loginUserDto.setPassword("password");
        User user = new User("testUser", "test@example.com", "encodedPassword");
        user.setEnabled(false);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authenticationService.authenticate(loginUserDto));
        assertEquals("Account is not verified. Please verify your email test@example.com", exception.getMessage());
    }

    @Test
    void verifyUser_shouldEnableUser_whenVerificationCodeIsValid() {
        VerifyUserDto verifyUserDto = new VerifyUserDto();
        verifyUserDto.setEmail("test@example.com");
        verifyUserDto.setVerificationCode("123456");
        User user = new User("testUser", "test@example.com", "encodedPassword");
        user.setVerificationCode("123456");
        user.setVerificationCodeExpiredAt(LocalDateTime.now().plusMinutes(10));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        authenticationService.verifyUser(verifyUserDto);

        assertTrue(user.isEnabled());
        assertNull(user.getVerificationCode());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void verifyUser_shouldThrowException_whenVerificationCodeIsExpired() {
        VerifyUserDto verifyUserDto = new VerifyUserDto();
        verifyUserDto.setEmail("test@example.com");
        verifyUserDto.setVerificationCode("123456");
        User user = new User("testUser", "test@example.com", "encodedPassword");
        user.setVerificationCode("123456");
        user.setVerificationCodeExpiredAt(LocalDateTime.now().minusMinutes(10));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authenticationService.verifyUser(verifyUserDto));
        assertEquals("Verification Code has expired", exception.getMessage());
    }

    @Test
    void verifyUser_shouldThrowException_whenEmailNotFound() {
        VerifyUserDto verifyUserDto = new VerifyUserDto();
        verifyUserDto.setEmail("missing@example.com");
        verifyUserDto.setVerificationCode("123456");

        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authenticationService.verifyUser(verifyUserDto));
        assertEquals("User Not Found with email missing@example.com", exception.getMessage());
    }

    @Test
    void verifyUser_shouldThrowException_whenVerificationCodeIsInvalid() {
        VerifyUserDto verifyUserDto = new VerifyUserDto();
        verifyUserDto.setEmail("test@example.com");
        verifyUserDto.setVerificationCode("wrongCode");

        User user = new User("testUser", "test@example.com", "encodedPassword");
        user.setVerificationCode("correctCode");
        user.setVerificationCodeExpiredAt(LocalDateTime.now().plusMinutes(10));

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authenticationService.verifyUser(verifyUserDto));
        assertEquals("Invalid verification code", exception.getMessage());
    }

    @Test
    void resendVerificationCode_shouldResendEmail_whenUserIsNotVerified() {
        User user = new User("testUser", "test@example.com", "encodedPassword");
        user.setEnabled(false);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        authenticationService.resendVerificationCode("test@example.com");

        try {
            verify(emailService, times(1)).sendVerificationEmail(eq("test@example.com"),
                    eq("Account Verification"),
                    anyString());
            verify(userRepository, times(1)).save(user);
        } catch (MessagingException e){
            fail("MessagingException occurred: " + e.getMessage());
        }
    }

    @Test
    void resendVerificationCode_shouldThrowException_whenAccountIsAlreadyVerified() {
        User user = new User("testUser", "test@example.com", "encodedPassword");
        user.setEnabled(true);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authenticationService.resendVerificationCode("test@example.com"));
        assertEquals("Account is already verified", exception.getMessage());
    }

    @Test
    void resendVerificationCode_shouldThrowException_whenEmailNotFound() {
        String email = "missing@example.com";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authenticationService.resendVerificationCode(email));

        assertEquals("User Not Found with email " + email, exception.getMessage());
    }

    @Test
    void resendVerificationCode_shouldInvalidateOldCode_whenNewCodeIsSent() {
        User user = new User("testUser", "test@example.com", "encodedPassword");
        user.setEnabled(false);
        user.setVerificationCode("oldCode");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        authenticationService.resendVerificationCode("test@example.com");

        assertNotEquals("oldCode", user.getVerificationCode()); 
        assertNotNull(user.getVerificationCode());

        try {
            verify(emailService, times(1)).sendVerificationEmail(eq("test@example.com"),
                    eq("Account Verification"),
                    anyString());
            verify(userRepository, times(1)).save(user);
        } catch (MessagingException e) {
            fail("MessagingException occurred: " + e.getMessage());
        }
    }

    @Test
    void updateUser_shouldThrowException_whenUserNotFound() {
        Long userId = 1L;
        Map<String, Object> updates = new HashMap<>();
        User currentUser = new User();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authenticationService.updateUser(userId, updates, currentUser));
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void updateUser_shouldThrowException_whenNonAdminTriesToUpdateOtherUser() {
        Long userId = 2L;
        Map<String, Object> updates = new HashMap<>();
        User currentUser = new User();
        currentUser.setId(1L);

        User userToUpdate = new User();
        userToUpdate.setId(2L);

        when(userRepository.findById(userId)).thenReturn(Optional.of(userToUpdate));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authenticationService.updateUser(userId, updates, currentUser));
        assertEquals("Forbidden: You can only update your own information.", exception.getMessage());
    }

    @Test
    void updateUser_shouldUpdateOwnInformation() {
        Long userId = 1L;
        Map<String, Object> updates = new HashMap<>();
        updates.put("email", "newemail@example.com");
        updates.put("username", "UpdatedUser");

        User currentUser = new User();
        currentUser.setId(userId);
        currentUser.setAdmin(false);

        User userToUpdate = new User();
        userToUpdate.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(userToUpdate));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User updatedUser = authenticationService.updateUser(userId, updates, currentUser);

        assertNotNull(updatedUser);
        assertEquals("newemail@example.com", updatedUser.getEmail());
        assertEquals("UpdatedUser", updatedUser.getName());
        verify(userRepository, times(1)).save(userToUpdate);
    }

    @Test
    void updateUser_shouldAllowAdminToUpdateOtherUser() {
        Long userId = 2L;
        Map<String, Object> updates = new HashMap<>();
        updates.put("isAdmin", true);

        User currentUser = new User();
        currentUser.setId(1L);
        currentUser.setAdmin(true);

        User userToUpdate = new User();
        userToUpdate.setId(2L);
        userToUpdate.setAdmin(false);

        when(userRepository.findById(userId)).thenReturn(Optional.of(userToUpdate));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User updatedUser = authenticationService.updateUser(userId, updates, currentUser);

        assertNotNull(updatedUser);
        assertTrue(updatedUser.isAdmin());
        verify(userRepository, times(1)).save(userToUpdate);
    }

}

