package unchk.EduManager.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Document(collection = "classe")
public class Classeroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String name;
    private String dateSchool;
    @Field("semestres")
    private String[] emploitDuTempsIDs = {"",""};
    private List<String> elevesID=new ArrayList<>();
    private List<String> enseignantsID=new ArrayList<>();
}
