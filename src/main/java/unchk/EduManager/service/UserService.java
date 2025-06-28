package unchk.EduManager.service;

// import java.sql.Date;
// import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import unchk.EduManager.Dto.MapperUser;
import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.model.User;
import unchk.EduManager.repository.UserRepos;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepos userRepository;
    @Autowired
    private MapperUser mapperUser;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("user not found white username " + username);
        }
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole())));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public UserDto getBySubject(String subject) {
        if (subject.contains("@")) {
            return mapperUser.toDto(userRepository.findByEmail(subject));
        }
        return mapperUser.toDto(userRepository.findByUsername(subject));
    }

    public UserDto createUser(UserInput userInput) {
        // userInput=userInput.setRegister(Date.valueOf());
        User user = mapperUser.toEntity(userInput);

        return mapperUser.toDto(userRepository.save(user));
    }
}
