package unchk.EduManager.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unchk.EduManager.model.Classe;
import unchk.EduManager.repository.ClassRepos;

@Service
public class ClasseSerive {
    @Autowired
    private ClassRepos classRepos;

    public List<Classe> getAllClass() {
        return classRepos.findAll();
    }

    public Classe savClasse(Classe classe){
        return classRepos.save(classe);
    }
}
