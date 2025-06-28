package unchk.EduManager.jwtToken;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.yaml.snakeyaml.util.Tuple;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import unchk.EduManager.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            Tuple<String, String> authorization = jwtUtils.getInfoOfJwt(request);

            if (authorization._2() != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userService.loadUserByUsername(authorization._2());

                if (jwtUtils.valideToken(authorization._1(), userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {
            handleJwtError(response, "JWT_EXPIRED", "Token expiré", HttpStatus.UNAUTHORIZED);
        } catch (UnsupportedJwtException ex) {
            handleJwtError(response, "JWT_UNSUPPORTED", "Format de token non supporté", HttpStatus.BAD_REQUEST);
        } catch (MalformedJwtException ex) {
            handleJwtError(response, "JWT_MALFORMED", "Token malformé", HttpStatus.BAD_REQUEST);
        } catch (SignatureException ex) {
            handleJwtError(response, "JWT_INVALID_SIGNATURE", "Signature invalide", HttpStatus.UNAUTHORIZED);
        } catch (IllegalArgumentException ex) {
            handleJwtError(response, "JWT_ILLEGAL_ARGUMENT", "Token vide ou invalide", HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            handleJwtError(response, "AUTH_ERROR", "Erreur d'authentification : "+ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void handleJwtError(HttpServletResponse response,
            String errorCode,
            String message,
            HttpStatus status) throws IOException {
        log.error("Erreur JWT: {} - {}", errorCode, message);

        response.setContentType("application/json");
        response.setStatus(status.value());
        response.getWriter().write(
                String.format("{\"error\": \"%s\", \"message\": \"%s\"}",
                        errorCode, message));
    }
}
