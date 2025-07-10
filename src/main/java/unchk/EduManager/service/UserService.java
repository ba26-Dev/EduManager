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
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole())));
    }

    public List<UserDto> getAllUsers() {
        List<UserDto> users = new ArrayList<>();
        for (User user : userRepository.findAll()) {
            System.out.println("user ====>>> "+user.getRole());
            if (user.getRole().equals("eleve")) {
                users.add(mapperUser.toEleveDto((Eleve) user));
            } else if (user.getRole().equals("admin")) {
                users.add(mapperUser.toDto(user));
            } else if (user.getRole().equals("enseignant")) {
                users.add(mapperUser.toEnseignantDto((Enseignant) user));
            } else if (user.getRole().equals("parent")) {
                users.add(mapperUser.toParentDto((Parent) user));
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

    public String existsUser(UserInput input) {
        if (userRepository.existsByEmail(input.getEmail())) {
            System.out.println("dans le mil");
            return "this email is already in use choose another one!";
        } else if (userRepository.existsByEmail(input.getUsername())) {
            return "This username is already in use choose another one!";
        }
        return "";
    }

    // lister tous les utilisateurs not actifs
    public List<Optional<? extends User>> getNoActifUser() {
        System.out.println("================================================");
        return userRepository.findByActif(false);
    }

    // Lister tous les utilisateurs de type eleve
    public List<Optional<? extends User>> getUserByRole(String role) {
        System.out.println("================================================");
        return userRepository.findByRole(role);
    }

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
        System.out.println("<============pour input.isActif = " + input.isActif()
                + "==================pour user.get().isActif = " + user.get().isActif() + "==================>");
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

    // Cette fonction retour le Dto selon le role de l'utilisateur en parametre
    public Optional<? extends UserDto> getDto(Optional<? extends User> user) {
        switch (user.get().getRole().toUpperCase()) {
            case "ELEVE":
                return Optional.of(mapperUser.toEleveDto((Eleve) user.get()));
            case "ENSEIGNANT":
                return Optional.of(mapperUser.toEnseignantDto((Enseignant) user.get()));
            case "PARENT":
                return Optional.of(mapperUser.toParentDto((Parent) user.get()));
            default:
                return Optional.of(mapperUser.toDto(user.get()));
        }
    }
}
