package unchk.EduManager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/users")
@Slf4j
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping("/")
    public String getUsers() {
        return "welcom to EduManger";
    }

    @PostMapping("/register")
    public UserDto postMethodName(@RequestBody UserInput userInput) {

        return userService.createUser(userInput);
    }

}
