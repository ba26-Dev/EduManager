package unchk.EduManager.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unchk.EduManager.Dto.MapperUser;
import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.model.User;
import unchk.EduManager.repository.UserRepos;

@Service
public class UserService {
    @Autowired
    private UserRepos userRepository;
    @Autowired
    private MapperUser mapperUser;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public UserDto createUser(UserInput userInput) {
        User user = mapperUser.toEntity(userInput);

        return mapperUser.toDto(userRepository.save(user));
    }
}
