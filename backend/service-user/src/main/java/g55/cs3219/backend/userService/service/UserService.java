package g55.cs3219.backend.userService.service;

import g55.cs3219.backend.userService.model.User;
import g55.cs3219.backend.userService.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }

    public User getUserById(Long userId, User currentUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the current user is an admin or accessing their own data
        if (!currentUser.isAdmin() && !user.getId().equals(currentUser.getId())) {
            throw new RuntimeException("Forbidden");
        }

        return user;
    }

    public void deleteUser(Long userId, User currentUser) {
        User userToDelete = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!currentUser.isAdmin() && !userToDelete.getId().equals(currentUser.getId())) {
            throw new RuntimeException("Forbidden: You are not allowed to delete this user.");
        }

        userRepository.delete(userToDelete);
    }

}
