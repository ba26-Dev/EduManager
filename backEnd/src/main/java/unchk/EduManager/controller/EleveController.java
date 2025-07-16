package unchk.EduManager.controller;

import java.nio.file.attribute.UserPrincipal;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import unchk.EduManager.Dto.EleveDto;
import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.model.Absence;
import unchk.EduManager.service.AbsenceService;
import unchk.EduManager.service.ClasseSerive;
import unchk.EduManager.service.CoursService;
import unchk.EduManager.service.UserService;
import unchk.EduManager.utils.Response;
import unchk.EduManager.utils.Role;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/users")
public class EleveController {
    @Autowired
    private CoursService coursService;
    @Autowired
    private ClasseSerive classeSerive;
    @Autowired
    private UserService userService;
    @Autowired
    private AbsenceService absenceService;

    @GetMapping("/get_my_notes/{semestre}")
    @PreAuthorize("hasRole('ELEVE')")
    public ResponseEntity<?> getMyNotes(@AuthenticationPrincipal UserDetails currentUser,
            @PathVariable int semestre) {
        Response response = userService.getBySubject(currentUser.getUsername());
        if (!response.getCode().equals(HttpStatus.OK)) {
            return ResponseEntity.status(response.getCode()).body(response.getMessage());
        }
        EleveDto eleve = (EleveDto) response.getMessage();
        return ResponseEntity.ok(coursService.getAllNoteByEleve(eleve.getId(), semestre));
    }

    @GetMapping("/get_my_Classerooms")
    @PreAuthorize("hasAnyRole('ELEVE','ENSEIGNANT','ADMIN','PARENT','RESPONSABLE')")
    public ResponseEntity<?> getMyClasserooms(@AuthenticationPrincipal UserDetails currentUser) {
        Response response = userService.getBySubject(currentUser.getUsername());
        Optional<? extends UserDto> user = (Optional<? extends UserDto>) response.getMessage();
        if (user.get().getRole().equals(Role.ROLE_ELEVE.toString())
                || user.get().getRole().equals(Role.ROLE_ENSEIGNANT.toString())) {
            return ResponseEntity
                    .ok(classeSerive.getMyClasserooms(user.get().getId(), Role.valueOf(user.get().getRole())));
        }
        return ResponseEntity.ok(classeSerive.getAllClasseroom());
    }

    @GetMapping("/get_bulletin/{eleveID}")
    @PreAuthorize("hasRole('ELEVE')")
    public ResponseEntity<?> getBulletin(@PathVariable String eleveID, int semestre,
            @AuthenticationPrincipal UserDetails currentUser) {
        Optional<? extends UserDto> eleve = null;
        Response response = null;
        if (currentUser.getAuthorities().toString().equals(Role.ROLE_ELEVE.toString())) {
            response = userService.getBySubject(currentUser.getUsername());
            if (!response.getCode().equals(HttpStatus.OK)) {
                return ResponseEntity.status(response.getCode()).body(response.getMessage());
            }
            eleve = (Optional<? extends UserDto>) response.getMessage();
        }
        response = userService.getById(eleveID);
        if (!response.getCode().equals(HttpStatus.OK)) {
            return ResponseEntity.status(response.getCode()).body(response.getMessage());
        }
        eleve = (Optional<? extends UserDto>) response.getMessage();
        response = coursService.generatedBulletins(eleve, semestre);
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @PostMapping("/request_absence")
    @PreAuthorize("hasRole('ELEVE')")
    public ResponseEntity<?> request_absence(@RequestBody Absence absence,
            @AuthenticationPrincipal UserDetails currentUser) {
        Response response = userService.getBySubject(currentUser.getUsername());
        EleveDto eleve = (EleveDto) response.getMessage();
        if (absence.getSemestre() == 0) {
            return ResponseEntity.badRequest().body("semestre invalide!");
        }
        return ResponseEntity.ok(absenceService.createAbsence(absence, eleve.getId()));
    }

    @PutMapping("/justify_absence/{absenceID}")
    @PreAuthorize("hasRole('ELEVE')")
    public ResponseEntity<?> putMethodName(@PathVariable String absenceID, @RequestBody Absence absence) {
        Response response = absenceService.justifyAbsence(absenceID, absence);
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @GetMapping("/get_absence/{eleveID}")
    public ResponseEntity<?> getAbsence(@PathVariable String eleveID) {
        Response response = absenceService.getAbsenceById(eleveID);
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

}
