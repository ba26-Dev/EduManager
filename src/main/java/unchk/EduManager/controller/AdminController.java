package unchk.EduManager.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import unchk.EduManager.Dto.EleveInput;
import unchk.EduManager.Dto.EnseignantInput;
import unchk.EduManager.Dto.ParentInput;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.mapping.MapToUserInputConverter;
import unchk.EduManager.service.ClasseSerive;
import unchk.EduManager.service.UserService;
import unchk.EduManager.utils.Utils;
import unchk.EduManager.model.Classe;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class AdminController {
    @Autowired
    private UserService userService;
    @Autowired
    private Utils utils;
    @Autowired
    private ClasseSerive classeSerive;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/no_active")
    public ResponseEntity<?> getUserNotActive() {
        return ResponseEntity.ok(userService.getNoActifUser());
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudent() {
        return ResponseEntity.ok(userService.getUserByRole("eleve"));
    }

    @GetMapping("/teachers")
    public ResponseEntity<?> getAllTeacher() {
        return ResponseEntity.ok(userService.getUserByRole("enseignant"));
    }

    @GetMapping("/parents")
    public ResponseEntity<?> getAllParent() {
        return ResponseEntity.ok(userService.getUserByRole("parent"));
    }

    @PutMapping("/update/{userIdToBeModified}")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, Object> user,
            @PathVariable String userIdToBeModified) {
        switch (user.get("role").toString().toUpperCase()) {
            case "ADMIN":
                UserInput userInput = MapToUserInputConverter.convertUser(user);
                userInput.setPassword(passwordEncoder.encode(userInput.getPassword()));
                Object reponse = userService.UpdateUserByAdmin(userInput, userIdToBeModified);
                System.out.println("response == "+reponse);
                return utils.sendReponse(reponse);
            case "ELEVE":
                EleveInput eleveInput = MapToUserInputConverter.convertEleve(user);
                eleveInput.setPassword(passwordEncoder.encode(eleveInput.getPassword()));
                reponse = userService.UpdateUserByAdmin(eleveInput, userIdToBeModified);
                return utils.sendReponse(reponse);
            case "ENSEIGNANT":
                EnseignantInput enseignantInput = MapToUserInputConverter.convertEnseignant(user);
                enseignantInput.setPassword(passwordEncoder.encode(enseignantInput.getPassword()));
                reponse = userService.UpdateUserByAdmin(enseignantInput, userIdToBeModified);
                return utils.sendReponse(reponse);
            case "PARENT":
                ParentInput parentInput = MapToUserInputConverter.convertParent(user);
                parentInput.setPassword(passwordEncoder.encode(parentInput.getPassword()));
                reponse = userService.UpdateUserByAdmin(parentInput, userIdToBeModified);
                return utils.sendReponse(reponse);
            default:
                return ResponseEntity.badRequest().body("Ce type de role n'est pas prit en compte!");
        }
    }

    @GetMapping("/class")
    public ResponseEntity<?> getClasses() {
        return ResponseEntity.ok(classeSerive.getAllClass());
    }

    @PostMapping("/create-class")
    public ResponseEntity<?> createClasse(@RequestBody Classe classe) {
        return ResponseEntity.ok(classeSerive.savClasse(classe));
    }

}
