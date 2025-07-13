package unchk.EduManager.utils;

import java.util.List;

import lombok.Data;
import unchk.EduManager.Dto.EleveDto;
import unchk.EduManager.model.Absence;
import unchk.EduManager.model.Note;

@Data
public class Bulletin {
    private EleveDto eleve;
    private List<Note> notes;
    private List<Absence> absences;
    private int totalNotes;
    private int totalCoef;
    private int moyenne;
    private String deliberation;
    private String obsevation;
}
