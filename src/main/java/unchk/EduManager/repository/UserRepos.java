package unchk.EduManager.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import unchk.EduManager.model.User;

@Repository
public interface UserRepos extends MongoRepository<User, String> {
    User findByEmail(String email);

    User findByUsername(String username);

    User findByPhone(String phone);
}
