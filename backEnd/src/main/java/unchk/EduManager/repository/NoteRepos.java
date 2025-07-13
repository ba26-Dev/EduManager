package unchk.EduManager.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import unchk.EduManager.model.Note;
import java.util.List;

public interface NoteRepos extends MongoRepository<Note, String> {
    List<Note> findByEleveID(String eleveID);
}
