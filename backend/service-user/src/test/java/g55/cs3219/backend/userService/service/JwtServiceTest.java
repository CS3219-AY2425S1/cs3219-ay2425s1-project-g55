package g55.cs3219.backend.userService.service;

import g55.cs3219.backend.userService.responses.JwtTokenValidationResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    @Mock
    private UserDetails userDetails;

    private String secretKey = "base64EncodedSecretKeyThatIsLongEnoughToBeUsedForTesting123456";
    private String token;
    private SecretKey key;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        jwtService = new JwtService();
        jwtService.setSecretKey(secretKey);
        jwtService.setJwtExpiration(3600000L);

        key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey));

        token = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plusMillis(jwtService.getJwtExpiration())))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    @Test
    void extractUsername_shouldReturnUsernameFromToken() {
        String username = jwtService.extractUsername(token);

        assertEquals("testUser", username);
    }

    @Test
    void extractUsername_shouldThrowMalformedJwtException_whenTokenIsMalformed() {
        String malformedToken = "part1.part2.part3.extra";
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testUser");

        assertThrows(MalformedJwtException.class, () -> {
            jwtService.extractUsername(malformedToken);
        }, "Expected MalformedJwtException to be thrown");
    }

    @Test
    void generateToken_shouldReturnValidToken() {
        when(userDetails.getUsername()).thenReturn("testUser");

        String generatedToken = jwtService.generateToken(userDetails);

        assertNotNull(generatedToken);
        String extractedUsername = jwtService.extractUsername(generatedToken);
        assertEquals("testUser", extractedUsername);
    }

    @Test
    void isTokenValid_shouldReturnTrueAndValidMessageForValidToken() {
        when(userDetails.getUsername()).thenReturn("testUser");

        JwtTokenValidationResponse response = jwtService.isTokenValid(token, userDetails);

        assertTrue(response.isValid());
        assertEquals("Token is valid.", response.getMessage());
    }

    @Test
    void isTokenValid_shouldReturnFalseAndInvalidUsernameMessageForInvalidToken() {
        String invalidToken = Jwts.builder()
                .setSubject("wrongUser")
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plusMillis(jwtService.getExpirationTime())))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        when(userDetails.getUsername()).thenReturn("testUser");

        JwtTokenValidationResponse response = jwtService.isTokenValid(invalidToken, userDetails);

        assertFalse(response.isValid());
        assertEquals("Username does not match.", response.getMessage());
    }

    @Test
    void isTokenValid_shouldReturnTrueAndValidMessageForNonExpiredToken() {
        when(userDetails.getUsername()).thenReturn("testUser");

        JwtTokenValidationResponse response = jwtService.isTokenValid(token, userDetails);

        assertTrue(response.isValid());
        assertEquals("Token is valid.", response.getMessage());
    }

    @Test
    void isTokenValid_shouldReturnFalseAndExpiredMessage_whenTokenIsExpired() {
        String expiredToken = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(Date.from(Instant.now().minusMillis(7200000L)))
                .setExpiration(Date.from(Instant.now().minusMillis(3600000L)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        when(userDetails.getUsername()).thenReturn("testUser");

        JwtTokenValidationResponse response = jwtService.isTokenValid(expiredToken, userDetails);

        assertFalse(response.isValid());
        assertEquals("Token is expired.", response.getMessage());
    }

    @Test
    public void isTokenValid_shouldReturnFalseAndTokenValidationFailedMessage_whenUnexpectedExceptionThrown() {
        String token = "dummyToken";
        UserDetails userDetails = mock(UserDetails.class);
        JwtService jwtService = new JwtService();

        JwtTokenValidationResponse response = jwtService.isTokenValid(token, userDetails);

        assertFalse(response.isValid());
        assertEquals("Token validation failed.", response.getMessage());
    }

}

