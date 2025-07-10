package unchk.EduManager.utils;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class Utils {

    public ResponseEntity<?> sendReponse(Object response) {
        if (response instanceof Response) {
            Response resp = (Response) response;
            return ResponseEntity.status(resp.getCode()).body(resp.getMessage());
        }
        System.out.println("object "+response);
        return ResponseEntity.ok(response);
    }
}
