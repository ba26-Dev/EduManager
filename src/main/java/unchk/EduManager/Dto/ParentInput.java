package unchk.EduManager.Dto;

import java.util.List;

import lombok.Data;

@Data
public class ParentInput extends UserInput {
    private List<String> childEmail;
}
