package unchk.EduManager.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import unchk.EduManager.model.Classeroom;

@Repository
public interface ClasseroomRepos extends MongoRepository<Classeroom, String> {

}
