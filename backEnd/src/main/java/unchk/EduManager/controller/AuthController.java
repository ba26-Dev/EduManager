package unchk.EduManager.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
import unchk.EduManager.Dto.EleveInput;
import unchk.EduManager.Dto.EnseignantInput;
import unchk.EduManager.Dto.ParentInput;
import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.jwtToken.JwtUtils;
import unchk.EduManager.mapping.MapToUserInputConverter;
import unchk.EduManager.service.UserService;
import unchk.EduManager.utils.Response;
import unchk.EduManager.utils.Role;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    @Autowired
    private UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final MapToUserInputConverter mapToUserInputConverter;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> data) {
        ResponseEntity<?> reponse = new ResponseEntity(HttpStatus.OK);
        String check = "";
        data.put("role", "ROLE_" + data.get("role").toString().toUpperCase());
        try {

            switch (Role.valueOf((data.get("role").toString()))) {
                case ROLE_ADMIN:
                    UserInput userInput = mapToUserInputConverter.convertUser(data);
                    check = userService.existsUser(userInput);
                    userInput.setPassword(passwordEncoder.encode(userInput.getPassword()));
                    if (check.isEmpty()) {
                        reponse = ResponseEntity.ok(userService.createUser(userInput));
                    } else {
                        reponse = ResponseEntity.badRequest().body(check);
                    }
                    break;
                case ROLE_RESPONSABLE:
                    userInput = mapToUserInputConverter.convertUser(data);
                    check = userService.existsUser(userInput);
                    userInput.setPassword(passwordEncoder.encode(userInput.getPassword()));
                    if (check.isEmpty()) {
                        reponse = ResponseEntity.ok(userService.createUser(userInput));
                    } else {
                        reponse = ResponseEntity.badRequest().body(check);
                    }
                    break;
                case ROLE_ELEVE:
                    EleveInput eleveInput = mapToUserInputConverter.convertEleve(data);
                    check = userService.existsUser(eleveInput);
                    eleveInput.setPassword(passwordEncoder.encode(eleveInput.getPassword()));
                    if (check.isEmpty()) {
                        reponse = ResponseEntity.ok(userService.createEleve(eleveInput));
                    } else {
                        reponse = ResponseEntity.badRequest().body(check);
                    }
                    break;
                case ROLE_ENSEIGNANT:
                    EnseignantInput enseignantInput = mapToUserInputConverter.convertEnseignant(data);
                    check = userService.existsUser(enseignantInput);
                    enseignantInput.setPassword(passwordEncoder.encode(enseignantInput.getPassword()));
                    if (check.isEmpty()) {
                        reponse = ResponseEntity.ok(userService.createEnseigant(enseignantInput));
                    } else {
                        reponse = ResponseEntity.badRequest().body(check);
                    }
                    break;
                case ROLE_PARENT:
                    ParentInput parentInput = mapToUserInputConverter.convertParent(data);
                    check = userService.existsUser(parentInput);
                    parentInput.setPassword(passwordEncoder.encode(parentInput.getPassword()));
                    Response child = userService.getBySubject(parentInput.getChildEmail().get(0));
                    if (child.getCode().equals(HttpStatus.OK)) {
                        Optional<? extends UserDto> eleve = (Optional<? extends UserDto>) child.getMessage();
                        if (eleve.isPresent()
                                && !eleve.get().getRole().toUpperCase().equals(Role.ROLE_ELEVE.toString())) {
                            reponse = ResponseEntity.badRequest().body(
                                    "Le mail indiquer pour votre enfant n'appartient à aucun eleve de la plateforme!");
                        } else {
                            if (check.isEmpty()) {
                                reponse = ResponseEntity.ok(userService.createParent(parentInput));
                            } else {
                                reponse = ResponseEntity.badRequest().body(check);
                            }
                        }
                    } else if (!child.getCode().equals(HttpStatus.OK)) {
                        reponse = ResponseEntity.badRequest()
                                .body("votre enfant n'est pas inscrit sur notre plateforme!");
                    }
                    break;
                default:
                    reponse = ResponseEntity.badRequest().body("This role is not taken into account");
                    break;
            }
            return reponse;
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // UserDto userDto = userService.getBySubject(userInput.getEmail());
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserInput userInput) {
        try {
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
            log.error("error's", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

}
