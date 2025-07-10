package unchk.EduManager.utils;

import org.springframework.http.HttpStatus;

import lombok.Data;

@Data
public class Response {
    private HttpStatus code;
    private Object message;
}
