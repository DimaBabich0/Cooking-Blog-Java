package com.cb.backend;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    // Error UNIQUE / FK / CONSTRAINT
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = "";
        if (ex.getCause() != null && ex.getCause().getMessage().contains("ORA-00001")) {
            if (ex.getCause().getMessage().toLowerCase().contains("email")) {
                message = "Такой email уже существует";
            } else if (ex.getCause().getMessage().toLowerCase().contains("username")) {
                message = "Такой username уже существует";
            } else {
                message = "Запись нарушает уникальное ограничение";
            }
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", message));
    }

    // Common errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", ex.getMessage()));
    }
}
