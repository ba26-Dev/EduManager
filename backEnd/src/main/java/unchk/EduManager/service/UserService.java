package unchk.EduManager.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import unchk.EduManager.Dto.EleveInput;
import unchk.EduManager.Dto.EnseignantInput;
import unchk.EduManager.Dto.ParentInput;
import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.mapping.MapperUser;
import unchk.EduManager.model.Eleve;
import unchk.EduManager.model.Enseignant;
import unchk.EduManager.model.Parent;
import unchk.EduManager.model.User;
import unchk.EduManager.repository.UserRepos;
import unchk.EduManager.utils.Response;
import unchk.EduManager.utils.Role;

@Service
@Slf4j
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepos userRepository;
    @Autowired
    private MapperUser mapperUser;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = null;
        if (username.contains("@")) {
            user = userRepository.findByEmail(username).orElseThrow(
                    () -> new UsernameNotFoundException("Utilisateur non trouvé avec l’email " + username));
            ;
        } else {
            user = userRepository.findByUsername(username).orElseThrow(
                    () -> new UsernameNotFoundException("Utilisateur non trouvé avec le username " + username));
            ;
        }
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.isActif(),// <----------------- ici on indique à Spring Security si l'utilisateur est actif
                true,
                true,
                true,
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole())));
    }

    public List<UserDto> getAllUsers() {
        List<UserDto> users = new ArrayList<>();
        for (User user : userRepository.findAll()) {
            System.out.println("user ====>>> " + user.getRole());
            switch (Role.valueOf(user.getRole().toUpperCase())) {
                case ROLE_ADMIN:
                    users.add(mapperUser.toDto(user));
                    break;
                case ROLE_ELEVE:
                    users.add(mapperUser.toEleveDto((Eleve) user));
                    break;
                case ROLE_ENSEIGNANT:
                    users.add(mapperUser.toEnseignantDto((Enseignant) user));
                    break;
                case ROLE_PARENT:
                    users.add(mapperUser.toParentDto((Parent) user));
                    break;
                case ROLE_RESPONSABLE:
                    users.add(mapperUser.toDto(user));
                default:
                    break;
            }
        }
        return users;
    }

    public Response getBySubject(String subject) {
        Response e = new Response();
        if (subject.contains("@")) {
            Optional<? extends User> user = userRepository.findByEmail(subject);
            if (!user.isPresent()) {
                e.setCode(HttpStatus.NOT_FOUND);
                e.setMessage("User with mail " + subject + " not found!");
                return e;
            }
            e.setCode(HttpStatus.OK);
            e.setMessage(getDto(user));
            return e;
        }
        Optional<? extends User> user = userRepository.findByUsername(subject);
        if (!user.isPresent()) {
            e.setCode(HttpStatus.NOT_FOUND);
            e.setMessage("User with username " + subject + " not found!");
            return e;
        }
        e.setCode(HttpStatus.OK);
        e.setMessage(getDto(user));
        return e;
    }

    public Response getById(String id) {
        Response e = new Response();
        Optional<? extends User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            e.setCode(HttpStatus.NOT_FOUND);
            e.setMessage("User with id " + id + " not found!");
            return e;
        }
        e.setCode(HttpStatus.OK);
        e.setMessage(getDto(user));
        return e;
    }

    public UserDto createUser(UserInput userInput) {
        userInput.setRegister(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")).toString());
        return mapperUser.toDto(userRepository.save(mapperUser.toEntity(userInput)));
    }

    public UserDto createEleve(EleveInput eleve) {
        eleve.setRegister(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")).toString());
        return mapperUser.toEleveDto(userRepository.save(mapperUser.toEntityEleve(eleve)));
    }

    public UserDto createEnseigant(EnseignantInput enseignant) {
        enseignant.setRegister(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")).toString());
        return mapperUser.toEnseignantDto(userRepository.save(mapperUser.toEntityEnseignant(enseignant)));
    }

    public UserDto createParent(ParentInput parent) {
        parent.setRegister(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")).toString());
        return mapperUser.toParentDto(userRepository.save(mapperUser.toEntityParent(parent)));
    }

    // Verifier l'existant d'un utilisateur
    public String existsUser(UserInput input) {
        if (userRepository.existsByEmail(input.getEmail())) {
            System.out.println("dans le mil");
            return "this email is already in use choose another one!";
        } else if (userRepository.existsByEmail(input.getUsername())) {
            return "This username is already in use choose another one!";
        }
        return "";
    }

    // Lister tous les utilisateurs not actifs
    public List<Optional<? extends UserDto>> getNoActifUser() {
        List<Optional<? extends UserDto>> users = new ArrayList<>();
        for (Optional<? extends User> optional : userRepository.findByActif(false)) {
            users.add(getDto(optional));
        }
        return users;
    }

    // Lister tous les utilisateurs de type eleve
    public List<Optional<? extends UserDto>> getUserByRole(String role) {
        List<Optional<? extends UserDto>> users = new ArrayList<>();
        for (Optional<? extends User> optional : userRepository.findByRole(role)) {
            users.add(getDto(optional));
        }
        return users;
    }

    // Modifier les informations d'un utilisateur mais seul l'admin pour effectuer
    // ses modifications
    public Object UpdateUserByAdmin(UserInput input, String userIdToBeModified) {

        Optional<? extends User> user = userRepository.findById(userIdToBeModified);
        Response status = checkUserRights(user, user.get().getEmail(), input);
        if (!status.getCode().equals(HttpStatus.OK)) {
            return status;
        }
        if (!input.getEmail().isEmpty() && !input.getEmail().equals(user.get().getEmail())) {
            user.get().setEmail(input.getEmail());
        }
        if (!input.getUsername().isEmpty() && !input.getUsername().equals(user.get().getUsername())) {
            user.get().setUsername(input.getUsername());
        }
        if (!input.getFirstname().isEmpty() && !input.getFirstname().equals(user.get().getFirstname())) {
            user.get().setFirstname(input.getFirstname());
        }
        if (!input.getLastname().isEmpty() && !input.getLastname().equals(user.get().getLastname())) {
            user.get().setLastname(input.getLastname());
        }

        if (!input.getPassword().isEmpty() && !input.getPassword().equals(user.get().getPassword())) {
            user.get().setPassword(input.getPassword());
        }
        if (!input.getPhone().isEmpty() && !input.getPhone().equals(user.get().getPhone())) {
            user.get().setPhone(input.getPhone());
        }
        if (!input.isActif() && user.get().isActif()) {
            user.get().setActif(false);
            user.get().getDateNotActif()
                    .add(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")).toString());
        }
        if (input.isActif() && !user.get().isActif()) {
            user.get().setActif(true);
            user.get().getReActif()
                    .add(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")).toString());
        }
        return getDto(Optional.of(userRepository.save(user.get())));
    }

    // Modifier ses propres informations"
    public Object UpdateByOwnerSelf(UserInput input, String userIdToBeModified, String currentUserEmail) {
        Optional<? extends User> user = userRepository.findById(userIdToBeModified);
        Response status = checkUserRights(user, currentUserEmail, input);
        if (!status.getCode().equals(HttpStatus.OK)) {
            return status;
        }
        if (!input.getEmail().isEmpty() && !input.getEmail().equals(currentUserEmail)) {
            user.get().setEmail(input.getEmail());
        }
        if (!input.getUsername().isEmpty() && !input.getUsername().equals(user.get().getUsername())) {
            user.get().setUsername(input.getUsername());
        }
        if (!input.getFirstname().isEmpty() && !input.getFirstname().equals(user.get().getFirstname())) {
            user.get().setFirstname(input.getFirstname());
        }
        if (!input.getLastname().isEmpty() && !input.getLastname().equals(user.get().getLastname())) {
            user.get().setLastname(input.getLastname());
        }

        if (!input.getPassword().isEmpty() && !input.getPassword().equals(user.get().getPassword())) {
            user.get().setPassword(input.getPassword());
        }
        if (!input.getPhone().isEmpty() && !input.getPhone().equals(user.get().getPhone())) {
            user.get().setPhone(input.getPhone());
        }
        return getDto(Optional.of(userRepository.save(user.get())));
    }

    // cette fonction verifie si l'id fournit est associé à un utilisateur de la
    // database ou l'email fourni en parametre ou le username existe
    // ou si l'utilisateur connecté est au authoriser à faire ces modifications
    public Response checkUserRights(Optional<? extends User> user, String currentUserEmail, UserInput input) {
        Response e = new Response();
        if (user.isPresent()) {
            if (user.get().getEmail().equals(currentUserEmail)) {
                Optional<? extends User> userFoundByEmail = userRepository.findByEmail(input.getEmail());
                Optional<? extends User> userFoundByUsername = userRepository.findByUsername(input.getUsername());
                if (userFoundByEmail.isPresent() && !userFoundByEmail.get().getEmail().equals(currentUserEmail)) {
                    e.setCode(HttpStatus.CONFLICT);
                    e.setMessage("Cette email est déja utiliser par un autre utilisateur!");
                    return e;
                }
                if (userFoundByUsername.isPresent() && !userFoundByUsername.get().getEmail().equals(currentUserEmail)) {
                    e.setCode(HttpStatus.CONFLICT);
                    e.setMessage("Cette username est déja utiliser par un autre utilisateur!");
                    return e;
                }
            } else {
                e.setCode(HttpStatus.FORBIDDEN);
                e.setMessage("Vous n'est pas authorisé à effectué cette action!");
                return e;
            }
        } else {
            e.setCode(HttpStatus.NOT_FOUND);
            e.setMessage("L'utilisateur avec cette id est non trouvé!");
            return e;
        }
        e.setCode(HttpStatus.OK);
        e.setMessage("");
        return e;
    }

    // Cette fonction retourne le Dto selon le role de l'utilisateur en parametre
    public Optional<? extends UserDto> getDto(Optional<? extends User> user) {
        switch (user.get().getRole().toUpperCase()) {
            case "ROLE_ELEVE":
                return Optional.of(mapperUser.toEleveDto((Eleve) user.get()));
            case "ROLE_ENSEIGNANT":
                return Optional.of(mapperUser.toEnseignantDto((Enseignant) user.get()));
            case "ROLE_PARENT":
                return Optional.of(mapperUser.toParentDto((Parent) user.get()));
            default:
                return Optional.of(mapperUser.toDto(user.get()));
        }
    }
}
