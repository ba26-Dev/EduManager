package unchk.EduManager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import unchk.EduManager.model.User;

@Repository
public interface UserRepos extends MongoRepository<User, String> {
    Optional<? extends User> findByEmail(String email);

    Optional<? extends User> findByUsername(String username);

    Optional<? extends User> findByPhone(String phone);

    List<Optional<? extends User>> findAllByRole(String role);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<Optional<? extends User>> findByActif(boolean active);

    List<Optional<? extends User>> findByRole(String role);

}
