package unchk.EduManager.model;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Document(collection = "emploiDuTemps")
@Data
public class EmploiDuTemps {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private int semestre; 
    private String startDate;
    private String endDate;
    private List<Sceance> sceances;
}
