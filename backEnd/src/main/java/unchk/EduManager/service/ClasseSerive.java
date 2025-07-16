package unchk.EduManager.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import unchk.EduManager.model.Classeroom;
import unchk.EduManager.model.EmploiDuTemps;
import unchk.EduManager.model.Sceance;
import unchk.EduManager.repository.ClasseroomRepos;
import unchk.EduManager.repository.EmploiDuTempsRepos;
import unchk.EduManager.utils.Response;
import unchk.EduManager.utils.Role;

@Service
public class ClasseSerive {
    @Autowired
    private ClasseroomRepos classRepos;
    @Autowired
    private EmploiDuTempsRepos emploiDuTempsRepos;

    public List<Classeroom> getAllClasseroom() {
        return classRepos.findAll();
    }

    public Classeroom saveClasseroom(Classeroom classeroom) {
        classeroom.setDateSchool(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")).toString());
        return classRepos.save(classeroom);
    }

    public Optional<Classeroom> getClasseroomById(String id) {
        return classRepos.findById(id);
    }

    public Optional<EmploiDuTemps> getEmploitDuTemps(String classeroomID, int semestre) {
        Optional<Classeroom> classeroom = classRepos.findById(classeroomID);
        String semestreID = "";
        String[] emploiDuTemps = classeroom.get().getEmploitDuTempsIDs();
        System.out.println(emploiDuTemps);
        if (semestre == 1) {
            semestreID = emploiDuTemps[0];
        } else if (semestre == 2) {
            semestreID = emploiDuTemps[1];
        }
        System.out.println("emploitdutemps ===============++> "+semestreID);
        return emploiDuTempsRepos.findById(semestreID);
    }

    public Response addMembers(String classID, List<String> members, Role role) {
        Optional<Classeroom> classeroom = classRepos.findById(classID);
        Response resp = new Response();
        if (!classeroom.isPresent()) {
            resp.setCode(HttpStatus.NOT_FOUND);
            resp.setMessage("Classeroom's id = " + classID + " not found");

            return resp;
        }
        if (!members.isEmpty()) {
            for (String member : members) {
                switch (role) {
                    case ROLE_ELEVE:
                        classeroom.get().getElevesID().add(member);
                        break;
                    case ROLE_ENSEIGNANT:
                        classeroom.get().getEnseignantsID().add(member);
                        break;
                    default:
                        break;
                }
            }
        }
        resp.setCode(HttpStatus.OK);
        resp.setMessage(classRepos.save(classeroom.get()));
        return resp;
    }

    public EmploiDuTemps addEmploiDuTemps(EmploiDuTemps emploiDuTemps) {
        // Optional<Classeroom> classeroom = classRepos.findById(classeroomID);
        // Response resp = new Response();
        // if (!classeroom.isPresent()) {
        // resp.setCode(HttpStatus.NOT_FOUND);
        // resp.setMessage("Classeroom's id = " + classeroomID + " not found");

        // return resp;
        // }
        // if (emploiDuTemps.getSemestre() == 1 || emploiDuTemps.getSemestre() == 2) {
        // emploiDuTempsRepos.save(new EmploiDuTemps());
        // if (emploiDuTemps.getSemestre() == 1) {
        // classeroom.get().getEmploitDuTempsIDs()[0] = emploiDuTemps.getId();
        // } else if (emploiDuTemps.getSemestre() == 2) {
        // classeroom.get().getEmploitDuTempsIDs()[1] = emploiDuTemps.getId();
        // }
        // } else {
        // resp.setCode(HttpStatus.BAD_REQUEST);
        // resp.setMessage("There are only two semesters in a school year");
        // return resp;
        // }
        // resp.setCode(HttpStatus.OK);
        // resp.setMessage(classRepos.save(classeroom.get()));
        return emploiDuTempsRepos.save(emploiDuTemps);
    }

    public Response removeMembers(String classeroomID, List<String> members, Role role) {
        Optional<Classeroom> classe = classRepos.findById(classeroomID);
        Response resp = new Response();
        if (!classe.isPresent()) {
            resp.setCode(HttpStatus.NOT_FOUND);
            resp.setMessage("Classeroom's id = " + classeroomID + " not found");
            return resp;
        }
        if (!members.isEmpty()) {
            for (String member : members) {
                switch (role) {
                    case ROLE_ELEVE:
                        classe.get().getElevesID().remove(member);
                        break;
                    case ROLE_ENSEIGNANT:
                        classe.get().getEnseignantsID().remove(member);
                        break;
                    default:
                        break;
                }
            }
        }
        resp.setCode(HttpStatus.OK);
        resp.setMessage(classRepos.save(classe.get()));
        return resp;
    }

    public Response updateEmploiDuTemps(EmploiDuTemps input, String emploiDuTempsID) {
        Optional<EmploiDuTemps> emploiDuTemps = emploiDuTempsRepos.findById(emploiDuTempsID);
        Response resp = new Response();
        if (!emploiDuTemps.isPresent()) {
            resp.setCode(HttpStatus.NOT_FOUND);
            resp.setMessage("EmploiDuTemps's = " + emploiDuTempsID + " not found");
            return resp;
        }
        if (input.getSemestre() != 0) {
            emploiDuTemps.get().setSemestre(input.getSemestre());
        }
        if (!input.getStartDate().isEmpty()) {
            emploiDuTemps.get().setStartDate(input.getStartDate());
        }
        if (!input.getEndDate().isEmpty()) {
            emploiDuTemps.get().setEndDate(input.getEndDate());
        }
        if (!input.getSceances().isEmpty() && !input.getSceances().equals(emploiDuTemps.get().getSceances())) {
            for (Sceance sceance : input.getSceances()) {
                if (!emploiDuTemps.get().getSceances().contains(sceance)) {
                    emploiDuTemps.get().getSceances().add(sceance);
                }
            }
        }
        resp.setCode(HttpStatus.OK);
        resp.setMessage(emploiDuTempsRepos.save(emploiDuTemps.get()));
        return resp;
    }

    public List<Classeroom> getMyClasserooms(String memberID, Role role) {
        List<Classeroom> classerooms = classRepos.findAll();
        List<Classeroom> myClasserooms = new ArrayList<>();
        for (Classeroom classeroom : classerooms) {
            if (Role.ROLE_ELEVE.equals(role)) {
                if (classeroom.getElevesID().contains(memberID)) {
                    myClasserooms.add(classeroom);
                }
            } else if (Role.ROLE_ENSEIGNANT.equals(memberID)) {
                myClasserooms.add(classeroom);
            }
        }
        return myClasserooms;
    }
}
