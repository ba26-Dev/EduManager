package unchk.EduManager.mapping;

import org.mapstruct.Mapper;

import unchk.EduManager.Dto.EleveDto;
import unchk.EduManager.Dto.EleveInput;
import unchk.EduManager.Dto.EnseignantDto;
import unchk.EduManager.Dto.EnseignantInput;
import unchk.EduManager.Dto.ParentDto;
import unchk.EduManager.Dto.ParentInput;
import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.model.Eleve;
import unchk.EduManager.model.Enseignant;
import unchk.EduManager.model.Parent;
import unchk.EduManager.model.User;

@Mapper(componentModel = "spring")
public interface MapperUser {
    // Convertir un user saisie en une entité de l'user
    User toEntity(UserInput userInput);

    // Convertir une entity User en Dto de user
    // Le Dto permet de filter les données que l'on veut pas exposer
    UserDto toDto(User user);
    
    Eleve toEntityEleve(EleveInput eleve);
    EleveDto toEleveDto(Eleve eleve);

    Enseignant toEntityEnseignant(EnseignantInput enseignant);
    EnseignantDto toEnseignantDto(Enseignant enseignant);

    Parent toEntityParent(ParentInput parent);
    ParentDto toParentDto(Parent parent);
}
