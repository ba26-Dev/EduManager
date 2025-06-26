package unchk.EduManager.model;

import java.sql.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;

@Document(collection = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String firstname;
    private String lastname;
    private String username;
    private String email;
    private String phone;
    private String birthday;
    private String register;
    private boolean active;
    private String dateNotActive;
    private String password;
    private String role;
}
