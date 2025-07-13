package unchk.EduManager.model;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Document(collection = "cours")
@Data
public class Cours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String name;
    private String avatar;
    private String date;
    private String enseignantID;
    private String title;
    private List<Content> content;
    private String types;
    private String classeroomID;
    private boolean validity;
}
