package g55.cs3219.backend.userService.controller;

import g55.cs3219.backend.userService.dto.RegisterUserDto;
import g55.cs3219.backend.userService.model.User;
import g55.cs3219.backend.userService.responses.UserResponse;
import g55.cs3219.backend.userService.service.AuthenticationService;
import g55.cs3219.backend.userService.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;


import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserController userController;

    private User adminUser;
    private User regularUser;
    private List<User> userList;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        adminUser = new User("admin", "admin@example.com", "password");
        adminUser.setId(1L);
        adminUser.setAdmin(true);

        regularUser = new User("user", "user@example.com", "password");
        regularUser.setId(2L);
        regularUser.setAdmin(false);

        userList = Arrays.asList(adminUser, regularUser);
    }

    @Test
    void getAllUsers_shouldReturnAllUsers_whenAdmin() {

        when(authentication.getPrincipal()).thenReturn(adminUser);
        when(userService.getAllUsers()).thenReturn(userList);

        ResponseEntity<List<User>> response = userController.getAllUsers(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void getAllUsers_shouldReturnForbidden_whenNotAdmin() {
        when(authentication.getPrincipal()).thenReturn(regularUser);

        ResponseEntity<List<User>> response = userController.getAllUsers(authentication);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(userService, times(0)).getAllUsers();
    }

    @Test
    void getUser_shouldReturnUser_whenAdmin() {
        when(authentication.getPrincipal()).thenReturn(adminUser);
        when(userService.getUserById(anyLong(), eq(adminUser))).thenReturn(regularUser);

        ResponseEntity<?> response = userController.getUser("2", authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        UserResponse userResponse = (UserResponse) response.getBody();
        assertNotNull(userResponse);
        assertEquals(regularUser.getId(), userResponse.getId());
        assertEquals(regularUser.getEmail(), userResponse.getEmail());
        verify(userService, times(1)).getUserById(2L, adminUser);
    }

    @Test
    void getUser_shouldReturnForbidden_whenRegularUserAccessingOtherUserData() {
        when(authentication.getPrincipal()).thenReturn(regularUser);
        doThrow(new RuntimeException("Forbidden")).when(userService).getUserById(anyLong(), eq(regularUser));

        ResponseEntity<?> response = userController.getUser("1", authentication);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(userService, times(1)).getUserById(1L, regularUser);
    }

    @Test
    void getUser_shouldReturnNotFound_whenUserNotFound() {
        when(authentication.getPrincipal()).thenReturn(adminUser);
        when(userService.getUserById(anyLong(), eq(adminUser))).thenThrow(new RuntimeException("User not found"));

        ResponseEntity<?> response = userController.getUser("999", authentication);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User with the specified ID not found.", response.getBody());
        verify(userService, times(1)).getUserById(999L, adminUser);
    }

    @Test
    void getUser_shouldReturnInternalServerError_whenUnexpectedExceptionOccurs() {
        when(authentication.getPrincipal()).thenReturn(adminUser);
        when(userService.getUserById(anyLong(), eq(adminUser)))
                .thenThrow(new RuntimeException("Unexpected exception"));

        ResponseEntity<?> response = userController.getUser("2", authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An unexpected error occurred: Unexpected exception", response.getBody());
        verify(userService, times(1)).getUserById(2L, adminUser);
    }


    @Test
    void createUser_shouldReturnCreatedUser() {
        RegisterUserDto dto = new RegisterUserDto();
        dto.setUsername("newUser");
        dto.setEmail("newuser@example.com");
        dto.setPassword("password");
        User newUser = new User(dto.getUsername(), dto.getEmail(), dto.getPassword());
        newUser.setId(3L);

        when(authenticationService.signup(any(RegisterUserDto.class))).thenReturn(newUser);

        ResponseEntity<?> response = userController.createUser(dto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        UserResponse userResponse = (UserResponse) response.getBody();
        assertNotNull(userResponse);
        assertEquals(newUser.getId(), userResponse.getId());
        verify(authenticationService, times(1)).signup(dto);
    }

    @Test
    void createUser_shouldReturnConflict_whenUsernameOrEmailExists() {
        RegisterUserDto registerUserDto = new RegisterUserDto();
        registerUserDto.setUsername("existingUser");
        registerUserDto.setEmail("existingUser@example.co");
        registerUserDto.setPassword("password");

        when(authenticationService.signup(any(RegisterUserDto.class)))
                .thenThrow(new RuntimeException("Username already exists"));

        ResponseEntity<?> response = userController.createUser(registerUserDto);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("Username already exists", response.getBody());
        verify(authenticationService, times(1)).signup(registerUserDto);
    }

    @Test
    void createUser_shouldReturnInternalServerError_whenUnexpectedExceptionOccurs() {
        RegisterUserDto registerUserDto = new RegisterUserDto();
        registerUserDto.setUsername("newUser");
        registerUserDto.setEmail("newUser@example.com");
        registerUserDto.setPassword("password");

        when(authenticationService.signup(any(RegisterUserDto.class)))
                .thenThrow(new RuntimeException("Unexpected exception"));

        ResponseEntity<?> response = userController.createUser(registerUserDto);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Unexpected exception", response.getBody());
        verify(authenticationService, times(1)).signup(registerUserDto);
    }

    @Test
    void handleValidationExceptions_shouldReturnBadRequest_whenValidationFails() {
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);

        List<FieldError> fieldErrors = Arrays.asList(
                new FieldError("registerUserDto", "email", "must not be blank"),
                new FieldError("registerUserDto", "username", "must not be blank")
        );

        when(exception.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(fieldErrors);

        ResponseEntity<?> response = userController.handleValidationExceptions(exception);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        List<String> errors = (List<String>) response.getBody();
        assertNotNull(errors);
        assertEquals(2, errors.size());
        assertTrue(errors.contains("email: must not be blank"));
        assertTrue(errors.contains("username: must not be blank"));
    }

    @Test
    void updateUser_shouldReturnUpdatedUser_whenAdmin() {
        Map<String, Object> updates = new HashMap<>();
        updates.put("username", "updatedUser");
        updates.put("email", "updatedUser@example.com");

        User updatedUser = new User("updatedUser", "updatedUser@example.com", regularUser.getPassword());
        updatedUser.setId(regularUser.getId());

        when(authentication.getPrincipal()).thenReturn(adminUser);
        when(authenticationService.updateUser(anyLong(), eq(updates), eq(adminUser))).thenReturn(updatedUser);

        ResponseEntity<?> response = userController.updateUser("2", updates, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        User returnedUser = (User) response.getBody();
        assertNotNull(returnedUser);
        assertEquals("updatedUser", returnedUser.getName());
        assertEquals("updatedUser@example.com", returnedUser.getUsername());
        verify(authenticationService, times(1)).updateUser(2L, updates, adminUser);
    }

    @Test
    void updateUser_shouldAllowNonAdminToUpdateOwnInformation() {
        Map<String, Object> updates = new HashMap<>();
        updates.put("username", "updatedUser");
        updates.put("email", "updatedUser@example.com");

        User updatedUser = new User("updatedUser", "updatedUser@example.com", regularUser.getPassword());
        updatedUser.setId(regularUser.getId()); 

        when(authentication.getPrincipal()).thenReturn(regularUser); 
        when(authenticationService.updateUser(eq(regularUser.getId()), eq(updates), eq(regularUser)))
                .thenReturn(updatedUser);

        ResponseEntity<?> response = userController.updateUser(regularUser.getId().toString(), updates, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        User returnedUser = (User) response.getBody();
        assertNotNull(returnedUser);
        assertEquals("updatedUser", returnedUser.getName());
        assertEquals("updatedUser@example.com", returnedUser.getUsername());
        verify(authenticationService, times(1)).updateUser(eq(regularUser.getId()), eq(updates), eq(regularUser));
    }

    @Test
    void updateUser_shouldReturnForbidden_whenNonAdminUserTriesToUpdateAdminPrivileges() {
        Map<String, Object> updates = new HashMap<>();
        updates.put("isAdmin", true);

        when(authentication.getPrincipal()).thenReturn(regularUser);

        ResponseEntity<?> response = userController.updateUser("2", updates, authentication);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Access denied. Only admin users can update privileges.", response.getBody());
        verify(authenticationService, times(0)).updateUser(anyLong(), anyMap(), any(User.class));
    }

    @Test
    void updateUser_shouldReturnForbidden_whenUserNotAuthorized() {
        Map<String, Object> updates = new HashMap<>();
        updates.put("username", "newUsername"); 

        when(authentication.getPrincipal()).thenReturn(regularUser);
        when(authenticationService.updateUser(anyLong(), eq(updates), eq(regularUser)))
                .thenThrow(new RuntimeException("Forbidden")); 

        ResponseEntity<?> response = userController.updateUser("2", updates, authentication);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Forbidden", response.getBody());
        verify(authenticationService, times(1)).updateUser(anyLong(), eq(updates), eq(regularUser)); 
    }

    @Test
    void updateUser_shouldReturnNotFound_whenUserDoesNotExist() {
        Map<String, Object> updates = new HashMap<>();
        updates.put("username", "newUsername");

        when(authentication.getPrincipal()).thenReturn(adminUser);
        when(authenticationService.updateUser(anyLong(), eq(updates), eq(adminUser)))
                .thenThrow(new RuntimeException("User not found"));

        ResponseEntity<?> response = userController.updateUser("999", updates, authentication);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
        verify(authenticationService, times(1)).updateUser(anyLong(), eq(updates), eq(adminUser)); 
    }

    @Test
    void updateUser_shouldReturnInternalServerError_whenUnexpectedExceptionOccurs() {
        Map<String, Object> updates = new HashMap<>();
        updates.put("username", "updatedUser");

        when(authentication.getPrincipal()).thenReturn(adminUser); 
        when(authenticationService.updateUser(anyLong(), eq(updates), eq(adminUser)))
                .thenThrow(new RuntimeException("Unexpected exception")); 

        ResponseEntity<?> response = userController.updateUser("2", updates, authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An error occurred while updating the user information: Unexpected exception", response.getBody());
        verify(authenticationService, times(1)).updateUser(2L, updates, adminUser);
    }

    @Test
    void deleteUser_shouldDeleteUser_whenAdmin() {
        when(authentication.getPrincipal()).thenReturn(adminUser);

        ResponseEntity<?> response = userController.deleteUser("2", authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).deleteUser(2L, adminUser);
    }

    @Test
    void deleteUser_shouldReturnForbidden_whenNotAdmin() {
        when(authentication.getPrincipal()).thenReturn(regularUser);
        doThrow(new RuntimeException("Forbidden")).when(userService).deleteUser(anyLong(), eq(regularUser));

       
        ResponseEntity<?> response = userController.deleteUser("1", authentication);

        // Assertions
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verify(userService, times(1)).deleteUser(1L, regularUser);
    }

    @Test
    void deleteUser_shouldReturnNotFound_whenUserDoesNotExist() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(adminUser); 
        doThrow(new RuntimeException("User not found")).when(userService).deleteUser(anyLong(), eq(adminUser)); 

        // Act
        ResponseEntity<?> response = userController.deleteUser("999", authentication);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
        verify(userService, times(1)).deleteUser(999L, adminUser); 
    }

    @Test
    void deleteUser_shouldReturnInternalServerError_whenUnexpectedExceptionOccurs() {
        when(authentication.getPrincipal()).thenReturn(adminUser); 
        doThrow(new RuntimeException("Unexpected exception")).when(userService).deleteUser(anyLong(), eq(adminUser)); 

        ResponseEntity<?> response = userController.deleteUser("2", authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An error occurred while deleting the user.", response.getBody());
        verify(userService, times(1)).deleteUser(2L, adminUser); // Ensure service was called with the correct user ID
    }

    @Test
    void deleteUser_shouldAllowNonAdminToDeleteOwnAccount() {
        when(authentication.getPrincipal()).thenReturn(regularUser); 
        doNothing().when(userService).deleteUser(eq(regularUser.getId()), eq(regularUser));

        ResponseEntity<?> response = userController.deleteUser(regularUser.getId().toString(), authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User deleted successfully.", response.getBody());
        verify(userService, times(1)).deleteUser(regularUser.getId(), regularUser); 
    }

}
