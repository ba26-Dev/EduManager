package unchk.EduManager.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
import unchk.EduManager.service.UserService;
import unchk.EduManager.utils.*;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private Utils utils;

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

    @GetMapping("/updateOwnerSelfe/{id}")
    public ResponseEntity<?> updateOwnerSelfe(@RequestParam Map<String, Object> user,
            @PathVariable String userIdToBeModified,
            @AuthenticationPrincipal UserDetails currentUser) {
        switch (user.get("role").toString().toUpperCase()) {
            case "ADMIN":
                UserInput userInput = MapToUserInputConverter.convertUser(user);
                Object reponse = userService.UpdateByOwnerSelf(userInput, userIdToBeModified,
                        currentUser.getUsername());
                return utils.sendReponse(reponse);
            case "ELEVE":
                EleveInput eleveInput = MapToUserInputConverter.convertEleve(user);
                reponse = userService.UpdateByOwnerSelf(eleveInput, userIdToBeModified, currentUser.getUsername());
                return utils.sendReponse(reponse);
            case "ENSEIGNANT":
                EnseignantInput enseignantInput = MapToUserInputConverter.convertEnseignant(user);
                reponse = userService.UpdateByOwnerSelf(enseignantInput, userIdToBeModified, currentUser.getUsername());
                return utils.sendReponse(reponse);
            case "PARENT":
                ParentInput parentInput = MapToUserInputConverter.convertParent(user);
                reponse = userService.UpdateByOwnerSelf(parentInput, userIdToBeModified, currentUser.getUsername());
                return utils.sendReponse(reponse);
            default:
                return ResponseEntity.badRequest().body("Ce type de role n'est pas prit en compte!");
        }
    }
}
