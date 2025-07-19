package unchk.EduManager.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import unchk.EduManager.Dto.EleveInput;
import unchk.EduManager.Dto.EnseignantInput;
import unchk.EduManager.Dto.ParentInput;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.mapping.MapToUserInputConverter;
import unchk.EduManager.model.EmploiDuTemps;
import unchk.EduManager.service.ClasseSerive;
import unchk.EduManager.service.UserService;
import unchk.EduManager.utils.*;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private Utils utils;
    @Autowired
    private ClasseSerive classeSerive;

    @GetMapping("/")
    public ResponseEntity<?> getUsers() {
        System.out.println("hello");
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/mail/{mail}")
    public ResponseEntity<?> getByMail(@PathVariable("mail") String mail) {
        Response back = userService.getBySubject(mail);
        return ResponseEntity.status(back.getCode()).body(back.getMessage());
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") String id) {
        Response back = userService.getById(id);
        return ResponseEntity.status(back.getCode()).body(back.getMessage());
    }

    @GetMapping("/current_user")
    public ResponseEntity<?> getUserConnected(@AuthenticationPrincipal UserDetails currentUser) {
        Response back = userService.getBySubject(currentUser.getUsername());
        return ResponseEntity.status(back.getCode()).body(back.getMessage());
    }

    @GetMapping("/updateOwnerSelfe/{id}")
    public ResponseEntity<?> updateOwnerSelfe(@RequestParam Map<String, Object> user,
            @PathVariable String userIdToBeModified,
            @AuthenticationPrincipal UserDetails currentUser) {
        try {

            switch (Role.valueOf(("Role_" + user.get("role").toString()).toUpperCase())) {
                case ROLE_ADMIN:
                    UserInput userInput = MapToUserInputConverter.convertUser(user);
                    Object reponse = userService.UpdateByOwnerSelf(userInput, userIdToBeModified,
                            currentUser.getUsername());
                    return utils.sendReponse(reponse);
                case ROLE_RESPONSABLE:
                    userInput = MapToUserInputConverter.convertUser(user);
                    reponse = userService.UpdateByOwnerSelf(userInput, userIdToBeModified,
                            currentUser.getUsername());
                    return utils.sendReponse(reponse);
                case ROLE_ELEVE:
                    EleveInput eleveInput = MapToUserInputConverter.convertEleve(user);
                    reponse = userService.UpdateByOwnerSelf(eleveInput, userIdToBeModified, currentUser.getUsername());
                    return utils.sendReponse(reponse);
                case ROLE_ENSEIGNANT:
                    EnseignantInput enseignantInput = MapToUserInputConverter.convertEnseignant(user);
                    reponse = userService.UpdateByOwnerSelf(enseignantInput, userIdToBeModified,
                            currentUser.getUsername());
                    return utils.sendReponse(reponse);
                case ROLE_PARENT:
                    ParentInput parentInput = MapToUserInputConverter.convertParent(user);
                    reponse = userService.UpdateByOwnerSelf(parentInput, userIdToBeModified, currentUser.getUsername());
                    return utils.sendReponse(reponse);
                default:
                    return ResponseEntity.badRequest().body("Ce type de role n'est pas prit en compte!");
            }
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/get_emploi_du_temps/classeroomID/{classeroomID}/semestre/{semestre}")
    public ResponseEntity<?> getMethodName(@PathVariable String classeroomID, @PathVariable int semestre) {
        Optional<EmploiDuTemps> emploiDuTemps = classeSerive.getEmploitDuTemps(classeroomID, semestre);
        if (!emploiDuTemps.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body("emploit du temps not found");
        }
        return ResponseEntity.ok(emploiDuTemps.get());
    }

}
