package unchk.EduManager.mapping;

import org.mapstruct.Mapper;

import unchk.EduManager.Dto.CoursLayout;
import unchk.EduManager.model.Cours;

@Mapper(componentModel = "spring")
public interface MapperCours {
    CoursLayout toLayout(Cours cours);
}
