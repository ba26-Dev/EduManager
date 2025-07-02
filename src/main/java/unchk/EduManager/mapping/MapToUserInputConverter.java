package unchk.EduManager.mapping;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import unchk.EduManager.Dto.EleveInput;
import unchk.EduManager.Dto.EnseignantInput;
import unchk.EduManager.Dto.ParentInput;
import unchk.EduManager.Dto.UserDto;
import unchk.EduManager.Dto.UserInput;
import unchk.EduManager.model.User;

@Component
public class MapToUserInputConverter {
    @Autowired
    private MapperUser mapperUser;

    public static UserInput convertUser(Map<String, Object> map) {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.convertValue(map, UserInput.class);
    }

    public static EleveInput convertEleve(Map<String, Object> map) {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.convertValue(map, EleveInput.class);
    }

    public static EnseignantInput convertEnseignant(Map<String, Object> map) {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.convertValue(map, EnseignantInput.class);
    }

    public static ParentInput convertParent(Map<String, Object> map) {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.convertValue(map, ParentInput.class);
    }
}
