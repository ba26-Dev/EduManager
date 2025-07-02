package unchk.EduManager.service;

// import java.sql.Date;
// import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
// import unchk.EduManager.repository.EleveRepos;
// import unchk.EduManager.repository.EnseignantRepos;
// import unchk.EduManager.repository.ParentRepos;
import unchk.EduManager.repository.UserRepos;

@Service
@Slf4j
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepos userRepository;
    // @Autowired
    // private EleveRepos eleveRepository;
    // @Autowired
    // private EnseignantRepos enseignantRepository;
    // @Autowired
    // private ParentRepos parentRepository;
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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<? extends UserDto> getBySubject(String subject) {
        if (subject.contains("@")) {
            User user = userRepository.findByEmail(subject).orElseThrow(
                    () -> new UsernameNotFoundException("Utilisateur non trouvé avec le subject " + subject));
            System.out.println("subjet===> " + subject + " user ===> " + user);
            switch (user.getRole().toUpperCase()) {
                case "ELEVE":
                    return Optional.of(mapperUser.toEleveDto((Eleve) user));
                case "ENSEIGNANT":
                    System.out.println("ENSEIGNANT ==================++++>"
                            + Optional.of(mapperUser.toEnseignantDto((Enseignant) user)));
                    return Optional
                            .of(mapperUser.toEnseignantDto((Enseignant) user));
                case "PARENT":
                    return Optional.of(mapperUser.toParentDto((Parent) user));
                default:
                    return Optional.of(mapperUser.toDto(user));
            }
        }
        User user = userRepository.findByUsername(subject).orElseThrow(
                () -> new UsernameNotFoundException("Utilisateur non trouvé avec le subject " + subject));
        System.out.println("subjet===> " + subject + " user ===> " + user);
        switch (user.getRole().toUpperCase()) {
            case "ELEVE":
                return Optional.of(mapperUser.toEleveDto((Eleve) user));
            case "ENSEIGNANT":
                return Optional.of(mapperUser.toEnseignantDto((Enseignant) user));
            case "PARENT":
                return Optional.of(mapperUser.toParentDto((Parent) user));
            default:
                return Optional.of(mapperUser.toDto(user));
        }
    }

    public UserDto createUser(UserInput userInput) {
        // userInput=userInput.setRegister(Date.valueOf())
        return mapperUser.toDto(userRepository.save(mapperUser.toEntity(userInput)));
    }

    public UserDto createEleve(EleveInput Eleve) {
        // userInput=userInput.setRegister(Date.valueOf())
        return mapperUser.toEleveDto(userRepository.save(mapperUser.toEntityEleve(Eleve)));
    }

    public UserDto createEnseigant(EnseignantInput enseignant) {
        // userInput=userInput.setRegister(Date.valueOf())
        return mapperUser.toEnseignantDto(userRepository.save(mapperUser.toEntityEnseignant(enseignant)));
    }

    public UserDto createParent(ParentInput parent) {
        // userInput=userInput.setRegister(Date.valueOf())
        return mapperUser.toParentDto(userRepository.save(mapperUser.toEntityParent(parent)));
    }

    public String existsUser(UserInput input) {
        if (userRepository.existsByEmail(input.getEmail())) {
            return "this email is already in use choose another one!";
        } else if (userRepository.existsByEmail(input.getUsername())) {
            return "This username is already in use choose another one!";
        }
        return "";
    }
}
