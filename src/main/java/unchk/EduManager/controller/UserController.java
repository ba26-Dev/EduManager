package unchk.EduManager.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<?> getUsers() {
        System.out.println("hello");
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/mail/{mail}")
    public ResponseEntity<?> getByMail(@PathVariable("mail") String mail) {
        Optional<? extends UserDto> user = userService.getBySubject(mail);
        return ResponseEntity.ok(user.get());
    }

}
