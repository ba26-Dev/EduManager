package unchk.EduManager.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import unchk.EduManager.Dto.EleveInput;
import unchk.EduManager.Dto.EnseignantInput;
import unchk.EduManager.Dto.ParentInput;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.mapping.MapToUserInputConverter;
import unchk.EduManager.model.Classeroom;
import unchk.EduManager.model.EmploiDuTemps;
import unchk.EduManager.service.ClasseSerive;
import unchk.EduManager.service.UserService;
import unchk.EduManager.utils.Response;
import unchk.EduManager.utils.Role;
import unchk.EduManager.utils.Utils;

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
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> getUserNotActive() {
        return ResponseEntity.ok(userService.getNoActifUser());
    }

    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> getAllStudent() {
        return ResponseEntity.ok(userService.getUserByRole(Role.ROLE_ELEVE.toString()));
    }

    @GetMapping("/teachers")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> getAllTeacher() {
        return ResponseEntity.ok(userService.getUserByRole(Role.ROLE_ENSEIGNANT.toString()));
    }

    @GetMapping("/parents")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> getAllParent() {
        return ResponseEntity.ok(userService.getUserByRole(Role.ROLE_PARENT.toString()));
    }

    @PutMapping("/update/{userIdToBeModified}")
    @PreAuthorize("hasRole('ADMIN')") // seul l'admin peut effectuer cette action
    public ResponseEntity<?> updateUser(@RequestBody Map<String, Object> user,
            @PathVariable String userIdToBeModified) {
        try {
            switch (Role.valueOf(("role_" + user.get("role").toString()).toUpperCase())) {
                case ROLE_ADMIN:
                    UserInput userInput = MapToUserInputConverter.convertUser(user);
                    userInput.setPassword(passwordEncoder.encode(userInput.getPassword()));
                    Object reponse = userService.UpdateUserByAdmin(userInput, userIdToBeModified);
                    System.out.println("response == " + reponse);
                    return utils.sendReponse(reponse);
                case ROLE_ELEVE:
                    EleveInput eleveInput = MapToUserInputConverter.convertEleve(user);
                    eleveInput.setPassword(passwordEncoder.encode(eleveInput.getPassword()));
                    reponse = userService.UpdateUserByAdmin(eleveInput, userIdToBeModified);
                    return utils.sendReponse(reponse);
                case ROLE_ENSEIGNANT:
                    EnseignantInput enseignantInput = MapToUserInputConverter.convertEnseignant(user);
                    enseignantInput.setPassword(passwordEncoder.encode(enseignantInput.getPassword()));
                    reponse = userService.UpdateUserByAdmin(enseignantInput, userIdToBeModified);
                    return utils.sendReponse(reponse);
                case ROLE_PARENT:
                    ParentInput parentInput = MapToUserInputConverter.convertParent(user);
                    parentInput.setPassword(passwordEncoder.encode(parentInput.getPassword()));
                    reponse = userService.UpdateUserByAdmin(parentInput, userIdToBeModified);
                    return utils.sendReponse(reponse);
                default:
                    return ResponseEntity.badRequest().body("Ce type de role n'est pas prit en compte!");
            }
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/classerooms")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')")
    public ResponseEntity<?> getClasserooms() {
        return ResponseEntity.ok(classeSerive.getAllClasseroom());
    }

    @PostMapping("/create-classeroom")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> createClasse(@RequestBody Classeroom classe) {
        return ResponseEntity.ok(classeSerive.saveClasseroom(classe));
    }

    @PutMapping("/add-eleve/{classeroomID}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> addEleveInTheClasseroom(@PathVariable String classeroomID,
            @RequestBody List<String> eleves) {
        Response response = classeSerive.addMembers(classeroomID, eleves, Role.valueOf("role_eleve".toUpperCase()));
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @PutMapping("/add-enseignant/{classeroomID}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> addEnseignantInTheClasseroom(@PathVariable String classeroomID,
            @RequestBody List<String> enseignants) {
        Response response = classeSerive.addMembers(classeroomID, enseignants, Role.valueOf("role_enseignant"));
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @PutMapping("/add-emploi-du-temps")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> addEmploiDuTempsInTheClasseroom(@RequestBody EmploiDuTemps emploiDuTemps) {

        // Response response = classeSerive.addEmploiDuTemps(emploiDuTemps);
        // return ResponseEntity.status(response.getCode()).body(response.getMessage());
        return ResponseEntity.status(HttpStatus.CREATED).body(classeSerive.addEmploiDuTemps(emploiDuTemps));
    }

    @PutMapping("/remove-eleve/{classeroomID}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> removeEleveInTheClasseroom(@PathVariable String classeroomID,
            @RequestBody List<String> eleves) {
        Response response = classeSerive.removeMembers(classeroomID, eleves, Role.valueOf("role_eleve"));
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @PutMapping("/remove-enseignant/{classeroomID}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> removeEnseignantInTheClasseroom(@PathVariable String classeroomID,
            @RequestBody List<String> enseignants) {
        Response response = classeSerive.removeMembers(classeroomID, enseignants, Role.valueOf("role_enseignant"));
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @PutMapping("/update-emploi-du-temps/{emploiDuTempsID}")
    @PreAuthorize("hasAnyRole('ADMIN','RESPONSABLE')") // Seul le responsable ou l'admin peuvent effectuer cette action
    public ResponseEntity<?> putMethodName(@PathVariable String emploiDuTempsID,
            @RequestBody EmploiDuTemps emploiDuTemps) {
        Response response = classeSerive.updateEmploiDuTemps(emploiDuTemps, emploiDuTempsID);

        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }
}
