package g55.cs3219.backend.apigateway.util;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import javax.crypto.spec.SecretKeySpec;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "fshMuXMuLQRLhMCMWWuDxxO1BV5hiUhsyWH6jyAE4ZY="; // Ensure this is the same key used for signing
    private Key key;

    @PostConstruct
    public void init(){
        byte[] keyBytes = Base64.getDecoder().decode(SECRET_KEY);
        key = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        return this.getAllClaimsFromToken(token).getExpiration().before(new Date());
    }

    public boolean isInvalid(String token) {
        return this.isTokenExpired(token);
    }

    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Claims decodeToken(String token) {
        return getAllClaimsFromToken(token);
    }
}