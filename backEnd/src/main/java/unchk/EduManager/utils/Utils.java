package unchk.EduManager.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import unchk.EduManager.model.EmploiDuTemps;

@Component
public class Utils {

    public ResponseEntity<?> sendReponse(Object response) {
        if (response instanceof Response) {
            Response resp = (Response) response;
            return ResponseEntity.status(resp.getCode()).body(resp.getMessage());
        }
        System.out.println("object " + response);
        return ResponseEntity.ok(response);
    }

    public LocalDate formatDate(String dateStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return LocalDate.parse(dateStr, formatter);
    }

    // public int getSemestre(EmploiDuTemps emploiDuTemps){
    //     LocalDate currentDate=LocalDate.now();
    //     LocalDate startDateSemestre=formatDate(emploiDuTemps.getStartDate());
    //     LocalDate endDateSemestre=formatDate(emploiDuTemps.getEndDate());
    //     return (currentDate.isAfter(startDateSemestre) &&currentDate.isBefore(endDateSemestre))
    // }
}
