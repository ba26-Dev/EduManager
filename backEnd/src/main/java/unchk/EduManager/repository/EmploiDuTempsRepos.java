package unchk.EduManager.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import unchk.EduManager.model.EmploiDuTemps;

@Repository
public interface EmploiDuTempsRepos extends MongoRepository<EmploiDuTemps, String> {

}
