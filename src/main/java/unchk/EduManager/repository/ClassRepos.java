package unchk.EduManager.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import unchk.EduManager.model.Classe;

@Repository
public interface ClassRepos extends MongoRepository<Classe, String> {

}
