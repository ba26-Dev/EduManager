package unchk.EduManager.Dto;

import lombok.Data;

@Data
public class UserDto {
    private String firstname;
    private String lastname;
    private String username;
    private String email;
    private String phone;
    private String birthday;
    private String register;
    private boolean active;
    private String dateNotActive;
    private String role;
}
