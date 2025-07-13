package unchk.EduManager.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import unchk.EduManager.model.Absence;
import unchk.EduManager.repository.AbsenceRepos;
import unchk.EduManager.utils.Response;

@Service
public class AbsenceService {
    @Autowired
    private AbsenceRepos absenceRepos;

    // @Autowired
    // private

    public Absence createAbsence(Absence absence, String eleveID) {
        absence.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")).toString());
        absence.setEleveID(eleveID);
        return absenceRepos.save(absence);
    }

    public Response getAbsenceById(String absenceID) {
        Response response = new Response();
        Optional<Absence> absence = absenceRepos.findById(absenceID);
        if (!absence.isPresent()) {
            response.setCode(HttpStatus.NOT_FOUND);
            response.setMessage("Absence's id = " + absenceID + " not found");
            return response;
        }
        response.setCode(HttpStatus.OK);
        response.setMessage(absence.get());
        return response;
    }

    public List<Absence> getAbsencesNotJustifed(String eleveID) {
        List<Absence> absences = new ArrayList<>();
        for (Absence absence : absenceRepos.findByJustify(false)) {
            if (eleveID.equals(absence.getEleveID())) {
                absences.add(absence);
            }
        }
        return absences;
    }

    public Response valideAbsance(String absenceID, boolean validity) {
        Response response = new Response();
        Optional<Absence> absence = absenceRepos.findById(absenceID);
        if (!absence.isPresent()) {
            response.setCode(HttpStatus.NOT_FOUND);
            response.setMessage("Absence's id = " + absenceID + " not found");
            return response;
        }
        response.setCode(HttpStatus.OK);
        absence.get().setStatus(validity);
        response.setMessage(absence.get());
        return response;
    }

    public Response justifyAbsence(String absenceID, Absence absence) {
        Response response = new Response();
        Optional<Absence> absenceToJustify = absenceRepos.findById(absenceID);
        if (!absenceToJustify.isPresent()) {
            response.setCode(HttpStatus.NOT_FOUND);
            response.setMessage("Absence's id = " + absenceID + " not found");
            return response;
        }
        if (!absence.getMotif().isEmpty()) {
            absenceToJustify.get().setMotif(absence.getMotif());
        }
        if (!absence.getPreuve().isEmpty()) {
            absenceToJustify.get().setPreuve(absence.getPreuve());
        }
        if (!absenceToJustify.get().isJustify() && (!absence.getMotif().isEmpty() || !absence.getPreuve().isEmpty())) {
            absenceToJustify.get().setJustify(absence.isJustify());
        }
        response.setCode(HttpStatus.OK);
        response.setMessage(absenceToJustify.get());
        return response;
    }

}
