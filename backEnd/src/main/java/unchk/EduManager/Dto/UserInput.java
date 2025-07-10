package unchk.EduManager.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserInput {
    private String id;
    @NotNull(message = "Le prenom de l'utilisateur ne peut etre null !!!")
    @Size(min = 5, max = 30, message = "Le prenom doit contenir 5 caractérer au minimum et 30 au maximum")
    private String firstname;
    @NotNull(message = "Le nom de l'utilisateur ne peut etre null !!!")
    @Size(min = 5, max = 30, message = "Le nom doit contenir 5 caractérer au minimum et 30 au maximum")
    private String lastname;
    @NotNull(message = "Le nom de l'utilisateur ne peut etre null !!!")
    @Size(min = 5, max = 30, message = "Le nom doit contenir 5 caractérer au minimum et 30 au maximum")
    private String username;
    @NotNull(message = "L'email ne peut etre null !!!")
    @Email(regexp = "^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$", message = "l'email doit est incorrect")
    private String email;
    @NotNull(message = "Le numero de telephone ne peut etre null !!!")
    private String phone;
    @NotNull(message = "Le phone ne peut etre null !!!")
    private String birthday;
    private String register;
    // @NotNull(message = "L'email ne peut etre null !!!")
    private boolean actif;
    private String[] reActif;
    private String[] dateNotActif;
    @NotNull(message = "Veuillez saisir un mot de passe!")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères.")
    // @Pattern(regexp = ".*[A-Z].*", message = "Le mot de passe doit contenir au
    // moins une lettre majuscule.")
    // @Pattern(regexp = ".*[a-z].*", message = "Le mot de passe doit contenir au
    // moins une lettre minuscule.")
    // @Pattern(regexp = ".*\\d.*", message = "Le mot de passe doit contenir au
    // moins un chiffre.")
    // @Pattern(regexp = ".*[!@#$%^&*(),.?\":{}|<>].*", message = "Le mot de passe
    // doit contenir au moins un caractère spécial.")
    private String password;
    @NotNull(message = "Le ROLE du user ne peut etre null !!!")
    @Pattern(regexp = "ADMIN|ELEVE|ENSEIGNANT|PARENT", message = "le role que le type ADMIN ou USER et par defaut le role sur register est USER !!!")
    private String role;
}
