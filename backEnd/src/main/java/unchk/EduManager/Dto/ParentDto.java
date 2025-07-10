package unchk.EduManager.Dto;

import java.util.List;

import lombok.Data;

@Data
public class ParentDto extends UserDto {
    private List<String> childEmail;

}
