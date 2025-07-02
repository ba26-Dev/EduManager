package unchk.EduManager.model;

import java.util.List;

import org.springframework.data.annotation.TypeAlias;

import lombok.Data;
@Data
@TypeAlias("parent")
public class Parent extends User {
    private List<String> childEmail;
}