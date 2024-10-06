package g55.cs3219.backend.userService.controller;

import g55.cs3219.backend.userService.dto.RegisterUserDto;
import g55.cs3219.backend.userService.responses.UserResponse;
import g55.cs3219.backend.userService.model.User;
import g55.cs3219.backend.userService.service.AuthenticationService;
import g55.cs3219.backend.userService.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;
    private final AuthenticationService authenticationService;

    public UserController(UserService userService, AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(Authentication authentication) {
        // Check if the authenticated user is an admin
        User currentUser = (User) authentication.getPrincipal();
        if (!currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        // Fetch all users from the database
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(@PathVariable String userId, Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            User fetchedUser = userService.getUserById(Long.parseLong(userId), currentUser);
            return ResponseEntity.ok(new UserResponse(fetchedUser.getId(), fetchedUser.getName(), fetchedUser.getEmail()));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Forbidden")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
            }
            if (e.getMessage().equals("User not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with the specified ID not found.");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody Map<String, Object> updates,
                                        Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();

            if (updates.containsKey("isAdmin")) {
                if (!currentUser.isAdmin()) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only admin users can update privileges.");
                }
            }
            User updatedUser = authenticationService.updateUser(Long.parseLong(userId), updates, currentUser);

            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Forbidden")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            } else if (e.getMessage().contains("User not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the user information.");
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterUserDto registerUserDto) {
        try {
            User createdUser = authenticationService.signup(registerUserDto);
            return new ResponseEntity<>(new UserResponse(createdUser.getId(), createdUser.getName(), createdUser.getEmail()), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Handle duplicate username or email
            if (e.getMessage().contains("exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
            }
            // Handle other server errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (Exception e) {
            // Handle generic errors (e.g., missing fields)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input: " + e.getMessage());
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId, Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            userService.deleteUser(Long.parseLong(userId), currentUser);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Forbidden")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            } else if (e.getMessage().contains("User not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the user.");
        }
    }
}
