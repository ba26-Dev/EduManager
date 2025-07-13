package unchk.EduManager.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import unchk.EduManager.model.Absence;
import java.util.List;


@Repository
public interface AbsenceRepos extends MongoRepository<Absence, String> {
    List<Absence> findByJustify(boolean justify);
}
