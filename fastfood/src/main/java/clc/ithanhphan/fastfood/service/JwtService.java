package clc.ithanhphan.fastfood.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateAccessToken(String username, String role) {
        return generateToken(username, role, accessTokenExpiration);
    }

    public String generateRefreshToken(String username, String role) {
        return generateToken(username, role, refreshTokenExpiration);
    }

    private String generateToken(String username, String role, long expiration) {

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public String extractRole(String token) {

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }

    public boolean isValidToken(String token) {

        try {

            Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (Exception e) {
            return false;
        }
    }
}
