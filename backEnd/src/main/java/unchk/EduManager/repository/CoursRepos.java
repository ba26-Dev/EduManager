package unchk.EduManager.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import unchk.EduManager.model.Cours;

@Repository
public interface CoursRepos extends MongoRepository<Cours, String> {
    List<Cours> findByTypes(String types);
}
