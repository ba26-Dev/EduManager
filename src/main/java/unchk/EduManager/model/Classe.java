package unchk.EduManager.model;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Document(collection = "classe")
public class Classe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String name;
    private String dateSchool;
    private EmploiDuTemps semestre1;
    private EmploiDuTemps semestre2;
}
