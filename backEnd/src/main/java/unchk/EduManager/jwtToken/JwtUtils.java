package unchk.EduManager.jwtToken;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.util.Tuple;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtils {
    @Value("${app.secret.key}")
    private String secretKey;
    @Value("${app.expiration-time}")
    private long expirationTime;

    public String generateToken(String username) {
        Map<String, Object> clams = new HashMap<>();
        return createToken(clams, username);
    }

    private String createToken(Map<String, Object> clams, String subject) {
        return Jwts.builder()
                .claims(clams)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(generateSecreteKey())
                .compact();
    }

    /**
     * generate a secreate key method
     **/
    private SecretKey generateSecreteKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Pour vérifier l'integrité et la fiabilté des données contenue sur le token
     * nous utilisons cette méthode
     **/
    public boolean valideToken(String token, UserDetails userDetails) {
        try {
            String email = extractEmail(token);
            return (email.equals(userDetails.getUsername()) && !token.equals("null") && !isTokenExpired(token));

        } catch (Exception ex) {
            throw ex;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpirationDate(token).before(new Date());
    }

    private Date extractExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Pour extraire une information dans le token en fonction de l'element fournit
     * en parametre
     **/
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolve) {
        final Claims claims = extractAllClaims(token);
        log.debug("++++++++++++++++++++Claims are \n" + claims);
        return claimsResolve.apply(claims);
    }

    /**
     * cette méthode nous donnera toute les informations necessaire à
     * l'authentification contenue au sein du token lui meme
     **/
    private Claims extractAllClaims(String token) {
        return Jwts.parser() // pour l'analyser
                .verifyWith(generateSecreteKey()) // vérifier la clé que nous avons
                .build() // construire l'analyseur
                .parseSignedClaims(token) // analyser le token et recuperer jws<claims>
                .getPayload(); // recuperer les données contenues dans le token

    }

    public Tuple<String, String> getInfoOfJwt(HttpServletRequest request) {
        String authHearder = request.getHeader("Authorization");
        String email = null;
        String token = null;
        if (authHearder != null && authHearder.startsWith("Bearer ")) {
            token = authHearder.substring(7);
            email = extractEmail(token);
        }
        return new Tuple<String, String>(token, email);
    }
}
