package unchk.EduManager.model;

import org.springframework.data.annotation.TypeAlias;

import lombok.Data;

@Data
@TypeAlias("enseignant")
public class Enseignant extends User{
    private String matiere;
}
