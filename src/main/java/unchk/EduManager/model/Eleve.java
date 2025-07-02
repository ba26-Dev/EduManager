package unchk.EduManager.model;

import org.springframework.data.annotation.TypeAlias;

import lombok.Data;

@Data
@TypeAlias("eleve")
public class Eleve extends User {
    private String classe;
}
