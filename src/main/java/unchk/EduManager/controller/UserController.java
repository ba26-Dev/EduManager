package unchk.EduManager.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
// import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.jwtToken.JwtUtils;
import unchk.EduManager.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    @Autowired
    private UserService userService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @GetMapping("/")
    public String getUsers() {
        return "welcom to EduManger";
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> postMethodName(@RequestBody UserInput userInput) {
        if (userService.getBySubject(userInput.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email is already in user");
        } else if (userService.getBySubject(userInput.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username is already in user");
        }
        userInput.setPassword(passwordEncoder.encode(userInput.getPassword()));
        return ResponseEntity.ok(userService.createUser(userInput));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserInput userInput) {
        try {
            // UserDto userDto = userService.getBySubject(userInput.getEmail());
            Authentication authentication = authenticationManager
                    .authenticate(
                            new UsernamePasswordAuthenticationToken(userInput.getEmail(), userInput.getPassword()));
            if (authentication.isAuthenticated()) {
                Map<String, Object> authDate = new HashMap<>();
                authDate.put("token", jwtUtils.generateToken(userInput.getEmail()));
                // log.debug("la generation de jwt == " + userDto.getRole());
                authDate.put("type", "Bearer");
                return ResponseEntity.ok(authDate);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Vous déja authentifier");
        } catch (AuthenticationException e) {
            log.error("error's", e.getMessage(), e.getCause());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

}
