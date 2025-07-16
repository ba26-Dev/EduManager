package unchk.EduManager.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import unchk.EduManager.Dto.CoursLayout;
import unchk.EduManager.Dto.EleveDto;
import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.mapping.MapperCours;
import unchk.EduManager.model.Content;
import unchk.EduManager.model.Cours;
import unchk.EduManager.model.Eleve;
import unchk.EduManager.model.Note;
import unchk.EduManager.model.User;
import unchk.EduManager.repository.CoursRepos;
import unchk.EduManager.repository.NoteRepos;
import unchk.EduManager.utils.Bulletin;
import unchk.EduManager.utils.Response;
import unchk.EduManager.utils.Role;
import unchk.EduManager.utils.Status;

@Service
public class CoursService {
    @Autowired
    private CoursRepos coursRepos;
    @Autowired
    private MapperCours mapperCours;
    @Autowired
    private NoteRepos noteRepos;
    @Autowired
    private AbsenceService absenceService;

    public Cours createCours(Cours cours, String enseignantID, String types) {
        cours.setEnseignantID(enseignantID);
        cours.setTypes(types);
        cours.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")).toString());
        return coursRepos.save(cours);
    }

    public List<Cours> getAllCours() {
        return coursRepos.findAll();
    }

    public List<CoursLayout> getCoursOfClasseroom(String classeroomID, int semestre, String types) {
        List<CoursLayout> layouts = new ArrayList<>();
        for (Cours cours : coursRepos.findByTypes(types)) {
            if (cours.getClasseroomID().equals(classeroomID) && cours.getSemestre() == semestre) {
                layouts.add(mapperCours.toLayout(cours));
            }
        }
        return layouts;
    }

    public Response getCoursById(String coursID, String authority) {
        Optional<Cours> coursGetted = coursRepos.findById(coursID);
        Response response = new Response();
        if (!coursGetted.isPresent()) {
            response.setCode(HttpStatus.NOT_FOUND);
            response.setMessage("cours's id = " + coursID + " not found!");
            return response;
        }
        // les eleves ne peux pas acceder au cours si le cours n'est pas approuver par
        // l'amdin ou le responsable
        if (!coursGetted.get().isValidity() && authority.equals(Role.ROLE_ELEVE.toString())) {
            response.setCode(HttpStatus.FORBIDDEN);
            response.setMessage(coursGetted.get().getTypes() + " n'est pas encore validé");
            return response;
        }
        response.setCode(HttpStatus.OK);
        response.setMessage(coursRepos.save(coursGetted.get()));
        return response;
    }

    public Response updateCours(Cours cours, String coursID) {
        Optional<Cours> coursModified = coursRepos.findById(coursID);
        Response response = new Response();
        if (!coursModified.isPresent()) {
            response.setCode(HttpStatus.NOT_FOUND);
            response.setMessage("cours's id = " + coursID + " not found!");
            return response;
        }
        if (!cours.getTitle().isEmpty() && !cours.getTitle().equals(coursModified.get().getTitle())) {
            coursModified.get().setTitle(cours.getTitle());
        }
        if (!cours.getTypes().isEmpty() && !coursModified.get().getTypes().equals(cours.getTypes())) {
            coursModified.get().setTypes(cours.getTypes());
        }
        if (!cours.getContent().isEmpty() && !coursModified.get().getContent().equals(cours.getContent())) {
            for (Content content : cours.getContent()) {
                if (coursModified.get().getContent().contains(content)) {
                    coursModified.get().getContent().add(content);
                }
            }
        }
        response.setCode(HttpStatus.OK);
        response.setMessage(coursRepos.save(coursModified.get()));
        return response;
    }

