package unchk.EduManager.Dto;

import org.mapstruct.Mapper;

import unchk.EduManager.model.User;

@Mapper(componentModel = "spring")
public interface MapperUser {
    // Convertir un user saisie en une entité de l'user 
    User toEntity(UserInput userInput);
    // Convertir une entity User en Dto de user
    // Le Dto permet de filter les données que l'on veut pas exposer
    UserDto toDto(User user);
}
