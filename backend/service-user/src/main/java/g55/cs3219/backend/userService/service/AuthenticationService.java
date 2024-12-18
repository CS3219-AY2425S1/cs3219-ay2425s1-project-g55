package g55.cs3219.backend.userService.service;

import g55.cs3219.backend.userService.dto.LoginUserDto;
import g55.cs3219.backend.userService.dto.RegisterUserDto;
import g55.cs3219.backend.userService.dto.VerifyUserDto;
import g55.cs3219.backend.userService.model.User;
import g55.cs3219.backend.userService.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public User signup(RegisterUserDto input) {
        // Check for duplicate username
        if (userRepository.findByUsername(input.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Check for duplicate email
        if (userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User(input.getUsername(), input.getEmail(), passwordEncoder.encode(input.getPassword()));
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiredAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationEmail(user);
        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User Not Found with email " + input.getEmail()));

        if(!user.isEnabled()) {
            throw new RuntimeException("Account is not verified. Please verify your email " + input.getEmail());
        }

        authenticationManager.authenticate( new UsernamePasswordAuthenticationToken(input.getEmail(),
                input.getPassword()));

        return user;
    }

    public void verifyUser(VerifyUserDto input) {
        Optional<User> optionalUser = userRepository.findByEmail(input.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if(user.getVerificationCodeExpiredAt().isBefore(LocalDateTime.now())){
                throw new RuntimeException("Verification Code has expired");
            }

            if (user.getVerificationCode().equals(input.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiredAt(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("User Not Found with email " + input.getEmail());
        }
    }

    public void resendVerificationCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if(optionalUser.isPresent()) {
            User user = optionalUser.get();

            if(user.isEnabled()){
                throw new RuntimeException("Account is already verified");
            }

            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiredAt(LocalDateTime.now().plusMinutes(30));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User Not Found with email " + email);
        }
    }

    public void sendVerificationEmail(User user) {
        String subject = "Account Verification";
        String verificationCode = user.getVerificationCode();
        String text = "<html><body>"
                + "<h1>Account Verification</h1>"
                + "<p>Thank you for registering with us. Please verify your account by entering the code below on the verification page:</p>"
                + "<p><b>Verification Code: " + verificationCode + "</b></p>"
                + "<p>If you did not request this verification, please ignore this email.</p>"
                + "<p>Best regards,<br>Your Team</p>"
                + "</body></html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, text);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public User updateUser(Long userId, Map<String, Object> updates, User currentUser) {
        User userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean emailChanged = false;

        if (!currentUser.isAdmin() && !userToUpdate.getId().equals(currentUser.getId())) {
            throw new RuntimeException("Forbidden: You can only update your own information.");
        }

        if (updates.containsKey("username")) {
            userToUpdate.setUsername((String) updates.get("username"));
        }
        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            if (!newEmail.equals(userToUpdate.getEmail())) {
                userToUpdate.setEmail(newEmail);
                userToUpdate.setEnabled(false);
                userToUpdate.setVerificationCode(generateVerificationCode());
                userToUpdate.setVerificationCodeExpiredAt(LocalDateTime.now().plusMinutes(15));
                emailChanged = true;
            }
        }
        if (updates.containsKey("password") && currentUser.isAdmin()) {
            userToUpdate.setPassword(passwordEncoder.encode((String) updates.get("password")));
        }

        if (updates.containsKey("isAdmin") && currentUser.isAdmin()) {
            userToUpdate.setAdmin((Boolean) updates.get("isAdmin"));
        }

        userRepository.save(userToUpdate);

        if (emailChanged) {
            sendVerificationEmail(userToUpdate);
        }

        return userToUpdate;
    }

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("User is not verified. Please verify your account first.");
        }

        String resetCode = generateVerificationCode();
        user.setResetPasswordToken(resetCode);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));  // Set expiry for 30 minutes
        userRepository.save(user);

        sendResetEmail(user);
    }

    public void resetPassword(String email, String resetCode, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("User is not verified. Please verify your account first.");
        }

        if (user.getResetPasswordToken() == null || !user.getResetPasswordToken().equals(resetCode) ||
                user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired reset code");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null); // Clear reset code after successful reset
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    public void changePassword(User user, String oldPassword, String newPassword) {
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect old password.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private void sendResetEmail(User user) {
        String subject = "Password Reset Request";
        String resetCode = user.getResetPasswordToken();
        String text = "<html><body>"
                + "<h1>Password Reset</h1>"
                + "<p>Please use the following code to reset your password:</p>"
                + "<p><b>Reset Code: " + resetCode + "</b></p>"
                + "<p>If you did not request a password reset, please ignore this email.</p>"
                + "</body></html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, text);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private  String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