    public Response toValideCours(String coursID, boolean valid) {
        Optional<Cours> coursModified = coursRepos.findById(coursID);
        Response response = new Response();
        if (!coursModified.isPresent()) {
            response.setCode(HttpStatus.NOT_FOUND);
            response.setMessage("cours's id = " + coursID + " not found!");
            return response;
        }
        coursModified.get().setValidity(valid);
        response.setCode(HttpStatus.OK);
        response.setMessage(coursRepos.save(coursModified.get()));
        return response;
    }

    public List<Note> getAllNoteByEleve(String eleveID, int semestre) {
        List<Note> notes = new ArrayList<>();
        for (Note note : noteRepos.findByEleveID(eleveID)) {
            if (note.getSemestre() == semestre) {
                notes.add(note);
            }
        }
        return notes;
    }

    public Note takeNote(Note note) {
        note.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")).toString());
        return noteRepos.save(note);
    }

    public Response updateNote(Note note, String noteID) {
        Optional<Note> noteModifed = noteRepos.findById(noteID);
        Response response = new Response();
        if (!noteModifed.isPresent()) {
            response.setCode(HttpStatus.NOT_FOUND);
            response.setMessage("note's id = " + noteID + " not found!");
            return response;
        }
        if (note.getCoef() != 0 && note.getCoef() != noteModifed.get().getCoef()) {
            noteModifed.get().setCoef(note.getCoef());
        }
        if (note.getValue() != 0 && note.getValue() != noteModifed.get().getValue()) {
            noteModifed.get().setValue(note.getValue());
        }
        response.setCode(HttpStatus.OK);
        response.setMessage(noteRepos.save(noteModifed.get()));
        return response;
    }

    public int[] calculMoyenne(List<Note> noteOfEleve) {
        int totalNotes = 0;
        int totalCoef = 0;
        for (Note note : noteOfEleve) {
            totalCoef += note.getCoef();
            totalNotes += note.getValue() * note.getCoef();
        }
        int[] response = { totalNotes, totalCoef, (totalNotes / totalCoef) };
        return response;
    }

    public Response generatedBulletins(Optional<? extends UserDto> eleve, int semestre) {
        Response response = new Response();
        if (!eleve.isPresent()) {
            response.setCode(HttpStatus.NOT_FOUND);
            response.setMessage("Eleve not found");
            return response;
        }
        Bulletin bulletin = new Bulletin();
        List<Note> notes = getAllNoteByEleve(eleve.get().getId(), semestre);
        int[] calculMoyenne = calculMoyenne(notes);
        bulletin.setEleve((EleveDto) eleve.get());
        bulletin.setNotes(notes);
        bulletin.setTotalNotes(calculMoyenne[0]);
        bulletin.setTotalCoef(calculMoyenne[1]);
        bulletin.setMoyenne(calculMoyenne[3]);
        bulletin.setAbsences(absenceService.getAbsencesNotJustifed(eleve.get().getId()));
        giveDeleberation(bulletin);
        return response;
    }

    private void giveDeleberation(Bulletin bulletin) {
        if (bulletin.getMoyenne() >= 10 && bulletin.getMoyenne() < 12) {
            bulletin.setDeliberation(Status.PASSABLE.toString());
        } else if (bulletin.getMoyenne() >= 12 && bulletin.getMoyenne() < 14) {
            bulletin.setDeliberation(Status.A_BIEN.toString());
        } else if (bulletin.getMoyenne() >= 14 && bulletin.getMoyenne() < 16) {
            bulletin.setDeliberation(Status.BIEN.toString());
        } else if (bulletin.getMoyenne() >= 16 && bulletin.getMoyenne() < 18) {
            bulletin.setDeliberation(Status.TRES_BIEN.toString());
        } else if (bulletin.getMoyenne() >= 18 && bulletin.getMoyenne() < 20) {
            bulletin.setDeliberation(Status.EXCELLENT.toString());
        } else {
            bulletin.setDeliberation(Status.INSUFFISANT.toString());
        }
    }

    public Bulletin takesObservation(Bulletin bulletin, String observation) {
        bulletin.setObsevation(observation);
        return bulletin;
    }
}
