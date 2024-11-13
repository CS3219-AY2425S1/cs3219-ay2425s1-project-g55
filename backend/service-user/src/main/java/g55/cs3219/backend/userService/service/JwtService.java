package g55.cs3219.backend.userService.service;

import g55.cs3219.backend.userService.responses.JwtTokenValidationResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Setter
@Getter
public class JwtService {
    @Value("${security.jwt.secretKey}")
    private String secretKey;
    @Value("${security.jwt.expirationTime}")
    private Long jwtExpiration;

    public String extractUsername(String token) throws MalformedJwtException {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims,T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    public long getExpirationTime() {
        return jwtExpiration;
    }

    //https://www.youtube.com/watch?v=HYBRBkYtpeo
    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts
                .builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(expiration)))
                .signWith(generateKey())
                .compact();
    }

    public JwtTokenValidationResponse isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            if (!username.equals(userDetails.getUsername())) {
                return new JwtTokenValidationResponse(false, "Username does not match.");
            }
            return new JwtTokenValidationResponse(true, "Token is valid.");
        } catch (ExpiredJwtException e) {
            return new JwtTokenValidationResponse(false, "Token is expired.");
        } catch (Exception e) {
            return new JwtTokenValidationResponse(false, "Token validation failed.");
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private SecretKey generateKey(){
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
