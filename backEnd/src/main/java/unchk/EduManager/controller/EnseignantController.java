package unchk.EduManager.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import unchk.EduManager.Dto.EnseignantDto;
import unchk.EduManager.model.Cours;
import unchk.EduManager.model.Note;
import unchk.EduManager.service.AbsenceService;
import unchk.EduManager.service.CoursService;
import unchk.EduManager.service.UserService;
import unchk.EduManager.utils.Bulletin;
import unchk.EduManager.utils.Response;
import unchk.EduManager.utils.Types;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;

@Controller
@RequestMapping("/users")
public class EnseignantController {
    @Autowired
    private CoursService coursService;
    @Autowired
    private UserService userService;
    @Autowired
    private AbsenceService absenceService;

    @PostMapping("/create_cours")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<?> create_cours(@RequestBody Cours cours,
            @AuthenticationPrincipal UserDetails currentUser) {
        Response response = userService.getBySubject(currentUser.getUsername());
        Optional<? extends EnseignantDto> enseignant = (Optional<? extends EnseignantDto>) response.getMessage();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(coursService.createCours(cours, enseignant.get().getId(), Types.COURS.toString()));
    }

    @GetMapping("/get_cours_of_classeroom/classeroomID/{classeroomID}/semestre/{semestre}")
    @PreAuthorize("hasAnyRole('ENSEIGNANT','ELEVE','RESPONSABLE','ADMIN','PARENT')")
    public ResponseEntity<?> get_cours_of_classeroom(@PathVariable String classeroomID, @PathVariable int semestre) {
        return ResponseEntity.ok(coursService.getCoursOfClasseroom(classeroomID, semestre, Types.COURS.toString()));
    }

    @GetMapping("/get_cours/{coursID}")
    @PreAuthorize("hasAnyRole('ENSEIGNANT','ELEVE','RESPONSABLE')")
    public ResponseEntity<?> getCoursById(@PathVariable String coursID,
            @AuthenticationPrincipal UserDetails currentUser) {
        Response response = coursService.getCoursById(coursID, currentUser.getAuthorities().toString());
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @PutMapping("/update_cours/{coursID}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<?> putMethodName(@PathVariable String coursID, @RequestBody Cours cours) {
        Response response = coursService.updateCours(cours, coursID);
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @PutMapping("/valide_cours/{coursID}")
    @PreAuthorize("hasRole('RESPONSABLE')")
    public ResponseEntity<?> updateCours(@PathVariable String coursID, boolean status) {
        Response response = coursService.toValideCours(coursID, status);
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @PostMapping("/create_note")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<?> giveNote(@RequestBody Note note) {
        return ResponseEntity.ok(coursService.takeNote(note));
    }

    @PutMapping("/update_note/{noteID}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<?> updateNote(@PathVariable String noteID, @RequestBody Note note) {
        Response response = coursService.updateNote(note, noteID);
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @PutMapping("/give_observation/{bulletinID}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<?> giveObservation(@PathVariable String observation, @RequestBody Bulletin bulletin) {
        return ResponseEntity.ok(coursService.takesObservation(bulletin, observation));
    }

    @PutMapping("/valide_absence/{absenceID}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<?> valideAbsence(@PathVariable String absenceID, @RequestBody boolean validity) {
        Response response = absenceService.valideAbsance(absenceID, validity);
        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }
}
