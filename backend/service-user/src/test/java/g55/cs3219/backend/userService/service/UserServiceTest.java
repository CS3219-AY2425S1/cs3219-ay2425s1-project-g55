package g55.cs3219.backend.userService.service;

import g55.cs3219.backend.userService.model.User;
import g55.cs3219.backend.userService.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User adminUser;
    private User regularUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        adminUser = new User("admin", "admin@example.com", "password");
        adminUser.setId(1L);
        adminUser.setAdmin(true);

        regularUser = new User("user", "user@example.com", "password");
        regularUser.setId(2L);
        regularUser.setAdmin(false);
    }

    @Test
    void getAllUsers_shouldReturnListOfUsers() {
        List<User> users = Arrays.asList(adminUser, regularUser);
        when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
        assertEquals(adminUser.getEmail(), result.get(0).getEmail());
        assertEquals(regularUser.getEmail(), result.get(1).getEmail());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUserById_shouldReturnUser_whenAdmin() {
        when(userRepository.findById(regularUser.getId())).thenReturn(Optional.of(regularUser));

        User result = userService.getUserById(regularUser.getId(), adminUser);

        assertNotNull(result);
        assertEquals(regularUser.getId(), result.getId());
        assertEquals(regularUser.getEmail(), result.getEmail());
        verify(userRepository, times(1)).findById(regularUser.getId());
    }

    @Test
    void getUserById_shouldReturnUser_whenAccessingOwnData() {
        when(userRepository.findById(regularUser.getId())).thenReturn(Optional.of(regularUser));

        User result = userService.getUserById(regularUser.getId(), regularUser);

        assertNotNull(result);
        assertEquals(regularUser.getId(), result.getId());
        verify(userRepository, times(1)).findById(regularUser.getId());
    }

    @Test
    void getUserById_shouldThrowException_whenNotAdminAndAccessingOtherUserData() {
        when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserById(adminUser.getId(), regularUser);
        });

        assertEquals("Forbidden", exception.getMessage());
        verify(userRepository, times(1)).findById(adminUser.getId());
    }

    @Test
    void getUserById_shouldThrowException_whenUserNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserById(999L, adminUser);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    void deleteUser_shouldDeleteUser_whenAdmin() {
        when(userRepository.findById(regularUser.getId())).thenReturn(Optional.of(regularUser));

        userService.deleteUser(regularUser.getId(), adminUser);

        verify(userRepository, times(1)).delete(regularUser);
    }

    @Test
    void deleteUser_shouldDeleteOwnAccount_whenNotAdmin() {
        when(userRepository.findById(regularUser.getId())).thenReturn(Optional.of(regularUser));

        userService.deleteUser(regularUser.getId(), regularUser);

        verify(userRepository, times(1)).delete(regularUser);
    }

    @Test
    void deleteUser_shouldThrowException_whenNotAdminAndDeletingOtherUser() {
        when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.deleteUser(adminUser.getId(), regularUser);
        });

        assertEquals("Forbidden: You are not allowed to delete this user.", exception.getMessage());
        verify(userRepository, times(1)).findById(adminUser.getId());
        verify(userRepository, times(0)).delete(adminUser);
    }

    @Test
    void deleteUser_shouldThrowException_whenUserNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.deleteUser(999L, adminUser);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findById(999L);
        verify(userRepository, times(0)).delete(any(User.class));
    }
}

