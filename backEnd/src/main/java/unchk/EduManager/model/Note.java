package unchk.EduManager.model;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Document("note")
@Data
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String matiere;
    private String date;
    private String coursID;
    private String eleveID;
    private String enseignantID;
    private int semestre;
    private int value;
    private int coef;
}
