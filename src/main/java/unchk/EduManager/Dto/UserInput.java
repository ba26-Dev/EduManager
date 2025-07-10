package unchk.EduManager.Dto;

import lombok.Data;

@Data
public class UserInput {
    private String id;
    private String firstname;
    private String lastname;
    private String username;
    private String email;
    private String phone;
    private String birthday;
    private String register;
    private boolean actif;
    private String[] reActif;
    private String[] dateNotActif;
    private String password;
    private String role;
}
