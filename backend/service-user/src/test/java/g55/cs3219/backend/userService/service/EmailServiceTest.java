package g55.cs3219.backend.userService.service;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


class EmailServiceTest {

    @Mock
    private JavaMailSender emailSender;

    @InjectMocks
    private EmailService emailService;

    private MimeMessage mimeMessage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mimeMessage = mock(MimeMessage.class);
    }

    @Test
    void sendVerificationEmail_shouldSendEmailSuccessfully() {
        String recipient = "user@example.com";
        String subject = "Account Verification";
        String text = "<html><body><h1>Verify your account</h1></body></html>";

        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);

        try {
            emailService.sendVerificationEmail(recipient, subject, text);

            verify(emailSender, times(1)).createMimeMessage();
            verify(emailSender, times(1)).send(mimeMessage);

            verify(mimeMessage, times(1)).setRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
            verify(mimeMessage, times(1)).setSubject(subject);

            verify(mimeMessage, times(1)).setContent(any(MimeMultipart.class));
        } catch (MessagingException e) {
            fail("MessagingException occurred: " + e.getMessage());
        }
    }

    @Test
    void sendVerificationEmail_shouldThrowMessagingException()  {
        String recipient = "user@example.com";
        String subject = "Account Verification";
        String text = "<html><body><h1>Verify your account</h1></body></html>";

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);

        doAnswer(invocation -> {
            throw new MessagingException("Failed to send email");
        }).when(emailSender).send(mimeMessage);

        MessagingException exception = assertThrows(MessagingException.class, () -> {
            emailService.sendVerificationEmail(recipient, subject, text);
        });

        assertEquals("Failed to send email", exception.getMessage());
    }
}

